import { createServer } from 'node:http'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, 'data')
const PROPERTIES_FILE = path.join(DATA_DIR, 'properties.json')
const ADMIN_USERS_FILE = path.join(DATA_DIR, 'admin-users.json')
const AUTH_LOG_FILE = path.join(DATA_DIR, 'auth-log.json')

const PORT = Number(process.env.PORT || 4000)
const SESSION_TTL_MS = 1000 * 60 * 60 * 8
const MAX_BODY_BYTES = 35 * 1024 * 1024
const sessions = new Map()

const DEFAULT_PROPERTIES = [
  {
    id: 1,
    name: 'Sunset Residences - Unit 4B',
    type: 'Residential Condo',
    location: 'Makati City',
    price: 8500000,
    size: '68 sqm',
    bedrooms: 2,
    bathrooms: 1,
    features: 'High-floor, City view, Parking',
    status: 'Available',
  },
  {
    id: 2,
    name: 'Peninsula Tower - Unit 1801',
    type: 'Residential Condo',
    location: 'Makati City',
    price: 12000000,
    size: '98 sqm',
    bedrooms: 2,
    bathrooms: 2,
    features: 'Sea view, Balcony, Smart home',
    status: 'Available',
  },
  {
    id: 3,
    name: 'Golden Hills - Lot 15',
    type: 'House & Lot',
    location: 'Cavite',
    price: 5500000,
    size: '120 sqm',
    bedrooms: 3,
    bathrooms: 2,
    features: 'Modern design, Swimming pool',
    status: 'Available',
  },
  {
    id: 4,
    name: 'Eastwood Commercial Space - 201',
    type: 'Commercial Unit',
    location: 'Quezon City',
    price: 4200000,
    size: '45 sqm',
    bedrooms: 0,
    bathrooms: 1,
    features: 'Mixed-use zone, High foot traffic',
    status: 'Available',
  },
  {
    id: 5,
    name: 'Verde Hills - Villa 3',
    type: 'House & Lot',
    location: 'Tagaytay',
    price: 9800000,
    size: '250 sqm',
    bedrooms: 4,
    bathrooms: 3,
    features: 'Scenic view, Large garden, Pool',
    status: 'Available',
  },
  {
    id: 6,
    name: 'BGC Office Tower - Floor 22',
    type: 'Office Space',
    location: 'Bonifacio Global City',
    price: 15000000,
    size: '200 sqm',
    bedrooms: 0,
    bathrooms: 2,
    features: 'LEED certified, Modern infrastructure',
    status: 'Available',
  },
  {
    id: 7,
    name: 'Jasmine Garden - Unit 5A',
    type: 'Residential Condo',
    location: 'Paranaque City',
    price: 6800000,
    size: '62 sqm',
    bedrooms: 1,
    bathrooms: 1,
    features: 'Garden view, Gym access',
    status: 'Under OCU',
  },
  {
    id: 8,
    name: 'Riverstone - Lot 8',
    type: 'House & Lot',
    location: 'Las Pinas',
    price: 7200000,
    size: '135 sqm',
    bedrooms: 3,
    bathrooms: 2,
    features: 'Gated community, 24/7 security',
    status: 'Available',
  },
  {
    id: 9,
    name: 'Cyber Park - Unit 1202',
    type: 'Residential Condo',
    location: 'Mandaluyong City',
    price: 9100000,
    size: '85 sqm',
    bedrooms: 2,
    bathrooms: 2,
    features: 'Modern facilities, Near MRT',
    status: 'Available',
  },
  {
    id: 10,
    name: 'Park Ridge - Penthouse',
    type: 'Residential Condo',
    location: 'Makati City',
    price: 18500000,
    size: '160 sqm',
    bedrooms: 3,
    bathrooms: 2,
    features: 'Luxury finishes, Panoramic view',
    status: 'Available',
  },
]

const DEFAULT_ADMIN_USER = {
  username: 'admin',
  password: 'ChangeMe123!',
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
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
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
}

