export const formatDate = (date: string) => {
    const now = new Date()
    const tweetDate = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - tweetDate.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`

    return tweetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const formatCount = (count: number | string) => {
    const countNumber = typeof count === 'string' ? parseInt(count) : count
    if (countNumber === 0) return ''
    if (countNumber < 1000) return countNumber.toString()
    if (countNumber < 10000) return `${(countNumber / 1000).toFixed(1)}K`
    if (countNumber < 1000000) return `${Math.floor(countNumber / 1000)}K`
    return `${(countNumber / 1000000).toFixed(1)}M`
}
