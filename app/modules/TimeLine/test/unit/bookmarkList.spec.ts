import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import bookmarkList from '../../components/bookmarkList/bookmarkList.vue'
import { createPinia, setActivePinia } from 'pinia'

// Mock vue-router
const mockRouter = {
    back: vi.fn(),
}

vi.mock('vue-router', () => ({
    useRouter: () => mockRouter,
}))

// Mock Nuxt app
vi.mock('#app', () => ({
    useNuxtApp: () => ({}),
    navigateTo: vi.fn(),
}))

// Mock tweet queries to prevent module loading issues
vi.mock('~/modules/tweets/queries/useTweetQueries', () => ({
    useGetBookmarkedTweetsQuery: () => ({
        data: ref({
            pages: [{ data: [] }],
        }),
        isLoading: ref(false),
        isError: ref(false),
        fetchNextPage: vi.fn(),
        hasNextPage: ref(false),
    }),
}))

// Mock i18n
vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'navigation.back': 'Back',
                'bookmarks.title': 'Bookmarks',
            }
            return translations[key] || key
        },
    }),
}))

// Mock pinia
vi.mock('pinia', () => ({
    storeToRefs: () => ({
        user: ref({
            user_id: 'user-123',
            username: 'testuser',
            name: 'Test User',
        }),
    }),
    defineStore: vi.fn(),
    createPinia: () => ({}),
    setActivePinia: vi.fn(),
}))

vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => ({
        user: ref({
            user_id: 'user-123',
            username: 'testuser',
            name: 'Test User',
        }),
    }),
}))

describe('bookmarkList Component', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    it('should mount component successfully', () => {
        const wrapper = mount(bookmarkList, {
            global: {
                stubs: {
                    TweetsList: true,
                    ArrowLeft: true,
                },
                mocks: {
                    $t: (key: string) => key,
                },
            },
        })
        
        expect(wrapper.exists()).toBe(true)
    })

    it('should render sticky header', () => {
        const wrapper = mount(bookmarkList, {
            global: {
                stubs: {
                    TweetsList: true,
                    ArrowLeft: true,
                },
                mocks: {
                    $t: (key: string) => key,
                },
            },
        })
        
        const header = wrapper.find('.sticky')
        expect(header.exists()).toBe(true)
        expect(header.classes()).toContain('top-0')
    })

    it('should render back button', () => {
        const wrapper = mount(bookmarkList, {
            global: {
                stubs: {
                    TweetsList: true,
                    ArrowLeft: { template: '<svg></svg>' },
                },
                mocks: {
                    $t: (key: string) => key,
                },
            },
        })
        
        const backButton = wrapper.find('#btn-back-bookmarks')
        expect(backButton.exists()).toBe(true)
    })

    it('should render bookmarks title', () => {
        const wrapper = mount(bookmarkList, {
            global: {
                stubs: {
                    TweetsList: true,
                    ArrowLeft: true,
                },
                mocks: {
                    $t: (key: string) => {
                        const translations: Record<string, string> = {
                            'bookmarks.title': 'Bookmarks',
                            'navigation.back': 'Back',
                        }
                        return translations[key] || key
                    },
                },
            },
        })
        
        expect(wrapper.text()).toContain('Bookmarks')
    })

    it('should render TweetsList component', () => {
        const wrapper = mount(bookmarkList, {
            global: {
                stubs: {
                    TweetsList: { template: '<div class="tweets-list"></div>' },
                    ArrowLeft: true,
                },
                mocks: {
                    $t: (key: string) => key,
                },
            },
        })
        
        expect(wrapper.find('.tweets-list').exists()).toBe(true)
    })

    it('should call router.back when back button is clicked', async () => {
        const wrapper = mount(bookmarkList, {
            global: {
                stubs: {
                    TweetsList: true,
                    ArrowLeft: { template: '<svg></svg>' },
                },
                mocks: {
                    $t: (key: string) => key,
                },
            },
        })
        
        const backButton = wrapper.find('#btn-back-bookmarks')
        await backButton.trigger('click')
        
        expect(mockRouter.back).toHaveBeenCalled()
    })

    it('should have backdrop blur effect on header', () => {
        const wrapper = mount(bookmarkList, {
            global: {
                stubs: {
                    TweetsList: true,
                    ArrowLeft: true,
                },
                mocks: {
                    $t: (key: string) => key,
                },
            },
        })
        
        const header = wrapper.find('.sticky')
        expect(header.classes()).toContain('backdrop-blur-md')
    })

    it('should have proper padding classes', () => {
        const wrapper = mount(bookmarkList, {
            global: {
                stubs: {
                    TweetsList: true,
                    ArrowLeft: true,
                },
                mocks: {
                    $t: (key: string) => key,
                },
            },
        })
        
        const container = wrapper.find('.flex.items-center.gap-8')
        expect(container.classes()).toContain('px-4')
        expect(container.classes()).toContain('py-3')
    })

    it('should render back button with hover effect', () => {
        const wrapper = mount(bookmarkList, {
            global: {
                stubs: {
                    TweetsList: true,
                    ArrowLeft: true,
                },
                mocks: {
                    $t: (key: string) => key,
                },
            },
        })
        
        const backButton = wrapper.find('#btn-back-bookmarks')
        expect(backButton.classes()).toContain('hover:bg-hover')
        expect(backButton.classes()).toContain('rounded-full')
    })

    it('should have z-index for sticky positioning', () => {
        const wrapper = mount(bookmarkList, {
            global: {
                stubs: {
                    TweetsList: true,
                    ArrowLeft: true,
                },
                mocks: {
                    $t: (key: string) => key,
                },
            },
        })
        
        const header = wrapper.find('.sticky')
        expect(header.classes()).toContain('z-10')
    })
})
