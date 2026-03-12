import { createServer } from 'node:http'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import {
  sendApplicationEmail,
  sendContactEmail,
  sendForeclosedPropertyEmail,
  sendInquiryEmail,
  sendUserConfirmationEmail,
} from './email.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, 'data')
const PROPERTIES_FILE = path.join(DATA_DIR, 'properties.json')
const ADMIN_USERS_FILE = path.join(DATA_DIR, 'admin-users.json')
const AUTH_LOG_FILE = path.join(DATA_DIR, 'auth-log.json')

const DEFAULT_DEV_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173']
const PRODUCT_OPTIONS = new Set(['Real Estate Mortgage', 'Real Estate Takeout', 'Acquisition Loan'])
const PROPERTY_PLACEHOLDER_URL = '/images/property-placeholder.svg'
const MAX_PROPERTY_IMAGES = 10

const PORT = readPositiveInteger(process.env.PORT, 4000, 1)
const NODE_ENV = String(process.env.NODE_ENV || 'development').trim().toLowerCase()
const SESSION_TTL_MS = readPositiveInteger(process.env.SESSION_TTL_MS, 1000 * 60 * 30, 60_000)
const MAX_BODY_BYTES = readPositiveInteger(process.env.MAX_BODY_BYTES, 2 * 1024 * 1024, 32_768)
const MAX_PROPERTY_IMAGE_URL_LENGTH = readPositiveInteger(process.env.MAX_PROPERTY_IMAGE_URL_LENGTH, 2048, 256)
const MAX_LEGACY_DATA_URL_LENGTH = readPositiveInteger(process.env.MAX_LEGACY_DATA_URL_LENGTH, 64 * 1024, 4096)
const LOGIN_RATE_LIMIT_MAX = readPositiveInteger(process.env.LOGIN_RATE_LIMIT_MAX, 5, 1)
const LOGIN_RATE_LIMIT_WINDOW_MS = readPositiveInteger(process.env.LOGIN_RATE_LIMIT_WINDOW_MS, 1000 * 60 * 15, 1000)
const FORM_RATE_LIMIT_MAX = readPositiveInteger(process.env.FORM_RATE_LIMIT_MAX, 8, 1)
const FORM_RATE_LIMIT_WINDOW_MS = readPositiveInteger(process.env.FORM_RATE_LIMIT_WINDOW_MS, 1000 * 60 * 10, 1000)
const ADMIN_MUTATION_RATE_LIMIT_MAX = readPositiveInteger(process.env.ADMIN_MUTATION_RATE_LIMIT_MAX, 30, 1)
const ADMIN_MUTATION_RATE_LIMIT_WINDOW_MS = readPositiveInteger(process.env.ADMIN_MUTATION_RATE_LIMIT_WINDOW_MS, 1000 * 60, 1000)
const ALLOWED_ORIGINS = parseAllowedOrigins(process.env.CORS_ALLOWED_ORIGINS)

const sessions = new Map()
const rateLimitStore = new Map()

function readPositiveInteger(value, fallback, minimum) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= minimum ? Math.floor(parsed) : fallback
}

function parseAllowedOrigins(value) {
  const configuredOrigins = String(value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  if (configuredOrigins.length > 0) {
    return new Set(configuredOrigins)
  }

  return NODE_ENV === 'production' ? new Set() : new Set(DEFAULT_DEV_ORIGINS)
}

function makeHttpError(statusCode, message, headers = {}) {
  const error = new Error(message)
  error.statusCode = statusCode
  error.headers = headers
  return error
}

function getClientIp(req) {
  const forwardedFor = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()
  return forwardedFor || req.socket.remoteAddress || 'unknown'
}

function getRequestOrigin(req) {
  const forwardedProto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim()
  const protocol = forwardedProto || 'http'
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').trim()
  return host ? `${protocol}://${host}` : ''
}

function isAllowedOrigin(req, origin) {
  if (!origin) return true
  if (ALLOWED_ORIGINS.has(origin)) return true
  return origin === getRequestOrigin(req)
}

function assertCorsAllowed(req) {
  const origin = String(req.headers.origin || '').trim()
  if (origin && !isAllowedOrigin(req, origin)) {
    throw makeHttpError(403, 'Origin not allowed.')
  }
}

function getResponseHeaders(req, pathname) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Max-Age': '86400',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  }

  const origin = String(req.headers.origin || '').trim()
  if (origin && isAllowedOrigin(req, origin)) {
    headers['Access-Control-Allow-Origin'] = origin
    headers.Vary = 'Origin'
  }

  if (pathname.startsWith('/api/admin')) {
    headers['Cache-Control'] = 'no-store'
  }

  return headers
}

