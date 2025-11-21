export function calculateAge(birthDateStr: string): number {
    const birthDate = new Date(birthDateStr)
    const today = new Date()

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    const dayDiff = today.getDate() - birthDate.getDate()

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--
    }

    return age
}

export function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
}

export function formatFullDateTime(isoDateStr: string): string {
    const date = new Date(isoDateStr)

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    }

    return date.toLocaleString('en-US', options)
}
