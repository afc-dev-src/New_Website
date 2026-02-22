const branchAddress1 = '123 Main Avenue, Ortigas Center, Pasig City'
const branchAddress2 = '45 Rizal Street, Cebu Business Park, Cebu City'
const branchAddress3 = '78 Dela Rosa Avenue, Bajada, Davao City'

const query1 = encodeURIComponent(branchAddress1)
const query2 = encodeURIComponent(branchAddress2)
const query3 = encodeURIComponent(branchAddress3)

export const branches = [
  {
    id: 'pasig-placeholder',
    name: 'Ortigas Branch',
    pinLabel: 'NCR Office',
    address: branchAddress1,
    telephone: '(02) 8123 4567',
    mobile: '+63 917 821 5815',
    email: 'ortigas@afcsme.com.ph',
    mapEmbedUrl: `https://www.google.com/maps?q=${query1}&output=embed`,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${query1}`,
  },
  {
    id: 'cebu-placeholder',
    name: 'Cebu Branch',
    pinLabel: 'Visayas Office',
    address: branchAddress2,
    telephone: '(032) 234 5678',
    mobile: '+63 998 222 3344',
    email: 'cebu@afcsme.com.ph',
    mapEmbedUrl: `https://www.google.com/maps?q=${query2}&output=embed`,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${query2}`,
  },
  {
    id: 'davao-placeholder',
    name: 'Davao Branch',
    pinLabel: 'Mindanao Office',
    address: branchAddress3,
    telephone: '(082) 345 6789',
    mobile: '+63 999 555 6677',
    email: 'davao@afcsme.com.ph',
    mapEmbedUrl: `https://www.google.com/maps?q=${query3}&output=embed`,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${query3}`,
  },
]
