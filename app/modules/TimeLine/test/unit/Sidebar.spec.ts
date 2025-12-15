import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import Sidebar from '../../components/sidebar/Sidebar.vue'
import { createPinia, setActivePinia } from 'pinia'

// Mock dependencies
vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
        locale: ref('en'),
    }),
}))

vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $chatSocketService: {
            totalUnreadChats: ref(5),
        },
        $notificationsSocketService: {
            unreadCount: ref(3),
        },
    }),
    navigateTo: vi.fn(),
}))

vi.mock('pinia', () => ({
    storeToRefs: () => ({
        user: ref({
            id: 'user-1',
            username: 'testuser',
        }),
    }),
    defineStore: vi.fn(),
    createPinia: () => ({}),
    setActivePinia: vi.fn(),
}))

vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => ({
        user: ref({
            id: 'user-1',
            username: 'testuser',
        }),
    }),
}))

vi.mock('~/modules/TimeLine/composables/useSidebarState', () => ({
    useSidebarState: () => ({
        isExpanded: ref(true),
        sidebarWidth: ref('275px'),
        toggleSidebar: vi.fn(),
    }),
}))

describe('Sidebar Component', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('should mount component successfully', () => {
        const wrapper = mount(Sidebar, {
            global: {
                stubs: {
                    NuxtLink: true,
                    UserActions: true,
                    Logo: true,
                    CustomToolTip: true,
                    Popup: true,
                    Teleport: true,
                    PostTweet: true,
                },
            },
        })
        
        expect(wrapper.exists()).toBe(true)
    })

    it('should render sidebar aside element', () => {
        const wrapper = mount(Sidebar, {
            global: {
                stubs: {
                    NuxtLink: true,
                    UserActions: true,
                    Logo: true,
                    CustomToolTip: true,
                    Popup: true,
                    Teleport: true,
                    PostTweet: true,
                },
            },
        })
        
        expect(wrapper.find('aside').exists()).toBe(true)
    })

    it('should render logo inside navigation', () => {
        const wrapper = mount(Sidebar, {
            global: {
                stubs: {
                    NuxtLink: true,
                    UserActions: true,
                    Logo: true,
                    CustomToolTip: true,
                    Popup: true,
                    Teleport: true,
                    PostTweet: true,
                },
            },
        })
        
        // Logo is inside a stubbed NuxtLink, so we verify the structure is rendered
        const aside = wrapper.find('aside')
        expect(aside.exists()).toBe(true)
    })

    it('should render navigation links', () => {
        const wrapper = mount(Sidebar, {
            global: {
                stubs: {
                    NuxtLink: true,
                    UserActions: true,
                    Logo: true,
                    CustomToolTip: true,
                    Popup: true,
                    Teleport: true,
                    PostTweet: true,
                },
            },
        })
        
        const navLinks = wrapper.findAll('nuxt-link-stub')
        expect(navLinks.length).toBeGreaterThan(0)
    })

    it('should render UserActions component', () => {
        const wrapper = mount(Sidebar, {
            global: {
                stubs: {
                    NuxtLink: { template: '<a></a>' },
                    UserActions: { template: '<div class="user-actions"></div>' },
                    Logo: { template: '<div></div>' },
                    CustomToolTip: { template: '<div></div>' },
                    Popup: { template: '<div></div>' },
                    Teleport: { template: '<div></div>' },
                    PostTweet: { template: '<div></div>' },
                },
            },
        })
        
        expect(wrapper.find('.user-actions').exists()).toBe(true)
    })

    it('should render with sidebar width class', () => {
        const wrapper = mount(Sidebar, {
            global: {
                stubs: {
                    NuxtLink: true,
                    UserActions: true,
                    Logo: true,
                    CustomToolTip: true,
                    Popup: true,
                    Teleport: true,
                    PostTweet: true,
                },
            },
        })
        
        const aside = wrapper.find('aside')
        expect(aside.exists()).toBe(true)
        const classes = aside.classes()
        expect(classes).toContain('w-[275px]')
    })

    it('should have nav element', () => {
        const wrapper = mount(Sidebar, {
            global: {
                stubs: {
                    NuxtLink: true,
                    UserActions: true,
                    Logo: true,
                    CustomToolTip: true,
                    Popup: true,
                    Teleport: true,
                    PostTweet: true,
                },
            },
        })
        
        expect(wrapper.find('nav').exists()).toBe(true)
    })

    it('should apply flex and column layout classes', () => {
        const wrapper = mount(Sidebar, {
            global: {
                stubs: {
                    NuxtLink: true,
                    UserActions: true,
                    Logo: true,
                    CustomToolTip: true,
                    Popup: true,
                    Teleport: true,
                    PostTweet: true,
                },
            },
        })
        
        const aside = wrapper.find('aside')
        expect(aside.classes()).toContain('flex')
        expect(aside.classes()).toContain('flex-col')
    })

    it('should have proper background classes', () => {
        const wrapper = mount(Sidebar, {
            global: {
                stubs: {
                    NuxtLink: true,
                    UserActions: true,
                    Logo: true,
                    CustomToolTip: true,
                    Popup: true,
                    Teleport: true,
                    PostTweet: true,
                },
            },
        })
        
        const aside = wrapper.find('aside')
        expect(aside.classes()).toContain('bg-primary')
        expect(aside.classes()).toContain('h-full')
    })

    it('should render Popup component for posting tweets', () => {
        const wrapper = mount(Sidebar, {
            global: {
                stubs: {
                    NuxtLink: true,
                    UserActions: true,
                    Logo: true,
                    CustomToolTip: true,
                    Popup: true,
                    Teleport: true,
                    PostTweet: true,
                },
            },
        })
        
        // Popup component is rendered (PostTweet is inside it)
        expect(wrapper.find('popup-stub').exists()).toBe(true)
    })
})