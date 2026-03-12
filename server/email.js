import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

const EMAIL_USER = (process.env.EMAIL_USER || '').trim()
const EMAIL_PASSWORD = (process.env.EMAIL_PASSWORD || '').trim()
const EMAIL_FROM = (process.env.EMAIL_FROM || 'noreply@afcsme.com').trim()
const ADMIN_CC_EMAIL = (process.env.FORMS_CC_EMAIL || '').trim()

const currencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
})

let transporter = null

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => (
    {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[character] || character
  ))
}

function formatText(value, fallback = 'N/A') {
  const text = String(value ?? '').trim()
  return text ? escapeHtml(text) : fallback
}

function formatParagraph(value, fallback = 'No message provided.') {
  const text = String(value ?? '').replace(/\r\n?/g, '\n').trim()
  return text ? escapeHtml(text).replace(/\n/g, '<br>') : fallback
}

function formatCurrency(value) {
  const amount = Number(value)
  return Number.isFinite(amount) && amount > 0 ? currencyFormatter.format(amount) : 'N/A'
}

function hasEmailConfig() {
  return Boolean(
    EMAIL_USER &&
    EMAIL_PASSWORD &&
    !EMAIL_USER.includes('your-gmail') &&
    !EMAIL_PASSWORD.includes('app-password'),
  )
}

function getTransporter() {
  if (!hasEmailConfig()) {
    return null
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    })
  }

  return transporter
}

async function sendMail(options) {
  const mailer = getTransporter()

  if (!mailer) {
    return {
      success: false,
      message: 'Email service is not configured. Set EMAIL_USER and EMAIL_PASSWORD before deploying.',
    }
  }

  try {
    await mailer.sendMail(options)
    return { success: true, message: 'Email sent successfully.' }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, message: `Failed to send email: ${error.message}` }
  }
}

function renderLayout(title, body) {
  return `
    <div style="font-family: Arial, sans-serif; color: #1a1f4e; line-height: 1.6;">
      <h2 style="margin-bottom: 12px;">${escapeHtml(title)}</h2>
      <div style="border-top: 1px solid #dbe3ff; padding-top: 16px;">
        ${body}
      </div>
    </div>
  `
}

export async function sendApplicationEmail(formData, recipientEmail) {
  const emailContent = renderLayout(
    'New Loan Application Received',
    `
      <h3>Personal Information</h3>
      <p><strong>Full Name:</strong> ${formatText(formData.fullName)}</p>
      <p><strong>Email:</strong> ${formatText(formData.email)}</p>
      <p><strong>Mobile:</strong> ${formatText(formData.mobile)}</p>
      <p><strong>ID Type:</strong> ${formatText(formData.idType)}</p>
      <p><strong>ID Number:</strong> ${formatText(formData.idNumber)}</p>

      <h3>Property Information</h3>
      <p><strong>Property Type:</strong> ${formatText(formData.propertyType)}</p>
      <p><strong>Location:</strong> ${formatText(formData.propertyLocation)}</p>
      <p><strong>Price:</strong> ${formatCurrency(formData.propertyPrice)}</p>

      <h3>Loan Information</h3>
      <p><strong>Loan Amount:</strong> ${formatCurrency(formData.loanAmount)}</p>
      <p><strong>Loan Purpose:</strong> ${formatText(formData.loanPurpose)}</p>
      <p><strong>Loan Term:</strong> ${formatText(formData.loanTerm)} months</p>
      <p><strong>Product Interested:</strong> ${formatText(formData.productInterested)}</p>

      <h3>Employment Information</h3>
      <p><strong>Employment Status:</strong> ${formatText(formData.employmentStatus)}</p>
      <p><strong>Employer:</strong> ${formatText(formData.employer)}</p>
      <p><strong>Position:</strong> ${formatText(formData.position)}</p>
      <p><strong>Monthly Income:</strong> ${formatCurrency(formData.monthlyIncome)}</p>

      <p><strong>Submitted on:</strong> ${escapeHtml(new Date().toLocaleString('en-PH'))}</p>
    `,
  )

  return sendMail({
    from: EMAIL_FROM,
    to: recipientEmail,
    cc: ADMIN_CC_EMAIL || undefined,
    replyTo: formData.email,
    subject: `New Loan Application - ${String(formData.fullName || '').trim() || 'Applicant'}`,
    html: emailContent,
  })
}

