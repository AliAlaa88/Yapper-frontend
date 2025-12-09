export function useTweetPageSeo(
    interactionType?: 'likes' | 'retweets' | 'quotes'
) {
    const { t, locale } = useI18n()
    const route = useRoute()
    const config = useRuntimeConfig()

    const username = route.params.username as string
    const tweetId = route.params.tweetId as string

    const seoKey = interactionType
        ? `tweet${interactionType.charAt(0).toUpperCase() + interactionType.slice(1)}`
        : 'tweetDetails'

    const baseUrl = config.public.apiUrl || 'https://yapper.com'
    const currentUrl = `${baseUrl}${route.fullPath}`

    const title = t(`seo.${seoKey}.title`, { username })
    const description = t(`seo.${seoKey}.description`, { username })
    const keywords = t(`seo.${seoKey}.keywords`, { username })

    useHead({
        title,
        htmlAttrs: {
            lang: locale.value,
        },
        meta: [
            { name: 'description', content: description },
            { name: 'keywords', content: keywords },
            { property: 'og:type', content: 'website' },
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:url', content: currentUrl },
            { property: 'og:site_name', content: 'Yapper' },
            { property: 'og:locale', content: locale.value === 'ar' ? 'ar_AR' : 'en_US' },
            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description },
            { name: 'twitter:site', content: '@yapper' },
            { name: 'robots', content: 'index, follow' },
        ],
        link: [
            { rel: 'canonical', href: currentUrl },
        ],
    })
}
