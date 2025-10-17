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

export const formatCount = (count: number) => {
    if (count === 0) return ''
    if (count < 1000) return count.toString()
    if (count < 10000) return `${(count / 1000).toFixed(1)}K`
    if (count < 1000000) return `${Math.floor(count / 1000)}K`
    return `${(count / 1000000).toFixed(1)}M`
}
