export interface ValidationResult {
    valid: boolean
    message?: string
}

export function validateEmail(email: string): ValidationResult {
    if (!email) {
        return { valid: false, message: 'Email is required' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Please enter a valid email address' }
    }

    return { valid: true }
}

export function validateName(name: string): ValidationResult {
    if (!name) {
        return { valid: false, message: 'Name is required' }
    }

    if (name.trim().length < 2) {
        return { valid: false, message: 'Name must be at least 2 characters' }
    }

    if (name.length > 50) {
        return { valid: false, message: 'Name must not exceed 50 characters' }
    }

    const nameRegex = /^[a-zA-Z\s\u0600-\u06FF]+$/
    if (!nameRegex.test(name)) {
        return { valid: false, message: 'Name can only contain letters and spaces' }
    }

    return { valid: true }
}

export function validatePassword(password: string): ValidationResult {
    if (!password) {
        return { valid: false, message: 'Password is required' }
    }

    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters' }
    }

    if (password.length > 128) {
        return { valid: false, message: 'Password is too long' }
    }

    // Check for at least one uppercase, one lowercase, one number
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        return {
            valid: false,
            message: 'Password must contain uppercase, lowercase, and number',
        }
    }

    return { valid: true }
}

export function validatePhone(phone: string): ValidationResult {
    if (!phone) {
        return { valid: false, message: 'Phone number is required' }
    }

    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    if (!phoneRegex.test(phone)) {
        return { valid: false, message: 'Please enter a valid phone number' }
    }

    const digitsOnly = phone.replace(/[\s\-\+\(\)]/g, '')
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        return { valid: false, message: 'Phone number must be 10-15 digits' }
    }

    return { valid: true }
}

export function validateUsername(username: string): ValidationResult {
    if (!username) {
        return { valid: false, message: 'Username is required' }
    }

    if (username.length < 3) {
        return { valid: false, message: 'Username must be at least 3 characters' }
    }

    if (username.length > 20) {
        return { valid: false, message: 'Username must not exceed 20 characters' }
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/
    if (!usernameRegex.test(username)) {
        return { valid: false, message: 'Username can only contain letters, numbers, and underscores' }
    }

    return { valid: true }
}

export function validateOtp(otp: string): ValidationResult {
    if (!otp) {
        return { valid: false, message: 'OTP is required' }
    }

    const otpRegex = /^\d{6}$/
    if (!otpRegex.test(otp)) {
        return { valid: false, message: 'OTP must be exactly 6 digits' }
    }

    return { valid: true }
}

export function validateDateOfBirth(year: string, month: string, day: string): ValidationResult {
    if (!year || !month || !day) {
        return { valid: false, message: 'Please select your complete date of birth' }
    }

    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    const dayDiff = today.getDate() - birthDate.getDate()

    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age

    if (actualAge < 13) {
        return { valid: false, message: 'You must be at least 13 years old' }
    }

    if (actualAge > 120) {
        return { valid: false, message: 'Please enter a valid date of birth' }
    }

    return { valid: true }
}

export function validateIdentifier(identifier: string): ValidationResult {
    if (!identifier) {
        return { valid: false, message: 'Please enter your email, phone, or username' }
    }

    // Check if it's an email
    if (identifier.includes('@')) {
        return validateEmail(identifier)
    }

    // Check if it's a phone
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    if (phoneRegex.test(identifier)) {
        return validatePhone(identifier)
    }

    // Otherwise validate as username
    return validateUsername(identifier)
}