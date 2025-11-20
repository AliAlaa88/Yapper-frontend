export interface ValidationResult {
    valid: boolean
    messageKey?: string
}

export function validateEmail(email: string): ValidationResult {
    if (!email) {
        return { valid: false, messageKey: 'auth.validation.emailRequired' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return { valid: false, messageKey: 'auth.validation.emailInvalid' }
    }

    return { valid: true }
}

export function validateName(name: string): ValidationResult {
    if (!name) {
        return { valid: false, messageKey: 'auth.validation.nameRequired' }
    }

    if (name.trim().length < 2) {
        return { valid: false, messageKey: 'auth.validation.nameMinLength' }
    }

    if (name.length > 50) {
        return { valid: false, messageKey: 'auth.validation.nameMaxLength' }
    }

    const nameRegex = /^[a-zA-Z\s\u0600-\u06FF]+$/
    if (!nameRegex.test(name)) {
        return { valid: false, messageKey: 'auth.validation.nameInvalidChars' }
    }

    return { valid: true }
}

export function validatePassword(password: string): ValidationResult {
    if (!password) {
        return { valid: false, messageKey: 'auth.validation.passwordRequired' }
    }

    if (password.length < 8) {
        return { valid: false, messageKey: 'auth.validation.passwordMinLength' }
    }

    if (password.length > 128) {
        return { valid: false, messageKey: 'auth.validation.passwordTooLong' }
    }

    // Check for at least one uppercase, one lowercase, one number
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        return {
            valid: false,
            messageKey: 'auth.validation.passwordWeak',
        }
    }

    return { valid: true }
}

export function validatePhone(phone: string): ValidationResult {
    if (!phone) {
        return { valid: false, messageKey: 'auth.validation.phoneRequired' }
    }

    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    if (!phoneRegex.test(phone)) {
        return { valid: false, messageKey: 'auth.validation.phoneInvalid' }
    }

    const digitsOnly = phone.replace(/[\s\-\+\(\)]/g, '')
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        return { valid: false, messageKey: 'auth.validation.phoneLength' }
    }

    return { valid: true }
}

export function validateUsername(username: string): ValidationResult {
    if (!username) {
        return { valid: false, messageKey: 'auth.validation.usernameRequired' }
    }

    if (username.length < 3) {
        return { valid: false, messageKey: 'auth.validation.usernameMinLength' }
    }

    if (username.length > 20) {
        return { valid: false, messageKey: 'auth.validation.usernameMaxLength' }
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/
    if (!usernameRegex.test(username)) {
        return { valid: false, messageKey: 'auth.validation.usernameInvalidChars' }
    }

    return { valid: true }
}

export function validateOtp(otp: string): ValidationResult {
    if (!otp) {
        return { valid: false, messageKey: 'auth.validation.otpRequired' }
    }
    // OTP can be digits or letters
    const otpRegex = /^[A-Za-z0-9]{6}$/;
    if (!otpRegex.test(otp)) {
        return { valid: false, messageKey: 'auth.validation.otpInvalid' }
    }

    return { valid: true }
}

export function validateDateOfBirth(year: string, month: string, day: string): ValidationResult {
    if (!year || !month || !day) {
        return { valid: false, messageKey: 'auth.validation.dobRequired' }
    }

    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    const dayDiff = today.getDate() - birthDate.getDate()

    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age

    if (actualAge < 13) {
        return { valid: false, messageKey: 'auth.validation.dobTooYoung' }
    }

    if (actualAge > 120) {
        return { valid: false, messageKey: 'auth.validation.dobInvalid' }
    }

    return { valid: true }
}

export function validateIdentifier(identifier: string): ValidationResult {
    if (!identifier) {
        return { valid: false, messageKey: 'auth.validation.identifierRequired' }
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
