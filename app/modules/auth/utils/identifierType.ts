export function getIdentifierType(identifier: string): 'email' | 'phone' | 'username' {
    if (!identifier || typeof identifier !== 'string') {
        return 'username'
    }

    const trimmed = identifier.trim()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(trimmed)) {
    return 'email';
  }


  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  const digitsOnly = trimmed.replace(/[\s\-\+\(\)]/g, '');
  
  if (phoneRegex.test(trimmed) && digitsOnly.length >= 10 && digitsOnly.length <= 15) {
    return 'phone';
  }

    if (phoneRegex.test(trimmed) && digitsOnly.length >= 10 && digitsOnly.length <= 15) {
        return 'phone'
    }

    return 'username'
}