export async function sendContactEmail(formData, recipientEmail) {
  const emailContent = renderLayout(
    'New Contact Form Submission',
    `
      <p><strong>Name:</strong> ${formatText(formData.fullName)}</p>
      <p><strong>Email:</strong> ${formatText(formData.email)}</p>
      <p><strong>Subject:</strong> ${formatText(formData.subject)}</p>
      <h3>Message</h3>
      <p>${formatParagraph(formData.message)}</p>
      <p><strong>Submitted on:</strong> ${escapeHtml(new Date().toLocaleString('en-PH'))}</p>
    `,
  )

  return sendMail({
    from: EMAIL_FROM,
    to: recipientEmail,
    cc: ADMIN_CC_EMAIL || undefined,
    replyTo: formData.email,
    subject: `Contact Form - ${String(formData.subject || '').trim() || 'General Inquiry'}`,
    html: emailContent,
  })
}

export async function sendInquiryEmail(formData, recipientEmail) {
  const emailContent = renderLayout(
    'New Inquiry Received',
    `
      <p><strong>Name:</strong> ${formatText(formData.fullName)}</p>
      <p><strong>Email:</strong> ${formatText(formData.email)}</p>
      <p><strong>Mobile:</strong> ${formatText(formData.mobile)}</p>
      <p><strong>Location:</strong> ${formatText(formData.location)}</p>
      <p><strong>Product Interested:</strong> ${formatText(formData.productInterested)}</p>
      <h3>Message</h3>
      <p>${formatParagraph(formData.message)}</p>
      <p><strong>Submitted on:</strong> ${escapeHtml(new Date().toLocaleString('en-PH'))}</p>
    `,
  )

  return sendMail({
    from: EMAIL_FROM,
    to: recipientEmail,
    cc: ADMIN_CC_EMAIL || undefined,
    replyTo: formData.email,
    subject: `New Inquiry - ${String(formData.productInterested || '').trim() || 'Website Inquiry'}`,
    html: emailContent,
  })
}

export async function sendForeclosedPropertyEmail(formData, recipientEmail) {
  const emailContent = renderLayout(
    'New Foreclosed Property Inquiry',
    `
      <p><strong>Name:</strong> ${formatText(formData.fullName)}</p>
      <p><strong>Email:</strong> ${formatText(formData.email)}</p>
      <p><strong>Mobile:</strong> ${formatText(formData.mobile)}</p>
      <p><strong>Property Interested In:</strong> ${formatText(formData.propertyInterested)}</p>
      <h3>Message</h3>
      <p>${formatParagraph(formData.message)}</p>
      <p><strong>Submitted on:</strong> ${escapeHtml(new Date().toLocaleString('en-PH'))}</p>
    `,
  )

  return sendMail({
    from: EMAIL_FROM,
    to: recipientEmail,
    cc: ADMIN_CC_EMAIL || undefined,
    replyTo: formData.email,
    subject: `Foreclosed Property Inquiry - ${String(formData.fullName || '').trim() || 'Website Lead'}`,
    html: emailContent,
  })
}

export async function sendUserConfirmationEmail(userEmail, type, userName) {
  const subject = type === 'application'
    ? 'Loan Application Received'
    : type === 'contact'
      ? 'We Received Your Message'
      : type === 'foreclosed-property'
        ? 'Foreclosed Property Inquiry Received'
        : 'Inquiry Received'

  const message = type === 'application'
    ? 'Thank you for submitting your loan application. Our team will review it and contact you within 24 hours.'
    : type === 'contact'
      ? 'Thank you for contacting us. We will respond to your message within 24 hours.'
      : type === 'foreclosed-property'
        ? 'Thank you for your foreclosed property inquiry. Our team will contact you shortly.'
        : 'Thank you for your inquiry. Our team will be in touch shortly.'

  const emailContent = renderLayout(
    subject,
    `
      <p>Dear ${formatText(userName, 'Customer')},</p>
      <p>${escapeHtml(message)}</p>
      <p>Best regards,<br>AFC SME Finance Team</p>
    `,
  )

  return sendMail({
    from: EMAIL_FROM,
    to: userEmail,
    subject,
    html: emailContent,
  })
}
