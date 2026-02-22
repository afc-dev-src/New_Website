import remImage from '../Images/RENm.jpg'
import takeoutImage from '../Images/takeout.jpg'
import acquisitionImage from '../Images/acqui.jpg'
import productREM from '../Images/our_products_REM.png'
import productRET from '../Images/our_products_RET.png'
import productREA from '../Images/our_products_REA.png'

export const homeProductExplorer = [
  {
    id: 'product-mortgage',
    title: 'Real Estate Mortgage',
    description: 'Secure financing for residential and commercial properties with transparent terms.',
    href: '/products#product-mortgage',
    thumbImage: productREM,
    sectionBgImage: remImage,
    hoverDetails: [
      'Copy of title (TCT/CCT)',
      'Latest tax declaration and tax clearance',
      'Two valid IDs of borrower and co-borrower',
    ],
  },
  {
    id: 'product-takeout',
    title: 'Real Estate Take-out',
    description: 'Refinance existing property loans into a clearer structure for cash-flow flexibility.',
    href: '/products#product-takeout',
    thumbImage: productRET,
    sectionBgImage: takeoutImage,
    hoverDetails: [
      'Copy of title (TCT/CCT)',
      'Latest SOA from bank or financing company',
      'Source of income documents',
    ],
  },
  {
    id: 'product-acquisition',
    title: 'Acquisition Loan',
    description: 'Funding support for strategic property purchases that drive business growth.',
    href: '/products#product-acquisition',
    thumbImage: productREA,
    sectionBgImage: acquisitionImage,
    hoverDetails: [
      'Copy of title (TCT/CCT)',
      'Latest real estate tax receipt and clearance',
      'Application form and source of income',
    ],
  },
]
