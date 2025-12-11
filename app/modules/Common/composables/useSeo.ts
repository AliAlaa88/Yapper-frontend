import { useI18n } from 'vue-i18n'

interface SeoOptions {
    title?: string
    description?: string
    keywords?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    ogUrl?: string
    twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
    twitterTitle?: string
    twitterDescription?: string
    twitterImage?: string
}

export function useSeo(options: SeoOptions = {}) {
    const { t, locale } = useI18n()
    const route = useRoute()
    const config = useRuntimeConfig()

    const baseUrl = config.public.apiUrl || 'https://yapper.com'
    const currentUrl = `${baseUrl}${route.fullPath}`

    const defaultTitle = t('seo.default.title')
    const defaultDescription = t('seo.default.description')
    const defaultKeywords = t('seo.default.keywords')

    const title = options.title || defaultTitle
    const description = options.description || defaultDescription
    const keywords = options.keywords || defaultKeywords

    // Open Graph meta tags
    const ogTitle = options.ogTitle || title
    const ogDescription = options.ogDescription || description
    const ogImage = options.ogImage || `${baseUrl}/favicon.ico`
    const ogUrl = options.ogUrl || currentUrl

    // Twitter Card meta tags
    const twitterCard = options.twitterCard || 'summary_large_image'
    const twitterTitle = options.twitterTitle || title
    const twitterDescription = options.twitterDescription || description
    const twitterImage = options.twitterImage || ogImage

    useHead({
        title,
        htmlAttrs: {
            lang: locale.value,
            dir: locale.value === 'ar' ? 'rtl' : 'ltr',
        },
        meta: [
            { name: 'description', content: description },
            { name: 'keywords', content: keywords },

            // Open Graph
            { property: 'og:type', content: 'website' },
            { property: 'og:title', content: ogTitle },
            { property: 'og:description', content: ogDescription },
            { property: 'og:image', content: ogImage },
            { property: 'og:url', content: ogUrl },
            { property: 'og:site_name', content: 'Yapper' },
            { property: 'og:locale', content: locale.value === 'ar' ? 'ar_AR' : 'en_US' },

            // Twitter Card
            { name: 'twitter:card', content: twitterCard },
            { name: 'twitter:title', content: twitterTitle },
            { name: 'twitter:description', content: twitterDescription },
            { name: 'twitter:image', content: twitterImage },
            { name: 'twitter:site', content: '@yapper' },
            { name: 'twitter:creator', content: '@yapper' },

            // Additional meta tags
            { name: 'robots', content: 'index, follow' },
            { name: 'author', content: 'Yapper' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
            { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        ],
        link: [
            { rel: 'canonical', href: currentUrl },
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        ],
    })
}

export function useProfileSeo(profile: { name?: string; username?: string; bio?: string; profile_image?: string }) {
    const { t } = useI18n()

    if (!profile.name || !profile.username) {
        useSeo()
        return
    }

    const title = t('seo.profile.title', { name: profile.name, username: profile.username })
    const description = t('seo.profile.description', {
        name: profile.name,
        username: profile.username,
        bio: profile.bio || ''
    })
    const keywords = t('seo.profile.keywords', { username: profile.username })

    useSeo({
        title,
        description,
        keywords,
        ogImage: profile.profile_image || undefined,
        twitterCard: 'summary',
    })
}

export function useTweetSeo(tweet: { user?: { name?: string; username?: string }; content?: string; media?: any[] }) {
    const { t } = useI18n()

    if (!tweet.user?.name || !tweet.content) {
        useSeo()
        return
    }

    // Truncate tweet text for title (max 50 chars)
    const truncatedText = tweet.content.length > 50
        ? tweet.content.substring(0, 50) + '...'
        : tweet.content

    const title = t('seo.tweet.title', {
        name: tweet.user.name,
        text: truncatedText
    })
    const description = tweet.content
    const keywords = t('seo.tweet.keywords', { username: tweet.user.username })

    // Use first image from media if available
    const tweetImage = tweet.media?.[0]?.url

    useSeo({
        title,
        description,
        keywords,
        ogImage: tweetImage,
        twitterCard: tweetImage ? 'summary_large_image' : 'summary',
    })
}
