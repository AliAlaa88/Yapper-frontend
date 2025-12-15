export const formatDate = (date: string, locale: string = 'en') => {
    const now = new Date()
    const tweetDate = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - tweetDate.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`

    return tweetDate.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
        month: 'short',
        day: 'numeric',
    })
}

export const formatCount = (count: number | string, locale: string = 'en') => {
    const countNumber = typeof count === 'string' ? parseInt(count) : count
    if (countNumber === 0) return ''

    // Use locale-aware number formatting
    const localeCode = locale === 'ar' ? 'ar-EG' : 'en-US'

    if (countNumber < 1000) {
        return new Intl.NumberFormat(localeCode).format(countNumber)
    }
    if (countNumber < 10000) {
        const formatted = (countNumber / 1000).toFixed(1)
        return `${new Intl.NumberFormat(localeCode).format(parseFloat(formatted))}${locale === 'ar' ? ' ألف' : 'K'}`
    }
    if (countNumber < 1000000) {
        const formatted = Math.floor(countNumber / 1000)
        return `${new Intl.NumberFormat(localeCode).format(formatted)}${locale === 'ar' ? ' ألف' : 'K'}`
    }
    const formatted = (countNumber / 1000000).toFixed(1)
    return `${new Intl.NumberFormat(localeCode).format(parseFloat(formatted))}${locale === 'ar' ? ' مليون' : 'M'}`
}

export const formatDetailDate = (date: string, locale: string = 'en') => {
    const tweetDate = new Date(date)
    const localeCode = locale === 'ar' ? 'ar-EG' : 'en-US'

    // Format time
    const time = tweetDate.toLocaleTimeString(localeCode, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: locale !== 'ar',
    })

    // Format date
    const dateFormatted = tweetDate.toLocaleDateString(localeCode, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })

    return `${time} · ${dateFormatted}`
}