function sendJson(req, res, statusCode, payload, pathname, extraHeaders = {}) {
  res.writeHead(statusCode, {
    ...getResponseHeaders(req, pathname),
    ...extraHeaders,
  })
  res.end(JSON.stringify(payload))
}

function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const hash = scryptSync(password, salt, 64).toString('hex')
  return { salt, hash }
}

function verifyPassword(password, salt, hash) {
  const testHash = scryptSync(password, salt, 64)
  const storedHash = Buffer.from(hash, 'hex')
  return testHash.length === storedHash.length && timingSafeEqual(testHash, storedHash)
}

async function readJsonFile(filePath, fallbackValue) {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw)
  } catch (error) {
    if (error.code === 'ENOENT') return fallbackValue
    throw error
  }
}

async function writeJsonFile(filePath, data) {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
  } catch (error) {
    if (['EROFS', 'EPERM', 'EACCES'].includes(error.code)) {
      throw makeHttpError(
        503,
        'Server data storage is not writable. Use persistent storage or move data to a database before deploying.',
      )
    }

    throw error
  }
}

function normalizeWhitespace(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim()
}

function sanitizeSingleLine(value, maxLength = 160) {
  return normalizeWhitespace(value).slice(0, maxLength)
}

function sanitizeMultiline(value, maxLength = 2000) {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => normalizeWhitespace(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLength)
}

function sanitizeEmail(value) {
  return String(value ?? '').trim().toLowerCase().slice(0, 254)
}

function sanitizePhone(value) {
  return String(value ?? '')
    .replace(/[^\d+()\-\s]/g, '')
    .trim()
    .slice(0, 32)
}

function sanitizeBoolean(value) {
  return value === true || value === 'true' || value === 'on' || value === 1 || value === '1'
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidPhone(value) {
  return /^[+\d()[\]\-\s]{7,20}$/.test(value)
}

function parseMoney(value) {
  const amount = Number(value)
  return Number.isFinite(amount) && amount >= 0 ? Math.round(amount) : 0
}

function parseWholeNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback
}

function parsePropertyId(value) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : Date.now()
}

function isHostedImageUrl(value) {
  return Boolean(value) &&
    value.length <= MAX_PROPERTY_IMAGE_URL_LENGTH &&
    (value.startsWith('/') || /^https?:\/\//i.test(value))
}

function isLegacyImageDataUrl(value) {
  return /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value) && value.length <= MAX_LEGACY_DATA_URL_LENGTH
}

function collectImageCandidates(inputImageUrls, fallbackImageUrl = '') {
  if (Array.isArray(inputImageUrls)) {
    return inputImageUrls
  }

  if (fallbackImageUrl) {
    return [fallbackImageUrl]
  }

  return []
}

function normalizeImageUrls(inputImageUrls, fallbackImageUrl = '', { allowLegacyDataUrl = false } = {}) {
  const unique = new Set()

  return collectImageCandidates(inputImageUrls, fallbackImageUrl)
    .map((item) => String(item || '').trim())
    .filter((item) => {
      if (!item) return false

      const isSafe = isHostedImageUrl(item) || (allowLegacyDataUrl && isLegacyImageDataUrl(item))
      if (!isSafe || unique.has(item)) return false

      unique.add(item)
      return true
    })
    .slice(0, MAX_PROPERTY_IMAGES)
}

function sanitizeStatus(value) {
  const status = sanitizeSingleLine(value || 'Available', 40)
  return status || 'Available'
}

