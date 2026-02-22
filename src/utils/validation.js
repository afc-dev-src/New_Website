// Email validation
export const validateEmail = (email) => {
  if (!email?.trim()) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Required field validation
export const validateRequired = (value) => {
  return value?.toString().trim() !== ''
}

// Phone number validation (basic)
export const validatePhoneNumber = (phone) => {
  if (!phone?.trim()) return false
  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  // Check if it's a valid phone number (at least 10 digits)
  return /^[\d+]{10,}$/.test(cleaned)
}

// Returns validation error or empty string if valid
export const getEmailError = (email) => {
  if (!email.trim()) return 'Email is required'
  if (!validateEmail(email)) return 'Invalid email'
  return ''
}

// Returns validation error or empty string if valid
export const getPhoneError = (phone) => {
  if (!phone.trim()) return 'Phone number is required'
  if (!validatePhoneNumber(phone)) return 'Invalid phone number'
  return ''
}

// Returns validation error or empty string if valid
export const getRequiredFieldError = (value, fieldName) => {
  if (!validateRequired(value)) return `${fieldName} is required`
  return ''
}

// Validate multiple fields at once
export const validateFormFields = (formData, requirements) => {
  const errors = {}
  Object.entries(requirements).forEach(([field, validator]) => {
    const error = validator(formData[field])
    if (error) errors[field] = error
  })
  return errors
}