async function bootstrapData() {
  const properties = await readJsonFile(PROPERTIES_FILE, null)
  if (!properties) await writeJsonFile(PROPERTIES_FILE, DEFAULT_PROPERTIES)

  const adminUsers = await readJsonFile(ADMIN_USERS_FILE, null)
  if (!adminUsers) {
    const passwordHash = hashPassword(DEFAULT_ADMIN_USER.password)
    await writeJsonFile(ADMIN_USERS_FILE, [
      { username: DEFAULT_ADMIN_USER.username, ...passwordHash },
    ])
    console.log('Created default admin user: admin / ChangeMe123! (Change this immediately)')
  }

  const authLogs = await readJsonFile(AUTH_LOG_FILE, null)
  if (!authLogs) await writeJsonFile(AUTH_LOG_FILE, [])
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    let tooLarge = false
    req.on('data', (chunk) => {
      if (tooLarge) return
      raw += chunk
      if (raw.length > MAX_BODY_BYTES) {
        tooLarge = true
      }
    })
    req.on('end', () => {
      if (tooLarge) {
        const error = new Error('Request payload too large. Upload fewer/smaller images.')
        error.statusCode = 413
        return reject(error)
      }
      if (!raw) return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch (error) {
        reject(new Error('Invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}

function normalizeImageUrls(inputImageUrls, fallbackImageUrl = '') {
  const source = Array.isArray(inputImageUrls)
    ? inputImageUrls
    : fallbackImageUrl
      ? [fallbackImageUrl]
      : []

  const cleaned = source
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .slice(0, 10)

  return cleaned
}

function getBearerToken(req) {
  const auth = req.headers.authorization || ''
  if (!auth.startsWith('Bearer ')) return ''
  return auth.slice('Bearer '.length)
}

function getSession(req) {
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

async function appendAuthLog(entry) {
  const currentLogs = await readJsonFile(AUTH_LOG_FILE, [])
  currentLogs.push(entry)
  await writeJsonFile(AUTH_LOG_FILE, currentLogs.slice(-500))
}

function sanitizeProperty(input, existing = {}) {
  const imageUrls = normalizeImageUrls(input.imageUrls, input.imageUrl || existing.imageUrl || '')

  return {
    id: existing.id ?? Date.now(),
    name: String(input.name || existing.name || '').trim(),
    type: String(input.type || existing.type || '').trim(),
    location: String(input.location || existing.location || '').trim(),
    price: Number(input.price ?? existing.price ?? 0),
    size: String(input.size || existing.size || '').trim(),
    bedrooms: Number(input.bedrooms ?? existing.bedrooms ?? 0),
    bathrooms: Number(input.bathrooms ?? existing.bathrooms ?? 0),
    features: String(input.features || existing.features || '').trim(),
    status: String(input.status || existing.status || 'Available').trim(),
    imageUrls,
    imageUrl: imageUrls[0] || '',
  }
}

function validateProperty(property) {
  const requiredTextFields = ['name', 'type', 'location', 'size', 'features', 'status']
  for (const field of requiredTextFields) {
    if (!property[field]) return `${field} is required`
  }
  if (!Number.isFinite(property.price) || property.price <= 0) return 'price must be greater than 0'
  if (!Number.isInteger(property.bedrooms) || property.bedrooms < 0) return 'bedrooms must be 0 or more'
  if (!Number.isInteger(property.bathrooms) || property.bathrooms < 0) return 'bathrooms must be 0 or more'
  if (Array.isArray(property.imageUrls) && property.imageUrls.length > 10) return 'Maximum of 10 images per property.'
  return ''
}

async function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const pathname = url.pathname

  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true })
  }

  if (req.method === 'GET' && pathname === '/api/health') {
    return sendJson(res, 200, { status: 'ok' })
  }

  if (req.method === 'GET' && pathname === '/api/properties') {
    const properties = await readJsonFile(PROPERTIES_FILE, [])
    return sendJson(res, 200, { items: properties })
  }

  if (req.method === 'POST' && pathname === '/api/admin/login') {
    const body = await parseBody(req)
    const username = String(body.username || '').trim()
    const password = String(body.password || '')

    if (!username || !password) {
      return sendJson(res, 400, { message: 'Username and password are required.' })
    }

    const users = await readJsonFile(ADMIN_USERS_FILE, [])
    const user = users.find((item) => item.username === username)
    const success = user ? verifyPassword(password, user.salt, user.hash) : false

    await appendAuthLog({
      timestamp: new Date().toISOString(),
      username,
      success,
      ip: req.socket.remoteAddress || '',
      userAgent: req.headers['user-agent'] || '',
    })

    if (!success) {
      return sendJson(res, 401, { message: 'Invalid credentials.' })
    }

    const token = randomBytes(24).toString('hex')
    sessions.set(token, {
      username,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_TTL_MS,
    })

    return sendJson(res, 200, { token, username, expiresInMs: SESSION_TTL_MS })
  }

  if (req.method === 'GET' && pathname === '/api/admin/auth-logs') {
    const session = getSession(req)
    if (!session) return sendJson(res, 401, { message: 'Unauthorized' })
    const logs = await readJsonFile(AUTH_LOG_FILE, [])
    return sendJson(res, 200, { items: logs.slice().reverse() })
  }

  if (pathname.startsWith('/api/admin/properties')) {
    const session = getSession(req)
    if (!session) return sendJson(res, 401, { message: 'Unauthorized' })

    if (req.method === 'GET' && pathname === '/api/admin/properties') {
      const properties = await readJsonFile(PROPERTIES_FILE, [])
      return sendJson(res, 200, { items: properties })
    }

    if (req.method === 'POST' && pathname === '/api/admin/properties') {
      const body = await parseBody(req)
      const property = sanitizeProperty(body)
      const validationError = validateProperty(property)
      if (validationError) return sendJson(res, 400, { message: validationError })

      const properties = await readJsonFile(PROPERTIES_FILE, [])
      properties.push(property)
      await writeJsonFile(PROPERTIES_FILE, properties)
      return sendJson(res, 201, { item: property })
    }

    const idMatch = pathname.match(/^\/api\/admin\/properties\/(\d+)$/)
    if (!idMatch) return sendJson(res, 404, { message: 'Not found' })

    const id = Number(idMatch[1])
    const properties = await readJsonFile(PROPERTIES_FILE, [])
    const index = properties.findIndex((item) => item.id === id)
    if (index === -1) return sendJson(res, 404, { message: 'Property not found' })

    if (req.method === 'PUT') {
      const body = await parseBody(req)
      const updated = sanitizeProperty(body, properties[index])
      const validationError = validateProperty(updated)
      if (validationError) return sendJson(res, 400, { message: validationError })
      properties[index] = updated
      await writeJsonFile(PROPERTIES_FILE, properties)
      return sendJson(res, 200, { item: updated })
    }

    if (req.method === 'DELETE') {
      const [removed] = properties.splice(index, 1)
      await writeJsonFile(PROPERTIES_FILE, properties)
      return sendJson(res, 200, { item: removed })
    }
  }

  return sendJson(res, 404, { message: 'Route not found' })
}

async function start() {
  await bootstrapData()
  const server = createServer((req, res) => {
    handleRequest(req, res).catch((error) => {
      console.error(error)
      const statusCode = Number(error.statusCode) || 500
      sendJson(res, statusCode, { message: statusCode === 500 ? 'Server error' : error.message })
    })
  })
  server.listen(PORT, () => {
    console.log(`Backend API running on http://localhost:${PORT}`)
  })
}

start()