function sanitizeProperty(input = {}, existing = {}, options = {}) {
  const fallbackImageUrl = input.imageUrl || existing.imageUrl || ''
  const incomingImages = collectImageCandidates(input.imageUrls, fallbackImageUrl)
  const imageUrls = normalizeImageUrls(input.imageUrls, fallbackImageUrl, {
    allowLegacyDataUrl: options.allowLegacyDataUrl,
  })
  const shouldUsePlaceholder = options.usePlaceholderForInvalidImages && incomingImages.length > 0 && imageUrls.length === 0
  const finalImageUrls = shouldUsePlaceholder ? [PROPERTY_PLACEHOLDER_URL] : imageUrls

  return {
    id: parsePropertyId(existing.id ?? input.id),
    name: sanitizeSingleLine(input.name ?? existing.name, 160),
    type: sanitizeSingleLine(input.type ?? existing.type, 120),
    location: sanitizeSingleLine(input.location ?? existing.location, 160),
    price: parseMoney(input.price ?? existing.price),
    size: sanitizeSingleLine(input.size ?? existing.size, 64),
    bedrooms: parseWholeNumber(input.bedrooms ?? existing.bedrooms),
    bathrooms: parseWholeNumber(input.bathrooms ?? existing.bathrooms),
    features: sanitizeMultiline(input.features ?? existing.features, 600),
    status: sanitizeStatus(input.status ?? existing.status),
    imageUrls: finalImageUrls,
    imageUrl: finalImageUrls[0] || '',
  }
}

function validateProperty(property) {
  const requiredTextFields = ['name', 'type', 'location', 'size', 'features', 'status']
  for (const field of requiredTextFields) {
    if (!property[field]) {
      return `${field} is required`
    }
  }

  if (!Number.isFinite(property.price) || property.price <= 0) return 'price must be greater than 0'
  if (!Number.isInteger(property.bedrooms) || property.bedrooms < 0) return 'bedrooms must be 0 or more'
  if (!Number.isInteger(property.bathrooms) || property.bathrooms < 0) return 'bathrooms must be 0 or more'
  if (property.imageUrls.length > MAX_PROPERTY_IMAGES) return `Maximum of ${MAX_PROPERTY_IMAGES} images per property.`
  if (property.imageUrls.some((url) => !isHostedImageUrl(url))) {
    return 'Property images must use hosted URLs or site-relative paths.'
  }

  return ''
}

function sanitizeStoredAdminUsers(users) {
  const unique = new Set()

  return users
    .filter((user) => user && typeof user === 'object')
    .map((user) => ({
      username: sanitizeSingleLine(user.username, 254).toLowerCase(),
      salt: String(user.salt || '').trim(),
      hash: String(user.hash || '').trim(),
    }))
    .filter((user) => user.username && user.salt && user.hash && !unique.has(user.username) && unique.add(user.username))
}

function sanitizeAuthLogEntry(entry = {}) {
  const timestamp = new Date(entry.timestamp || Date.now())

  return {
    timestamp: Number.isNaN(timestamp.getTime()) ? new Date().toISOString() : timestamp.toISOString(),
    username: sanitizeSingleLine(entry.username, 254),
    success: Boolean(entry.success),
    ip: sanitizeSingleLine(entry.ip, 128),
    userAgent: sanitizeSingleLine(entry.userAgent, 400),
  }
}

function getBootstrapAdminUser() {
  const username = sanitizeSingleLine(process.env.ADMIN_BOOTSTRAP_USERNAME, 254).toLowerCase()
  const password = String(process.env.ADMIN_BOOTSTRAP_PASSWORD || '')

  if (!username || password.length < 12) {
    return null
  }

  return { username, password }
}

