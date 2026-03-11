import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

const EMAIL_USER = process.env.EMAIL_USER || 'your-gmail@gmail.com'
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'app-password'
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@afcsme.com'
const ADMIN_CC_EMAIL = process.env.FORMS_CC_EMAIL || ''

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
})

/**
 * Send application form email
 */
export async function sendApplicationEmail(formData, recipientEmail) {
  const emailContent = `
    <h2>New Loan Application Received</h2>
    <hr>
    <h3>Personal Information</h3>
    <p><strong>Full Name:</strong> ${formData.fullName}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Mobile:</strong> ${formData.mobile}</p>
    <p><strong>ID Type:</strong> ${formData.idType}</p>
    <p><strong>ID Number:</strong> ${formData.idNumber}</p>

    <h3>Property Information</h3>
    <p><strong>Property Type:</strong> ${formData.propertyType}</p>
    <p><strong>Location:</strong> ${formData.propertyLocation}</p>
    <p><strong>Price:</strong> ₱${Number(formData.propertyPrice).toLocaleString()}</p>

    <h3>Loan Information</h3>
    <p><strong>Loan Amount:</strong> ₱${Number(formData.loanAmount).toLocaleString()}</p>
    <p><strong>Loan Purpose:</strong> ${formData.loanPurpose}</p>
    <p><strong>Loan Term:</strong> ${formData.loanTerm} years</p>
    <p><strong>Product Interested:</strong> ${formData.productInterested}</p>

    <h3>Employment Information</h3>
    <p><strong>Employment Status:</strong> ${formData.employmentStatus}</p>
    <p><strong>Employer:</strong> ${formData.employer || 'N/A'}</p>
    <p><strong>Position:</strong> ${formData.position || 'N/A'}</p>
    <p><strong>Monthly Income:</strong> ₱${Number(formData.monthlyIncome).toLocaleString()}</p>

    <hr>
    <p>Submitted on: ${new Date().toLocaleString()}</p>
  `

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: recipientEmail,
      cc: ADMIN_CC_EMAIL || undefined,
      replyTo: formData.email,
      subject: `New Loan Application - ${formData.fullName}`,
      html: emailContent,
    })
    return { success: true, message: 'Email sent successfully' }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, message: `Failed to send email: ${error.message}` }
  }
}

/**
 * Send contact form email
 */
export async function sendContactEmail(formData, recipientEmail) {
  const emailContent = `
    <h2>New Contact Form Submission</h2>
    <hr>
    <p><strong>Name:</strong> ${formData.fullName}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Subject:</strong> ${formData.subject}</p>

    <h3>Message:</h3>
    <p>${formData.message.replace(/\n/g, '<br>')}</p>

    <hr>
    <p>Submitted on: ${new Date().toLocaleString()}</p>
  `

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: recipientEmail,
      cc: ADMIN_CC_EMAIL || undefined,
      replyTo: formData.email,
      subject: `Contact Form - ${formData.subject}`,
      html: emailContent,
    })
    return { success: true, message: 'Email sent successfully' }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, message: `Failed to send email: ${error.message}` }
  }
}

/**
 * Send inquiry form email
 */
export async function sendInquiryEmail(formData, recipientEmail) {
  const emailContent = `
    <h2>New Inquiry Received</h2>
    <hr>
    <p><strong>Name:</strong> ${formData.fullName}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Mobile:</strong> ${formData.mobile}</p>
    <p><strong>Location:</strong> ${formData.location}</p>
    <p><strong>Product Interested:</strong> ${formData.productInterested}</p>

    <h3>Message:</h3>
    <p>${formData.message ? formData.message.replace(/\n/g, '<br>') : 'No message provided'}</p>

    <hr>
    <p>Submitted on: ${new Date().toLocaleString()}</p>
  `

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: recipientEmail,
      cc: ADMIN_CC_EMAIL || undefined,
      replyTo: formData.email,
      subject: `New Inquiry - ${formData.productInterested}`,
      html: emailContent,
    })
    return { success: true, message: 'Email sent successfully' }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, message: `Failed to send email: ${error.message}` }
  }
}

/**
 * Send foreclosed property inquiry form email
 */
export async function sendForeclosedPropertyEmail(formData, recipientEmail) {
  const emailContent = `
    <h2>New Foreclosed Property Inquiry</h2>
    <hr>
    <p><strong>Name:</strong> ${formData.fullName}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Mobile:</strong> ${formData.mobile}</p>
    <p><strong>Property Interested In:</strong> ${formData.propertyInterested || 'Not specified'}</p>

    <h3>Message:</h3>
    <p>${formData.message ? formData.message.replace(/\n/g, '<br>') : 'No message provided'}</p>

    <hr>
    <p>Submitted on: ${new Date().toLocaleString()}</p>
  `

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: recipientEmail,
      cc: ADMIN_CC_EMAIL || undefined,
      replyTo: formData.email,
      subject: `Foreclosed Property Inquiry - ${formData.fullName}`,
      html: emailContent,
    })
    return { success: true, message: 'Email sent successfully' }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, message: `Failed to send email: ${error.message}` }
  }
}

/**
 * Send confirmation email to user
 */
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

  const emailContent = `
    <h2>${subject}</h2>
    <p>Dear ${userName},</p>
    <p>${message}</p>
    <br/>
    <p>Best regards,<br/>AFC SME Finance Team</p>
  `

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: userEmail,
      subject,
      html: emailContent,
    })
    return { success: true }
  } catch (error) {
    console.error('User confirmation email error:', error)
    return { success: false }
  }
}
