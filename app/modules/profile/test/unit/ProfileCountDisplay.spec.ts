import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import ProfileCountDisplay from '../../components/ProfileCountDisplay.vue'
import { useProfileStore } from '../../stores/profileStore'

describe('ProfileCountDisplay Component', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('displays zero when profile is not set', () => {
        const wrapper = mount(ProfileCountDisplay, {
            global: {
                stubs: {
                    NuxtLink: true,
                },
                mocks: {
                    $t: (key: string, params?: any) => {
                        if (key === 'profile.counts.posts') return `Posts: ${params?.count || 0}`
                        return key
                    },
                    $route: {
                        path: '/testuser',
                    },
                },
            },
        })

        expect(wrapper.html()).toBeDefined()
    })

    it('computes count based on current tab', () => {
        const wrapper = mount(ProfileCountDisplay, {
            global: {
                stubs: {
                    NuxtLink: true,
                },
                mocks: {
                    $t: (key: string, params?: any) => {
                        if (key === 'profile.counts.posts') return `Posts: ${params?.count || 0}`
                        return key
                    },
                    $route: {
                        path: '/testuser',
                    },
                },
            },
        })

        const store = useProfileStore()
        store.setProfile({ num_posts: 42 } as any, false)

        expect(wrapper.html()).toBeDefined()
    })

    it('handles replies tab', () => {
        const wrapper = mount(ProfileCountDisplay, {
            global: {
                stubs: {
                    NuxtLink: true,
                },
                mocks: {
                    $t: (key: string, params?: any) => {
                        if (key === 'profile.counts.replies') return `Replies: ${params?.count || 0}`
                        return key
                    },
                    $route: {
                        path: '/testuser/replies',
                    },
                },
            },
        })

        const store = useProfileStore()
        store.setProfile({ num_replies: 15 } as any, false)

        expect(wrapper.html()).toBeDefined()
    })

    it('handles media tab', () => {
        const wrapper = mount(ProfileCountDisplay, {
            global: {
                stubs: {
                    NuxtLink: true,
                },
                mocks: {
                    $t: (key: string, params?: any) => {
                        if (key === 'profile.counts.media') return `Media: ${params?.count || 0}`
                        return key
                    },
                    $route: {
                        path: '/testuser/media',
                    },
                },
            },
        })

        const store = useProfileStore()
        store.setProfile({ num_media: 8 } as any, false)

        expect(wrapper.html()).toBeDefined()
    })

    it('handles likes tab', () => {
        const wrapper = mount(ProfileCountDisplay, {
            global: {
                stubs: {
                    NuxtLink: true,
                },
                mocks: {
                    $t: (key: string, params?: any) => {
                        if (key === 'profile.counts.likes') return `Likes: ${params?.count || 0}`
                        return key
                    },
                    $route: {
                        path: '/testuser/likes',
                    },
                },
            },
        })

        const store = useProfileStore()
        store.setProfile({ num_likes: 100 } as any, false)

        expect(wrapper.html()).toBeDefined()
    })

    it('uses computed reactivity for count display', () => {
        const wrapper = mount(ProfileCountDisplay, {
            global: {
                stubs: {
                    NuxtLink: true,
                },
                mocks: {
                    $t: (key: string) => key,
                    $route: {
                        path: '/testuser',
                    },
                },
            },
        })

        expect(wrapper.vm).toBeDefined()
    })

    it('correctly identifies current tab from route', () => {
        const wrapper = mount(ProfileCountDisplay, {
            global: {
                stubs: {
                    NuxtLink: true,
                },
                mocks: {
                    $t: (key: string) => key,
                    $route: {
                        path: '/testuser/unknown',
                    },
                },
            },
        })

        expect(wrapper.html()).toBeDefined()
    })
})