async function bootstrapData() {
  await fs.mkdir(DATA_DIR, { recursive: true })

  const rawProperties = await readJsonFile(PROPERTIES_FILE, null)
  const sanitizedProperties = Array.isArray(rawProperties)
    ? rawProperties.map((property) => sanitizeProperty(property, {}, {
      allowLegacyDataUrl: false,
      usePlaceholderForInvalidImages: true,
    }))
    : []

  if (!Array.isArray(rawProperties) || JSON.stringify(rawProperties) !== JSON.stringify(sanitizedProperties)) {
    await writeJsonFile(PROPERTIES_FILE, sanitizedProperties)
  }

  const rawAdminUsers = await readJsonFile(ADMIN_USERS_FILE, null)
  let adminUsers = sanitizeStoredAdminUsers(Array.isArray(rawAdminUsers) ? rawAdminUsers : [])

  if (adminUsers.length === 0) {
    const bootstrapAdmin = getBootstrapAdminUser()
    if (bootstrapAdmin) {
      adminUsers = [
        {
          username: bootstrapAdmin.username,
          ...hashPassword(bootstrapAdmin.password),
        },
      ]
      console.log('Created bootstrap admin user from environment.')
    } else {
      console.warn(
        'No admin users provisioned. Set ADMIN_BOOTSTRAP_USERNAME and ADMIN_BOOTSTRAP_PASSWORD or provide server/data/admin-users.json before deploying.',
      )
    }
  }

  if (!Array.isArray(rawAdminUsers) || JSON.stringify(rawAdminUsers) !== JSON.stringify(adminUsers)) {
    await writeJsonFile(ADMIN_USERS_FILE, adminUsers)
  }

  const rawAuthLogs = await readJsonFile(AUTH_LOG_FILE, null)
  const authLogs = Array.isArray(rawAuthLogs)
    ? rawAuthLogs.slice(-500).map((entry) => sanitizeAuthLogEntry(entry))
    : []

  if (!Array.isArray(rawAuthLogs) || JSON.stringify(rawAuthLogs) !== JSON.stringify(authLogs)) {
    await writeJsonFile(AUTH_LOG_FILE, authLogs)
  }
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let byteLength = 0

    req.on('data', (chunk) => {
      byteLength += chunk.length

      if (byteLength > MAX_BODY_BYTES) {
        reject(makeHttpError(413, 'Request payload too large.'))
        req.destroy()
        return
      }

      chunks.push(chunk)
    })

    req.on('end', () => {
      if (chunks.length === 0) {
        resolve({})
        return
      }

      try {
        const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'))
        if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
          reject(makeHttpError(400, 'JSON body must be an object.'))
          return
        }

        resolve(parsed)
      } catch {
        reject(makeHttpError(400, 'Invalid JSON body.'))
      }
    })

    req.on('error', reject)
  })
}

function getBearerToken(req) {
  const auth = String(req.headers.authorization || '')
  if (!auth.startsWith('Bearer ')) return ''
  return auth.slice('Bearer '.length)
}

function pruneExpiredSessions() {
  const now = Date.now()

  for (const [token, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(token)
    }
  }
}

function getSession(req) {
  pruneExpiredSessions()

  const token = getBearerToken(req)
  if (!token) return null

  const session = sessions.get(token)
  if (!session) return null

  if (Date.now() > session.expiresAt) {
    sessions.delete(token)
    return null
  }

  return session
}

function enforceRateLimit(bucket, req, limit, windowMs) {
  const key = `${bucket}:${getClientIp(req)}`
  const now = Date.now()
  const existing = rateLimitStore.get(key)

  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return
  }

  if (existing.count >= limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
    throw makeHttpError(429, 'Too many requests. Please try again later.', {
      'Retry-After': String(retryAfterSeconds),
    })
  }

  existing.count += 1
}

async function appendAuthLog(entry) {
  const currentLogs = await readJsonFile(AUTH_LOG_FILE, [])
  const nextLogs = Array.isArray(currentLogs) ? currentLogs : []
  nextLogs.push(sanitizeAuthLogEntry(entry))
  await writeJsonFile(AUTH_LOG_FILE, nextLogs.slice(-500))
}

function validateContactForm(body) {
  const form = {
    fullName: sanitizeSingleLine(body.fullName, 120),
    email: sanitizeEmail(body.email),
    subject: sanitizeSingleLine(body.subject, 160),
    message: sanitizeMultiline(body.message, 2000),
  }

  if (!form.fullName) throw makeHttpError(400, 'Full name is required.')
  if (!isValidEmail(form.email)) throw makeHttpError(400, 'Valid email is required.')
  if (!form.subject) throw makeHttpError(400, 'Subject is required.')
  if (!form.message) throw makeHttpError(400, 'Message is required.')

  return form
}

