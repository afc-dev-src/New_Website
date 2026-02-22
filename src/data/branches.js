const buildMapLinks = (address) => {
  const query = encodeURIComponent(address)
  return {
    mapEmbedUrl: `https://www.google.com/maps?q=${query}&output=embed`,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${query}`,
  }
}

export const branches = [
  {
    id: 'ortigas',
    name: 'Ortigas',
    pinLabel: 'Head Office',
    isHeadOffice: true,
    address:
      'Unit 309, 3rd Floor AIC Gold Tower Condominium of Ortigas Jr. Avenue, Ortigas Business Center, Pasig City',
    telephone: '',
    mobile: '09178215815',
    email: 'customersupport@afcsme.com.ph',
    ...buildMapLinks(
      'Unit 309, 3rd Floor AIC Gold Tower Condominium of Ortigas Jr. Avenue, Ortigas Business Center, Pasig City'
    ),
  },
  {
    id: 'pampanga',
    name: 'Pampanga',
    pinLabel: 'Branch Office',
    isHeadOffice: false,
    address: 'Aria Place Building, Jose Abad Santos Avenue Dolores, San Fernando City Pampanga',
    telephone: '',
    mobile: '09178215815',
    email: 'customersupport@afcsme.com.ph',
    ...buildMapLinks('Aria Place Building, Jose Abad Santos Avenue Dolores, San Fernando City Pampanga'),
  },
  {
    id: 'cavite',
    name: 'Cavite',
    pinLabel: 'Branch Office',
    isHeadOffice: false,
    address: 'Unit 10, 2nd Floor VQ Building San Agustin 1, Dasmariñas, Cavite',
    telephone: '',
    mobile: '09178215815',
    email: 'customersupport@afcsme.com.ph',
    ...buildMapLinks('Unit 10, 2nd Floor VQ Building San Agustin 1, Dasmarinas, Cavite'),
  },
  {
    id: 'batangas',
    name: 'Batangas',
    pinLabel: 'Branch Office',
    isHeadOffice: false,
    address: '2nd Floor MVL Building, Mataas na Lupa, Lipa City, Batangas',
    telephone: '043741-1551',
    mobile: '',
    email: 'customersupport@afcsme.com.ph',
    ...buildMapLinks('2nd Floor MVL Building, Mataas na Lupa, Lipa City, Batangas'),
  },
  {
    id: 'cebu',
    name: 'Cebu',
    pinLabel: 'Branch Office',
    isHeadOffice: false,
    address: 'M2 Business Center, Escario St., Capitol Site, Cebu City',
    telephone: '2542994',
    mobile: '',
    email: 'customersupport@afcsme.com.ph',
    ...buildMapLinks('M2 Business Center, Escario St., Capitol Site, Cebu City'),
  },
  {
    id: 'baliwag',
    name: 'Baliwag',
    pinLabel: 'Branch Office',
    isHeadOffice: false,
    address: 'Unit 11 (2nd Floor), JRV Centre, DRT Highway, Pagala, Baliwag, Bulacan',
    telephone: '044 471 6120',
    mobile: '',
    email: 'customersupport@afcsme.com.ph',
    ...buildMapLinks('Unit 11 2nd Floor, JRV Centre, DRT Highway, Pagala, Baliwag, Bulacan'),
  },
  {
    id: 'bataan',
    name: 'Bataan',
    pinLabel: 'Branch Office',
    isHeadOffice: false,
    address: 'Bea & Paul Building 1-2, Jose Abad Santos Avenue, Brgy. San Ramos, Dinalupihan, Bataan',
    telephone: '63472750903',
    mobile: '',
    email: 'customersupport@afcsme.com.ph',
    ...buildMapLinks('Bea and Paul Building 1-2, Jose Abad Santos Avenue, Brgy. San Ramos, Dinalupihan, Bataan'),
  },
]
