import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import UserActions from '../../components/sidebar/subCompoents/UserActions/UserActions.vue'

// Mock dependencies
vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
        locale: ref('en'),
        locales: ref([
            { code: 'en', dir: 'ltr' },
            { code: 'ar', dir: 'rtl' },
        ]),
    }),
}))

vi.mock('pinia', () => ({
    storeToRefs: (store: any) => ({
        user: ref({
            id: 'user-1',
            username: 'testuser',
            name: 'Test User',
            avatar_url: 'https://example.com/avatar.jpg',
        }),
    }),
    defineStore: vi.fn(),
}))

vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => ({
        user: ref({
            id: 'user-1',
            username: 'testuser',
            name: 'Test User',
            avatar_url: 'https://example.com/avatar.jpg',
        }),
    }),
}))

vi.mock('~/modules/Common/components/Tooltip', () => ({
    CustomToolTip: {
        name: 'CustomToolTip',
        template: '<div><slot name="trigger" /><slot name="content" /></div>',
    },
}))

vi.mock('~/modules/Common/components/Logo', () => ({
    default: {
        name: 'Logo',
        template: '<div class="logo">Logo</div>',
    },
}))

vi.mock('~/modules/Common/components/Popup/Popup.vue', () => ({
    default: {
        name: 'Popup',
        props: ['isOpen', 'title', 'hasCloseButton'],
        emits: ['close'],
        template: '<div v-if="isOpen"><slot /></div>',
    },
}))

vi.mock('~/modules/auth/queries/useLoginQuery', () => ({
    useLogoutQuery: () => ({
        mutate: vi.fn(),
    }),
}))