function validateInquiryForm(body) {
  const productInterested = sanitizeSingleLine(body.productInterested, 120)
  const form = {
    fullName: sanitizeSingleLine(body.fullName, 120),
    mobile: sanitizePhone(body.mobile),
    email: sanitizeEmail(body.email),
    location: sanitizeSingleLine(body.location, 120),
    productInterested,
    message: sanitizeMultiline(body.message, 2000),
    consent: sanitizeBoolean(body.consent),
  }

  if (!form.fullName) throw makeHttpError(400, 'Full name is required.')
  if (!isValidPhone(form.mobile)) throw makeHttpError(400, 'Valid mobile number is required.')
  if (!isValidEmail(form.email)) throw makeHttpError(400, 'Valid email is required.')
  if (!form.location) throw makeHttpError(400, 'Location is required.')
  if (!form.productInterested) throw makeHttpError(400, 'Product interest is required.')
  if (!PRODUCT_OPTIONS.has(form.productInterested)) {
    throw makeHttpError(400, 'Select a valid product.')
  }
  if (!form.consent) throw makeHttpError(400, 'Consent is required.')

  return form
}

function validateForeclosedPropertyForm(body) {
  const form = {
    fullName: sanitizeSingleLine(body.fullName, 120),
    mobile: sanitizePhone(body.mobile),
    email: sanitizeEmail(body.email),
    propertyInterested: sanitizeSingleLine(body.propertyInterested, 200),
    message: sanitizeMultiline(body.message, 2000),
    consent: sanitizeBoolean(body.consent),
  }

  if (!form.fullName) throw makeHttpError(400, 'Full name is required.')
  if (!isValidPhone(form.mobile)) throw makeHttpError(400, 'Valid mobile number is required.')
  if (!isValidEmail(form.email)) throw makeHttpError(400, 'Valid email is required.')
  if (!form.propertyInterested) throw makeHttpError(400, 'Property reference is required.')
  if (!form.consent) throw makeHttpError(400, 'Consent is required.')

  return form
}

function validateApplicationForm(body) {
  const form = {
    fullName: sanitizeSingleLine(body.fullName, 120),
    email: sanitizeEmail(body.email),
    mobile: sanitizePhone(body.mobile),
    idType: sanitizeSingleLine(body.idType, 80),
    idNumber: sanitizeSingleLine(body.idNumber, 80),
    propertyType: sanitizeSingleLine(body.propertyType, 120),
    propertyLocation: sanitizeSingleLine(body.propertyLocation, 160),
    propertyPrice: parseMoney(body.propertyPrice),
    loanAmount: parseMoney(body.loanAmount),
    loanPurpose: sanitizeSingleLine(body.loanPurpose, 160),
    loanTerm: parseWholeNumber(body.loanTerm),
    productInterested: sanitizeSingleLine(body.productInterested, 120),
    employmentStatus: sanitizeSingleLine(body.employmentStatus, 120),
    employer: sanitizeSingleLine(body.employer, 160),
    position: sanitizeSingleLine(body.position, 160),
    monthlyIncome: parseMoney(body.monthlyIncome),
    consent: sanitizeBoolean(body.consent),
  }

  if (!form.fullName) throw makeHttpError(400, 'Full name is required.')
  if (!isValidPhone(form.mobile)) throw makeHttpError(400, 'Valid mobile number is required.')
  if (!isValidEmail(form.email)) throw makeHttpError(400, 'Valid email is required.')
  if (!form.propertyType) throw makeHttpError(400, 'Property type is required.')
  if (!form.propertyLocation) throw makeHttpError(400, 'Property location is required.')
  if (form.propertyPrice <= 0) throw makeHttpError(400, 'Valid property price is required.')
  if (form.loanAmount <= 0) throw makeHttpError(400, 'Valid loan amount is required.')
  if (!form.loanPurpose) throw makeHttpError(400, 'Loan purpose is required.')
  if (form.loanTerm <= 0 || form.loanTerm > 150) throw makeHttpError(400, 'Loan term must be between 1 and 150 months.')
  if (!form.productInterested) throw makeHttpError(400, 'Product selection is required.')
  if (!form.employmentStatus) throw makeHttpError(400, 'Employment status is required.')
  if (form.monthlyIncome <= 0) throw makeHttpError(400, 'Valid monthly income is required.')
  if (!form.consent) throw makeHttpError(400, 'Consent is required.')

  return form
}

async function handleEmailResponse(req, res, pathname, sendResult, confirmationPayload) {
  if (!sendResult.success) {
    throw makeHttpError(502, sendResult.message || 'Unable to send email right now.')
  }

  if (confirmationPayload?.email) {
    await sendUserConfirmationEmail(
      confirmationPayload.email,
      confirmationPayload.type,
      confirmationPayload.fullName,
    )
  }

  return sendJson(req, res, 200, { success: true, message: sendResult.message }, pathname)
}

