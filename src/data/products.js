import remImage from '../Images/RENm1.jpg'
import takeoutImage from '../Images/takeout1.jpg'
import acquisitionImage from '../Images/acqui1.jpg'
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
    whatFor: [
      'Loan approval in 1 - 2 weeks',
      '0.9% interest rate',
      'Up to 60 months loan term',
    ],
  },
  {
    id: 'product-takeout',
    title: 'Real Estate Take-out',
    description: 'Refinance existing property loans into a clearer structure for cash-flow flexibility.',
    href: '/products#product-takeout',
    thumbImage: productRET,
    sectionBgImage: takeoutImage,
    whatFor: [
      'Loan approval in 1 - 2 weeks',
      'Maximum approval up to 70% of appraisal value',
      '0.9% interest rate',
      'Up to 60 months loan term',
    ],
  },
  {
    id: 'product-acquisition',
    title: 'Acquisition Loan',
    description: 'Funding support for strategic property purchases that drive business growth.',
    href: '/products#product-acquisition',
    thumbImage: productREA,
    sectionBgImage: acquisitionImage,
    whatFor: [
      'Loan pre-approval in 1 - 2 days',
      'Maximum approval up to 80% of appraisal value',
      '0.9% interest rate',
      'Up to 84 months loan term',
    ],
  },
]
