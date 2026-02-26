# Website Security & Supabase Migration Analysis
**AFC SME Finance - Foreclosed Property Management System**

---

## TABLE OF CONTENTS
1. [Current Architecture Overview](#current-architecture-overview)
2. [Security Vulnerabilities & Recommendations](#security-vulnerabilities--recommendations)
3. [Component Connection Map](#component-connection-map)
4. [Database Connections Analysis](#database-connections-analysis)
5. [Supabase Migration Strategy](#supabase-migration-strategy)
6. [Implementation Roadmap](#implementation-roadmap)

---

## Current Architecture Overview

### Technology Stack
```
Frontend:     React 18.2 + Vite 5.0 + React Router 6.18 + Tailwind CSS
Backend:      Node.js (native HTTP, no framework)
Database:     File-based JSON (properties.json, admin-users.json, auth-log.json)
Auth:         Bearer token sessions (8-hour TTL)
Styling:      Tailwind CSS 3.4 + PostCSS + Autoprefixer
```

### Current Data Flow
```
┌─────────────────────────────────────────────────────┐
│ Frontend (React @ localhost:5173)                   │
│ - Pages: Home, Products, Properties, Admin, etc.    │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP Requests (api.js)
                   ▼
┌─────────────────────────────────────────────────────┐
│ Backend (Node.js @ localhost:4000)                  │
│ - 8 API endpoints                                   │
│ - Session management (in-memory Map)                │
│ - Password hashing (scrypt)                         │
└──────────────────┬──────────────────────────────────┘
                   │ File I/O
                   ▼
┌─────────────────────────────────────────────────────┐
│ JSON File Storage (server/data/)                    │
│ - properties.json (foreclosed listings)             │
│ - admin-users.json (credentials + salts)            │
│ - auth-log.json (login attempts)                    │
└─────────────────────────────────────────────────────┘
```

---

## Security Vulnerabilities & Recommendations

### 🔴 CRITICAL ISSUES

#### 1. **File-Based Auth Data Storage**
**Problem:** Admin credentials stored in plain JSON file (`admin-users.json`)
- File system permissions can be misconfigured
- Entire auth database visible if file permissions wrong
- No encryption at rest

**Risk Level:** CRITICAL
**Recommendation:**
- Migrate to Supabase Auth (manages security)
- Use environment variables for secrets
- Enable Supabase Row Level Security (RLS)

**Quick Fix:** Add file permissions protection (1-2 min)
```bash
chmod 600 server/data/admin-users.json
chmod 600 server/data/auth-log.json
```

---

#### 2. **Session Data Lost on Server Restart**
**Problem:** Sessions stored in-memory `Map()` (server/index.js:17)
- Server restart logs out all admins
- No session persistence
- No distributed session support for scaling

**Risk Level:** HIGH
**Recommendation:**
- Use Supabase sessions with persistent storage
- Implement Redis for distributed caching (if self-hosting)
- Session tokens survive server restarts

---

#### 3. **CORS Enabled for All Origins**
**Problem:** Backend allows requests from ANY domain (server/index.js line ~line 200)
```
Access-Control-Allow-Origin: *
```

**Risk Level:** HIGH
**Recommendation:**
- Restrict CORS to your frontend domain only
- ```javascript
  Access-Control-Allow-Origin: https://yourdomain.com
  ```
- Supabase handles CORS automatically when properly configured

---

### 🟠 HIGH PRIORITY ISSUES

#### 4. **Default Admin Credentials Never Changed**
**Problem:** Default password `ChangeMe123!` auto-created on first run
- Easy target for brute force
- Unlikely to be changed in production

**Risk Level:** HIGH
**Recommendation:**
- Implement admin setup wizard on first deployment
- Force password change before first login
- Use Supabase Auth with pre-configured admin user flow

---

#### 5. **No Rate Limiting on Login**
**Problem:** `/api/admin/login` accepts unlimited login attempts
- Vulnerable to brute force attacks
- No throttling mechanism

**Risk Level:** HIGH
**Recommendation:**
- Implement rate limiting (3 failed attempts = 15 min lockout)
- Use Supabase pre-built rate limiting features
- Log suspicious patterns

---

#### 6. **Base64 Image Storage in JSON**
**Problem:** Up to 10 images per property stored as base64 in JSON
- Bloats file size (base64 = 33% larger than binary)
- In-memory parsing overhead
- Not scalable with many properties

**Risk Level:** MEDIUM
**Recommendation:**
- Store images in Supabase Storage (CDN-backed)
- Keep only image URLs in database
- Automatic image optimization and compression

---

#### 7. **No HTTPS Enforcement**
**Problem:** Backend sends credentials over unencrypted HTTP (hardcoded localhost:4000)
- Man-in-the-middle vulnerability in production
- Tokens exposed in transit

**Risk Level:** HIGH
**Recommendation:**
- Deploy with HTTPS/TLS
- Use environment variables for API URLs
- Supabase provides TLS by default

---

#### 8. **No Input Validation on Admin ID Parameter**
**Problem:** `/api/admin/properties/:id` vulnerable to path traversal
- No validation that ID is numeric
- Could access unintended files

**Risk Level:** MEDIUM
**Recommendation:**
- Validate ID format on backend
- Supabase automatically prevents this with type checking

---

### 🟡 MEDIUM PRIORITY ISSUES

#### 9. **No CSRF Protection**
**Problem:** No CSRF tokens on state-changing requests (POST/PUT/DELETE)
- Malicious site could trick admin into modifying properties

**Risk Level:** MEDIUM
**Recommendation:**
- Implement CSRF tokens (req.csrfToken())
- Or use SameSite cookies (Supabase handles this)

---

#### 10. **Logging Secrets in Auth-Log**
**Problem:** Auth-log stores user agents and IP addresses but no scrubbing
- Could expose internal infrastructure details
- No log rotation beyond 500 entries

**Risk Level:** LOW
**Recommendation:**
- Implement structured logging with masking
- Use log rotation policy (7-30 days)
- Export old logs to archive storage

---

#### 11. **No Password Complexity Rules**
**Problem:** Admin password can be anything (no requirements shown)
- Single character passwords theoretically allowed

**Risk Level:** MEDIUM
**Recommendation:**
- Enforce password complexity: 12+ chars, mixed case, numbers, symbols
- Supabase Auth has built-in complexity rules

---

#### 12. **No Two-Factor Authentication (2FA)**
**Problem:** Single password is only authentication factor
- Compromised password = full admin access

**Risk Level:** HIGH for high-value system
**Recommendation:**
- Implement 2FA (TOTP/SMS)
- Supabase Auth supports 2FA out of the box

---

### 🟢 INFORMATION SECURITY NOTES

#### ✅ Well-Implemented Security
- **Scrypt password hashing** - Industry standard (resistant to GPU attacks)
- **Salt per password** - Prevents rainbow table attacks
- **Timing-safe comparison** - Prevents timing attacks
- **Secure random tokens** - 48-byte (384-bit) cryptographic randomness
- **HTTP-only (could be set)** - If using cookies instead of localStorage
- **Session expiry** - 8-hour timeout limits window of compromise

---

## Component Connection Map

### Frontend Component Architecture
```
┌────────────────────────────────────────────────────────┐
│                    App.jsx (Router)                    │
│         Routes: /, /products, /properties, etc.        │
└────────────────────┬───────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
         ▼           ▼           ▼
    Header.jsx   Layout      Footer.jsx
    (Navigation) Components  (Footer)
         │
    ┌────┴──────────────────────────────┐
    │   Dropdown Menu Structure          │
    ├─ Company (About, Disclosures)     │
    ├─ Products (Calculator, Products)  │
    ├─ Resources (FAQs, Contact)        │
    └─ Properties (Properties, Locator) │

```

### Page-to-Component Dependencies
```
Home.jsx
├── HeroSlider (auto-rotating carousel)
├── ProductExplorer (process pipeline: Apply→Submit→Evaluate→Release)
├── BranchesSection (office locations)
└── InquiryForm (contact inquiry)

Properties.jsx
├── PropertyCard (reusable)
├── api.getProperties() → backend
└── Fallback: src/data/properties.js (if API fails)

Admin.jsx
├── api.adminLogin() → bearer token to localStorage
├── api.getAdminProperties() → property list
├── PropertyCard (edit mode)
├── CreateProperty form
├── api.updateProperty() / api.deleteProperty()
└── api.getAuthLogs()

Products.jsx
├── ProductExplorer
├── Static: src/data/products.js
└── ProductCard (reusable)

Calculator.jsx
├── Form inputs (loan amount, rate, term)
└── No backend calls (client-side calculation)

ApplicationForm.jsx
├── Multi-step form
└── No backend integration (display only)

Other Pages (Contact, About, FAQs, etc.)
└── No backend calls (static content)
```

### Service Dependency Graph
```
api.js (Frontend → Backend Connector)
├── getProperties()
├── adminLogin()
├── getAdminProperties()
├── createProperty()
├── updateProperty()
├── deleteProperty()
└── getAuthLogs()
    │
    └── Backend: server/index.js (25+ API handlers)
        ├── Authentication (login, token validation)
        ├── CRUD Operations (properties)
        ├── File I/O (JSON persistence)
        └── Logging (auth attempts)
```

### Data Dependencies
```
Static Data (Always Available)
├── src/data/products.js → Products page
├── src/data/branches.js → BranchesSection, BranchLocator
├── src/data/properties.js → Fallback for Properties page
└── src/data/disclosures.js → Disclosures page

Dynamic Data (Backend-Dependent)
├── server/data/properties.json
│   ├── Properties page (GET /api/properties)
│   ├── Admin page (GET/POST/PUT/DELETE)
│   └── Fallback to static data if offline
├── server/data/admin-users.json
│   └── Admin page (login verification)
└── server/data/auth-log.json
    └── Admin page (audit log viewing)
```

---

## Database Connections Analysis

### Current File-Based Database

**Connection Type:** Direct File I/O via Node.js `fs` module
```javascript
// server/index.js
import { promises as fs } from 'node:fs'

await fs.readFile(PROPERTIES_FILE, 'utf-8')
await fs.writeFile(PROPERTIES_FILE, JSON.stringify(data, null, 2))
```

**Problems with This Approach:**
1. **No Concurrency Handling** - Simultaneous reads/writes can corrupt files
2. **No Transactions** - Partial updates if process crashes mid-write
3. **No Indexing** - Every operation scans entire JSON
4. **No Backup** - Data loss if not manually backed up
5. **No Scaling** - Can't distribute across servers
6. **No Query Language** - Must parse entire JSON to filter data
7. **No Full-Text Search** - Can't search properties by description

### Data File Specifications

**properties.json** (server/data/properties.json)
```json
[
  {
    "id": 1,
    "name": "Property name",
    "type": "Residential Condo",
    "location": "City name",
    "price": 8500000,
    "size": "68 sqm",
    "bedrooms": 2,
    "bathrooms": 1,
    "features": "Feature list",
    "status": "Available",
    "imageUrls": ["data:image/*, base64..."],  // ← Base64 bloat
    "imageUrl": "single image"
  }
]
```

**admin-users.json** (server/data/admin-users.json)
```json
[
  {
    "username": "admin",
    "salt": "hex_string_16_bytes",
    "hash": "hex_string_scrypt_hash"
  }
]
```

**auth-log.json** (server/data/auth-log.json)
```json
[
  {
    "timestamp": "2025-02-26T10:30:00.000Z",
    "username": "admin",
    "success": true,
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }
]
// Logs last 500 entries only
```

---

## Supabase Migration Strategy

### What is Supabase?
- **PostgreSQL database** (proven, scalable, ACID-compliant)
- **Real-time subscriptions** (live property updates)
- **Built-in Auth** (passwords, 2FA, SSO)
- **Row-Level Security** (database-enforced permissions)
- **Storage** (image CDN, auto-optimization)
- **Vector database** (search properties by description)
- **Automatic backups** (daily, 7-30 days retention)

### Migration Roadmap: Phase 1-3

#### PHASE 1: Database Migration (2-4 hours)
**Goal:** Move properties data to Supabase PostgreSQL

**Step 1.1: Set up Supabase project**
- Create at supabase.com
- Configure PostgreSQL database
- Enable Row-Level Security (RLS)

**Step 1.2: Create database schema**
```sql
-- Properties table
CREATE TABLE public.properties (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  price BIGINT NOT NULL CHECK (price > 0),
  size VARCHAR(50) NOT NULL,
  bedrooms INT NOT NULL CHECK (bedrooms >= 0),
  bathrooms INT NOT NULL CHECK (bathrooms >= 0),
  features TEXT NOT NULL,
  status VARCHAR(50) NOT NULL,
  image_urls TEXT[] DEFAULT '{}',  -- Array of URLs (not base64!)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,  -- Reference to auth user
  FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

-- Indexes for fast queries
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(type);

-- RLS: Anyone can read public properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_properties" ON properties
  FOR SELECT USING (status = 'Available');

-- RLS: Only admins can write
CREATE POLICY "admin_write_properties" ON properties
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email LIKE '%@admin.%'
    )
  );
```

**Step 1.3: Migrate existing data**
```javascript
// Script to run once
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabase = createClient(URL, KEY)
const properties = JSON.parse(readFileSync('server/data/properties.json'))

await supabase.from('properties').insert(
  properties.map(p => ({
    id: p.id,
    name: p.name,
    type: p.type,
    location: p.location,
    price: p.price,
    size: p.size,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    features: p.features,
    status: p.status,
    image_urls: p.imageUrls || [],  // No more base64!
  }))
)
```

#### PHASE 2: Authentication Migration (3-5 hours)
**Goal:** Replace custom session auth with Supabase Auth

**Step 2.1: Enable Supabase Auth**
- Email/password authentication
- 2FA (TOTP)
- Session management (automatic token refresh)

**Step 2.2: Migrate admin users**
```javascript
const admins = JSON.parse(readFileSync('server/data/admin-users.json'))

for (const admin of admins) {
  await supabase.auth.admin.createUser({
    email: `${admin.username}@admin.yoursite.com`,
    password: 'temp-password-123',  // Force change on first login
    email_confirm: true,
  })
}
```

**Step 2.3: Update backend to use Supabase Auth**

Before (current):
```javascript
// POST /api/admin/login
const hashedPassword = scryptSync(password, salt, 32)
if (timingSafeEqual(hash, hashedPassword)) {
  const token = randomBytes(24).toString('hex')
  sessions.set(token, { username, expiresAt: Date.now() + SESSION_TTL_MS })
  return { token }
}
```

After (Supabase):
```javascript
// Supabase handles login automatically
const { data, error } = await supabase.auth.signInWithPassword({
  email: `${username}@admin.yoursite.com`,
  password: password,
})
// Returns: { access_token, refresh_token, expires_in }
```

**Benefits:**
- Automatic token refresh
- Password reset flows built-in
- 2FA out of the box
- Session recovery after server restart
- Audit logs included

#### PHASE 3: Image Storage Migration (1-2 hours)
**Goal:** Move from base64 in JSON to Supabase Storage

**Step 3.1: Create storage bucket**
```javascript
await supabase.storage.createBucket('property-images', {
  public: true,  // Accessible via CDN
})
```

**Step 3.2: Upload existing images**
```javascript
for (const property of properties) {
  for (const [index, base64] of property.imageUrls.entries()) {
    const buffer = Buffer.from(base64.split(',')[1], 'base64')
    await supabase.storage.from('property-images').upload(
      `property-${property.id}-${index}.jpg`,
      buffer,
      { contentType: 'image/jpeg' }
    )
    // Update properties table with URL instead of base64
    const url = supabase.storage.from('property-images')
      .getPublicUrl(`property-${property.id}-${index}.jpg`)
    await updatePropertyImageUrl(property.id, url)
  }
}
```

**Step 3.3: Update admin upload flow**
```javascript
// Old code (in Admin.jsx)
const reader = new FileReader()
reader.onload = (e) => {
  formData.imageUrls.push(e.target.result)  // Base64 ❌
}

// New code (with Supabase Storage)
const file = event.target.files[0]
const { data, error } = await supabase.storage
  .from('property-images')
  .upload(`uploads/${timestamp}-${file.name}`, file)
const publicUrl = data.path  // ✅ URL instead
```

---

## Implementation Roadmap

### Timeline & Effort Estimates

| Phase | Task | Effort | Priority |
|-------|------|--------|----------|
| **Immediate** | Fix CORS + change default password | 30 min | CRITICAL |
| **Immediate** | Enable HTTPS/TLS in production | 1 hour | CRITICAL |
| **Week 1** | Implement rate limiting on login | 2 hours | HIGH |
| **Week 1** | Add CSRF protection | 2 hours | HIGH |
| **Week 2** | Implement 2FA support | 3 hours | MEDIUM |
| **Week 2-3** | Phase 1: Database migration to Supabase | 4 hours | HIGH |
| **Week 3-4** | Phase 2: Auth migration to Supabase | 4 hours | HIGH |
| **Week 4** | Phase 3: Image storage migration | 2 hours | MEDIUM |
| **Week 4-5** | Testing & QA | 8 hours | HIGH |
| **Week 5** | Deployment & monitoring | 2 hours | HIGH |

### Critical Path (Deploy with Supabase in 2-3 weeks)

**Must-Do First:**
1. Fix CORS whitelist (30 min)
2. Change default credentials (15 min)
3. Enable HTTPS (1 hour)
4. Set up Supabase project (30 min)

**Then Migrate in Order:**
1. Phase 1: Database schema & data (4 hours)
2. Phase 2: Auth system (4 hours)
3. Phase 3: Image storage (2 hours)
4. Comprehensive testing (8 hours)

### Deployment Architecture (Post-Migration)

```
┌──────────────────────────────────────┐
│  Client Browser                      │
│  (React @ https://yourdomain.com)    │
└──────────────────┬───────────────────┘
                   │
      ┌────────────┴────────────┐
      │ HTTP/2 (TLS)            │
      ▼                         ▼
   ┌────────────────────────────────────┐
   │  Frontend CDN (CloudFlare/Vercel)  │
   │  - Caches HTML/CSS/JS              │
   │  - Auto HTTPS                      │
   └────────────────────────────────────┘
                   │
      ┌────────────┴────────────┐
      │                         ▼
      │                  ┌─────────────────────────┐
      │                  │ Supabase (PostgreSQL)   │
      │                  │ - Row-Level Security    │
      │                  │ - Automatic backups     │
      │                  │ - Real-time sync        │
      │                  └─────────────────────────┘
      │                         ▲
      │                         │
      ▼                         │
   ┌────────────────────────────────────┐
   │  Backend API (Node.js on Fly/Heroku│
   │  - Supabase client libraries       │
   │  - Token validation                │
   │  - Business logic                  │
   └────────────────────────────────────┘
      │
      └────────────────┐
                       ▼
       ┌──────────────────────────────┐
       │ Supabase Storage (CDN)       │
       │ - Property images            │
       │ - Auto optimization          │
       │ - SSL included               │
       └──────────────────────────────┘
```

---

## Quick Wins (Do These First)

### 1️⃣ Fix CORS (5 min)
**File:** `server/index.js` (around line 200)

Current:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*')  // ❌ Anyone
```

Should be:
```javascript
const allowedOrigins = [
  'http://localhost:5173',        // Dev
  'https://yourdomain.com',       // Production
  'https://www.yourdomain.com'    // WWW variant
]
const origin = req.headers.origin
if (allowedOrigins.includes(origin)) {
  res.setHeader('Access-Control-Allow-Origin', origin)
}
```

### 2️⃣ Force Password Change (10 min)
**File:** `server/index.js` (login handler)

Add check after successful login:
```javascript
if (username === 'admin' && isDefaultPassword) {
  return res.writeHead(200, HEADERS).end(JSON.stringify({
    error: 'Must change default password first',
    requiresPasswordChange: true
  }))
}
```

### 3️⃣ Add Rate Limiting (20 min)
**File:** `server/index.js` (add near top)

```javascript
const loginAttempts = new Map()
const MAX_ATTEMPTS = 3
const LOCKOUT_TIME = 15 * 60 * 1000

function checkRateLimit(ip) {
  const key = `login-${ip}`
  const attempts = loginAttempts.get(key) || { count: 0, resetAt: 0 }

  if (Date.now() < attempts.resetAt) {
    throw new Error('Too many login attempts. Try again in 15 minutes.')
  }

  attempts.count++
  if (attempts.count > MAX_ATTEMPTS) {
    attempts.resetAt = Date.now() + LOCKOUT_TIME
  }
  loginAttempts.set(key, attempts)
}
```

### 4️⃣ Add Input Validation (15 min)
**File:** `server/index.js` (property ID handling)

```javascript
function validatePropertyId(id) {
  const parsed = parseInt(id, 10)
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error('Invalid property ID')
  }
  return parsed
}
```

---

## Summary & Recommendations

### Current State: ⚠️ Development-Grade
- Works well for prototyping
- Not suitable for production with real data
- No disaster recovery
- Vulnerable to multiple attack vectors

### Post-Quick-Wins: ✅ Acceptable for MVP
- CORS restricted
- Rate limiting active
- Default credentials changed
- Input validation strict

### Post-Supabase Migration: 🛡️ Production-Ready
- Database ACID compliance
- Automatic daily backups
- Built-in 2FA
- Row-Level Security
- CDN-delivered images
- Audit logging included
- Scalable to millions of records

### Recommended Next Steps
1. **This week:** Implement quick wins (1 hour total)
2. **Next week:** Set up Supabase free tier
3. **Week after:** Run Phase 1-3 migration
4. **Final week:** Load testing & deployment
5. **Ongoing:** Monitor Supabase dashboards

### Cost Estimate (Supabase)
- **Free Tier:** Up to 500MB storage, 2GB bandwidth/month (sufficient for MVP)
- **Pro Tier:** $25/month (1GB storage, 50GB bandwidth/month)
- **Scale as needed:** Auto-scaling pricing

---

## Files to Review/Modify

### Security Updates
- [ ] `server/index.js` - CORS, rate limiting, input validation
- [ ] `.env` → Add `VITE_API_BASE_URL`, `SUPABASE_URL`, `SUPABASE_KEY`
- [ ] `server/data/` → Secure file permissions (chmod 600)

### Supabase Integration
- [ ] `src/services/api.js` - Add Supabase client
- [ ] `src/pages/Admin.jsx` - Integrate Supabase Auth
- [ ] `src/pages/Properties.jsx` - Use Supabase queries
- [ ] `tailwind.config.js` - May need PostCSS updates

### Testing
- [ ] Add request validation tests
- [ ] Add authentication flow tests
- [ ] Test CORS from different origins
- [ ] Load test with multiple concurrent users

---

**Generated:** 2025-02-26
**Status:** Comprehensive security review + migration strategy complete