async function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const pathname = url.pathname

  assertCorsAllowed(req)

  if (req.method === 'OPTIONS') {
    return sendJson(req, res, 200, { ok: true }, pathname)
  }

  if (req.method === 'GET' && pathname === '/api/health') {
    return sendJson(req, res, 200, {
      status: 'ok',
      environment: NODE_ENV,
      corsMode: ALLOWED_ORIGINS.size > 0 ? 'configured-or-same-origin' : 'same-origin-only',
      storage: 'file',
    }, pathname)
  }

  if (req.method === 'GET' && pathname === '/api/properties') {
    const properties = await readJsonFile(PROPERTIES_FILE, [])
    return sendJson(req, res, 200, { items: Array.isArray(properties) ? properties : [] }, pathname)
  }

  if (req.method === 'POST' && pathname === '/api/admin/login') {
    enforceRateLimit('admin-login', req, LOGIN_RATE_LIMIT_MAX, LOGIN_RATE_LIMIT_WINDOW_MS)

    const body = await parseBody(req)
    const username = sanitizeSingleLine(body.username, 254).toLowerCase()
    const password = String(body.password || '')

    if (!username || !password) {
      return sendJson(req, res, 400, { message: 'Username and password are required.' }, pathname)
    }

    const users = await readJsonFile(ADMIN_USERS_FILE, [])
    const user = Array.isArray(users)
      ? users.find((item) => item.username === username)
      : null
    const success = user ? verifyPassword(password, user.salt, user.hash) : false

    await appendAuthLog({
      timestamp: new Date().toISOString(),
      username,
      success,
      ip: getClientIp(req),
      userAgent: req.headers['user-agent'] || '',
    })

    if (!success) {
      return sendJson(req, res, 401, { message: 'Invalid credentials.' }, pathname)
    }

    const token = randomBytes(24).toString('hex')
    sessions.set(token, {
      username,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_TTL_MS,
    })

    return sendJson(req, res, 200, { token, username, expiresInMs: SESSION_TTL_MS }, pathname)
  }

  if (req.method === 'GET' && pathname === '/api/admin/auth-logs') {
    const session = getSession(req)
    if (!session) return sendJson(req, res, 401, { message: 'Unauthorized' }, pathname)

    const logs = await readJsonFile(AUTH_LOG_FILE, [])
    const items = Array.isArray(logs) ? logs.slice().reverse() : []
    return sendJson(req, res, 200, { items }, pathname)
  }

  if (pathname.startsWith('/api/admin/properties')) {
    const session = getSession(req)
    if (!session) return sendJson(req, res, 401, { message: 'Unauthorized' }, pathname)

    if (req.method === 'GET' && pathname === '/api/admin/properties') {
      const properties = await readJsonFile(PROPERTIES_FILE, [])
      return sendJson(req, res, 200, { items: Array.isArray(properties) ? properties : [] }, pathname)
    }

    if (req.method === 'POST' && pathname === '/api/admin/properties') {
      enforceRateLimit('admin-property-write', req, ADMIN_MUTATION_RATE_LIMIT_MAX, ADMIN_MUTATION_RATE_LIMIT_WINDOW_MS)

      const body = await parseBody(req)
      const property = sanitizeProperty(body)
      const validationError = validateProperty(property)
      if (validationError) return sendJson(req, res, 400, { message: validationError }, pathname)

      const properties = await readJsonFile(PROPERTIES_FILE, [])
      const nextProperties = Array.isArray(properties) ? properties : []
      nextProperties.push(property)
      await writeJsonFile(PROPERTIES_FILE, nextProperties)

      return sendJson(req, res, 201, { item: property }, pathname)
    }

    const idMatch = pathname.match(/^\/api\/admin\/properties\/(\d+)$/)
    if (!idMatch) return sendJson(req, res, 404, { message: 'Not found' }, pathname)

    const id = Number(idMatch[1])
    const properties = await readJsonFile(PROPERTIES_FILE, [])
    const nextProperties = Array.isArray(properties) ? properties : []
    const index = nextProperties.findIndex((item) => item.id === id)
    if (index === -1) return sendJson(req, res, 404, { message: 'Property not found' }, pathname)

    if (req.method === 'PUT') {
      enforceRateLimit('admin-property-write', req, ADMIN_MUTATION_RATE_LIMIT_MAX, ADMIN_MUTATION_RATE_LIMIT_WINDOW_MS)

      const body = await parseBody(req)
      const updated = sanitizeProperty(body, nextProperties[index])
      const validationError = validateProperty(updated)
      if (validationError) return sendJson(req, res, 400, { message: validationError }, pathname)

      nextProperties[index] = updated
      await writeJsonFile(PROPERTIES_FILE, nextProperties)
      return sendJson(req, res, 200, { item: updated }, pathname)
    }

    if (req.method === 'DELETE') {
      enforceRateLimit('admin-property-write', req, ADMIN_MUTATION_RATE_LIMIT_MAX, ADMIN_MUTATION_RATE_LIMIT_WINDOW_MS)

      const [removed] = nextProperties.splice(index, 1)
      await writeJsonFile(PROPERTIES_FILE, nextProperties)
      return sendJson(req, res, 200, { item: removed }, pathname)
    }
  }

  if (req.method === 'POST' && pathname === '/api/send-application-email') {
    enforceRateLimit('application-form', req, FORM_RATE_LIMIT_MAX, FORM_RATE_LIMIT_WINDOW_MS)

    const form = validateApplicationForm(await parseBody(req))
    const formsEmail = process.env.FORMS_EMAIL || 'admin@afcsme.com'
    const result = await sendApplicationEmail(form, formsEmail)

    return handleEmailResponse(req, res, pathname, result, {
      email: form.email,
      fullName: form.fullName,
      type: 'application',
    })
  }

  if (req.method === 'POST' && pathname === '/api/send-contact-email') {
    enforceRateLimit('contact-form', req, FORM_RATE_LIMIT_MAX, FORM_RATE_LIMIT_WINDOW_MS)

    const form = validateContactForm(await parseBody(req))
    const formsEmail = process.env.FORMS_EMAIL || 'admin@afcsme.com'
    const result = await sendContactEmail(form, formsEmail)

    return handleEmailResponse(req, res, pathname, result, {
      email: form.email,
      fullName: form.fullName,
      type: 'contact',
    })
  }

  if (req.method === 'POST' && pathname === '/api/send-inquiry-email') {
    enforceRateLimit('inquiry-form', req, FORM_RATE_LIMIT_MAX, FORM_RATE_LIMIT_WINDOW_MS)

    const form = validateInquiryForm(await parseBody(req))
    const inquiriesEmail = process.env.INQUIRIES_EMAIL || 'inquiries@afcsme.com'
    const result = await sendInquiryEmail(form, inquiriesEmail)

    return handleEmailResponse(req, res, pathname, result, {
      email: form.email,
      fullName: form.fullName,
      type: 'inquiry',
    })
  }

  if (req.method === 'POST' && pathname === '/api/send-foreclosed-property-email') {
    enforceRateLimit('foreclosed-form', req, FORM_RATE_LIMIT_MAX, FORM_RATE_LIMIT_WINDOW_MS)

    const form = validateForeclosedPropertyForm(await parseBody(req))
    const foreclosedEmail = process.env.FORECLOSED_PROPERTIES_EMAIL || 'josephleo.flores@afcsme.com.ph'
    const result = await sendForeclosedPropertyEmail(form, foreclosedEmail)

    return handleEmailResponse(req, res, pathname, result, {
      email: form.email,
      fullName: form.fullName,
      type: 'foreclosed-property',
    })
  }

  return sendJson(req, res, 404, { message: 'Route not found' }, pathname)
}

async function start() {
  await bootstrapData()

  const server = createServer((req, res) => {
    handleRequest(req, res).catch((error) => {
      console.error(error)
      const url = new URL(req.url, `http://${req.headers.host}`)
      const statusCode = Number(error.statusCode) || 500
      const message = statusCode === 500 ? 'Server error' : error.message
      sendJson(req, res, statusCode, { message }, url.pathname, error.headers || {})
    })
  })

  server.listen(PORT, () => {
    console.log(`Backend API running on http://localhost:${PORT}`)
  })
}

start().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
