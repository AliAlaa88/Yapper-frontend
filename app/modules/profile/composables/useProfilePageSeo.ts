import { useProfileStore } from '~/modules/profile/stores/profileStore'

export function useProfilePageSeo(
    section: 'profile' | 'likes' | 'media' | 'replies' | 'followers' | 'following',
) {
    const { t, locale } = useI18n()
    const route = useRoute()
    const config = useRuntimeConfig()
    const profileStore = useProfileStore()
    const { profile } = storeToRefs(profileStore)

    const username = route.params.username as string
    const baseUrl = config.public.apiUrl || 'https://yapper.com'
    const currentUrl = `${baseUrl}${route.fullPath}`

    const getInitialTitle = (section: string, username: string) => {
        const titleMap = {
            profile: `@${username} / Yapper`,
            likes: `Posts liked by @${username} / Yapper`,
            media: `Media posts by @${username} / Yapper`,
            replies: `Replies by @${username} / Yapper`,
            followers: `People following @${username} / Yapper`,
            following: `People followed by @${username} / Yapper`,
        }
        return titleMap[section as keyof typeof titleMap] || `@${username} / Yapper`
    }

    const seoData = computed(() => {
        const newProfile = profile.value
        if (!newProfile) {
            return {
                title: getInitialTitle(section, username),
                description: t('seo.default.description'),
                keywords: t('seo.default.keywords'),
                ogImage: `${baseUrl}/og-image.png`,
                twitterCard: 'summary_large_image' as const,
            }
        }

        if (section === 'profile') {
            return {
                title: t('seo.profile.title', {
                    name: newProfile.name,
                    username: newProfile.username,
                }),
                description: t('seo.profile.description', {
                    name: newProfile.name,
                    username: newProfile.username,
                    bio: newProfile.bio || '',
                }),
                keywords: t('seo.profile.keywords', { username: newProfile.username }),
                ogImage: newProfile.avatar_url || `${baseUrl}/og-image.png`,
                twitterCard: 'summary' as const,
            }
        } else {
            return {
                title: t(`seo.${section}.title`, {
                    name: newProfile.name,
                    username: newProfile.username,
                }),
                description: t(`seo.${section}.description`, {
                    name: newProfile.name,
                    username: newProfile.username,
                }),
                keywords: t(`seo.${section}.keywords`, {
                    username: newProfile.username,
                }),
                ogImage: `${baseUrl}/og-image.png`,
                twitterCard: 'summary_large_image' as const,
            }
        }
    })

    useHead({
        title: () => seoData.value.title,
        htmlAttrs: {
            lang: locale.value,
        },
        meta: [
            { name: 'description', content: () => seoData.value.description },
            { name: 'keywords', content: () => seoData.value.keywords },
            { property: 'og:type', content: 'website' },
            { property: 'og:title', content: () => seoData.value.title },
            { property: 'og:description', content: () => seoData.value.description },
            { property: 'og:image', content: () => seoData.value.ogImage },
            { property: 'og:url', content: currentUrl },
            { property: 'og:site_name', content: 'Yapper' },
            { property: 'og:locale', content: locale.value === 'ar' ? 'ar_AR' : 'en_US' },
            { name: 'twitter:card', content: () => seoData.value.twitterCard },
            { name: 'twitter:title', content: () => seoData.value.title },
            { name: 'twitter:description', content: () => seoData.value.description },
            { name: 'twitter:image', content: () => seoData.value.ogImage },
            { name: 'twitter:site', content: '@yapper' },
            { name: 'twitter:creator', content: '@yapper' },
            { name: 'robots', content: 'index, follow' },
            { name: 'author', content: 'Yapper' },
        ],
        link: [{ rel: 'canonical', href: currentUrl }],
    })
}
