export function getIdentifierType(identifier: string): 'email' | 'phone' | 'username' {
    if (!identifier || typeof identifier !== 'string') {
        return 'username'
    }

    const trimmed = identifier.trim()

    // Check if it's an email (contains @ and has domain)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailRegex.test(trimmed)) {
        return 'email'
    }

    // Check if it's a phone number
    // Matches: +1234567890, 1234567890, (123) 456-7890, 123-456-7890, etc.
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    const digitsOnly = trimmed.replace(/[\s\-\+\(\)]/g, '')

    if (phoneRegex.test(trimmed) && digitsOnly.length >= 10 && digitsOnly.length <= 15) {
        return 'phone'
    }

    return 'username'
}