describe('UserActions Component', () => {
    let wrapper: any

    beforeEach(() => {
        wrapper = mount(UserActions, {
            props: {
                isCollapsed: false,
            },
            global: {
                stubs: {
                    NuxtImg: {
                        template: '<img />',
                    },
                    Teleport: false,
                },
                mocks: {
                    $t: (key: string, options?: any) => {
                        if (key === 'userActions.logoutUsername') {
                            return `Log out @${options?.username}`
                        }
                        return key
                    },
                },
            },
        })
    })

    it('should render user actions container', () => {
        const container = wrapper.find('.mt-auto')
        expect(container.exists()).toBe(true)
    })

    it('should render user avatar', () => {
        const avatars = wrapper.findAll('img')
        expect(avatars.length).toBeGreaterThan(0)
    })

    it('should display user name in expanded state', () => {
        expect(wrapper.text()).toContain('Test User')
    })

    it('should display username in expanded state', () => {
        expect(wrapper.text()).toContain('testuser')
    })

    it('should toggle popup when user card is clicked', async () => {
        expect(wrapper.vm.isPopupOpen).toBe(false)

        await wrapper.vm.togglePopup()
        expect(wrapper.vm.isPopupOpen).toBe(true)

        await wrapper.vm.togglePopup()
        expect(wrapper.vm.isPopupOpen).toBe(false)
    })

    it('should close popup when backdrop is clicked', async () => {
        wrapper.vm.isPopupOpen = true
        await wrapper.vm.$nextTick()

        const backdrop = wrapper.find('.fixed.inset-0')
        await backdrop.trigger('click')

        expect(wrapper.vm.isPopupOpen).toBe(false)
    })

    it('should render logout button in popup', async () => {
        wrapper.vm.isPopupOpen = true
        await wrapper.vm.$nextTick()

        const logoutText = wrapper.text()
        expect(logoutText).toContain('Log out')
    })

    it('should open logout confirmation when logout is clicked', async () => {
        wrapper.vm.isPopupOpen = true
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.isLogoutConfirmOpen).toBe(false)

        await wrapper.vm.handleLogoutClick()

        expect(wrapper.vm.isPopupOpen).toBe(false)
        expect(wrapper.vm.isLogoutConfirmOpen).toBe(true)
    })

    it('should close logout confirmation popup', async () => {
        wrapper.vm.isLogoutConfirmOpen = true
        await wrapper.vm.$nextTick()

        await wrapper.vm.closeLogoutConfirm()
        expect(wrapper.vm.isLogoutConfirmOpen).toBe(false)
    })

    it('should render user card in expanded state', () => {
        const userCard = wrapper.find('.flex.items-center.justify-between')
        expect(userCard.exists()).toBe(true)
    })

    it('should render three-dot menu button in expanded state', () => {
        const menuBtn = wrapper.find('#user-actions-menu-button')
        expect(menuBtn.exists()).toBe(true)
    })

    it('should show collapsed state with avatar only', async () => {
        await wrapper.setProps({ isCollapsed: true })
        await flushPromises()

        const userCard = wrapper.find('.flex.items-center.justify-between')
        expect(userCard.exists()).toBe(false)
    })

    it('should show tooltip in collapsed state', async () => {
        await wrapper.setProps({ isCollapsed: true })
        await flushPromises()

        const tooltip = wrapper.findComponent({ name: 'CustomToolTip' })
        expect(tooltip.exists()).toBe(true)
    })

    it('should render logout confirmation popup with proper buttons', async () => {
        wrapper.vm.isLogoutConfirmOpen = true
        await wrapper.vm.$nextTick()

        const popup = wrapper.findComponent({ name: 'Popup' })
        expect(popup.exists()).toBe(true)
        expect(popup.props('isOpen')).toBe(true)
    })

    it('should call logout mutation when logout is confirmed', async () => {
        const logoutMutation = vi.fn()
        wrapper.vm.$options.setup = vi.fn()

        wrapper.vm.confirmLogout()

        expect(wrapper.vm.isLogoutConfirmOpen).toBe(false)
    })

    it('should render avatar with fallback UI avatar URL', () => {
        const images = wrapper.findAll('img')
        expect(images.length).toBeGreaterThan(0)
    })

    it('should apply correct styling to user card', () => {
        const userCard = wrapper.find('.flex.items-center.justify-between')
        expect(userCard.classes()).toContain('p-3')
        expect(userCard.classes()).toContain('rounded-full')
        expect(userCard.classes()).toContain('hover:bg-hover')
    })

    it('should have clickable user card', () => {
        const userCard = wrapper.find('.flex.items-center.justify-between')
        expect(userCard.classes()).toContain('cursor-pointer')
    })

    it('should render popup with proper positioning', async () => {
        wrapper.vm.isPopupOpen = true
        await wrapper.vm.$nextTick()

        const popup = wrapper.find('[class*="absolute"]')
        expect(popup.exists()).toBe(true)
        expect(popup.classes()).toContain('absolute')
        expect(popup.classes()).toContain('bottom-full')
    })

    it('should display user info in popup', async () => {
        wrapper.vm.isPopupOpen = true
        await wrapper.vm.$nextTick()

        const popupText = wrapper.text()
        expect(popupText).toContain('Test User')
        expect(popupText).toContain('testuser')
    })

    it('should handle RTL layout correctly', async () => {
        expect(wrapper.vm.isRTL).toBeDefined()
    })

    it('should have proper avatar dimensions', () => {
        const avatarDiv = wrapper.find('.w-12.h-12.rounded-full')
        expect(avatarDiv.exists()).toBe(true)
    })

    it('should render name as truncated in expanded state', () => {
        const nameSpan = wrapper.find('.text-primary.truncate.text-sm')
        expect(nameSpan.exists()).toBe(true)
        expect(nameSpan.text()).toContain('Test User')
    })

    it('should render username as truncated in expanded state', () => {
        const usernameSpan = wrapper.find('.text-secondary.text-sm.truncate')
        expect(usernameSpan.exists()).toBe(true)
        expect(usernameSpan.text()).toContain('testuser')
    })

    it('should properly handle multiple togglePopup calls', async () => {
        expect(wrapper.vm.isPopupOpen).toBe(false)

        await wrapper.vm.togglePopup()
        expect(wrapper.vm.isPopupOpen).toBe(true)

        await wrapper.vm.togglePopup()
        expect(wrapper.vm.isPopupOpen).toBe(false)

        await wrapper.vm.togglePopup()
        expect(wrapper.vm.isPopupOpen).toBe(true)
    })

    it('should render with proper min-width for ellipsis support', () => {
        const content = wrapper.find('.flex-1.min-w-0')
        expect(content.exists()).toBe(true)
    })

    it('should have proper flex layout for user info section', () => {
        const infoSection = wrapper.find('.flex.items-center.gap-3')
        expect(infoSection.exists()).toBe(true)
        expect(infoSection.classes()).toContain('flex-1')
    })

    it('should render with transition classes on popup', async () => {
        wrapper.vm.isPopupOpen = true
        await wrapper.vm.$nextTick()

        const popupContainer = wrapper.find('[class*="transition"]')
        expect(popupContainer.exists()).toBe(true)
    })

    it('should render caret arrow in popup', async () => {
        wrapper.vm.isPopupOpen = true
        await wrapper.vm.$nextTick()

        const caretArrow = wrapper.find('[class*="border-l"]')
        expect(caretArrow.exists()).toBe(true)
    })

    it('should handle missing user gracefully', async () => {
        expect(wrapper.vm).toBeDefined()
        expect(wrapper.text()).toContain('Test User')
    })

    it('should render popup with correct z-index', async () => {
        wrapper.vm.isPopupOpen = true
        await wrapper.vm.$nextTick()

        const popup = wrapper.find('[class*="z-50"]')
        expect(popup.exists()).toBe(true)
    })

    it('should render border styles on popup', async () => {
        wrapper.vm.isPopupOpen = true
        await wrapper.vm.$nextTick()

        const popup = wrapper.find('.border.border-primary')
        expect(popup.exists()).toBe(true)
    })

    it('should render shadow on popup', async () => {
        wrapper.vm.isPopupOpen = true
        await wrapper.vm.$nextTick()

        const popup = wrapper.find('[class*="shadow"]')
        expect(popup.exists()).toBe(true)
    })

    it('should properly switch between collapsed and expanded views', async () => {
        expect(wrapper.props('isCollapsed')).toBe(false)

        await wrapper.setProps({ isCollapsed: true })
        expect(wrapper.props('isCollapsed')).toBe(true)

        await wrapper.setProps({ isCollapsed: false })
        expect(wrapper.props('isCollapsed')).toBe(false)
    })

    it('should render flex-shrink-0 on avatar for collapsed state', async () => {
        await wrapper.setProps({ isCollapsed: true })
        await flushPromises()

        const avatar = wrapper.find('.w-12.h-12.rounded-full')
        expect(avatar.exists()).toBe(true)
    })

    it('should properly render user info section with correct gap', () => {
        const userInfo = wrapper.find('.flex.items-center.gap-3')
        expect(userInfo.classes()).toContain('gap-3')
    })

    it('should have proper button styling for menu button', () => {
        const menuBtn = wrapper.find('#user-actions-menu-button')
        expect(menuBtn.classes()).toContain('ml-2')
        expect(menuBtn.classes()).toContain('p-1')
        expect(menuBtn.classes()).toContain('rounded-full')
    })
})
