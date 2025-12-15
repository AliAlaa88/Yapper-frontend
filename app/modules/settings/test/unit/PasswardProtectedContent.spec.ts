import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import PasswardProtectedContent from '~/modules/settings/components/YourAccount/PasswordProtectedContent.vue'

// --- Stub ConfirmPassword ---
const ConfirmPasswordStub = {
    template: '<div data-test="confirm-password" />',
    props: ['isShow', 'isLoading'],
}

// --- Mock composable ---
const showPasswordConfirmation = ref(false)
const isProtectedContentVisible = ref(false)
const isConfirmingPassword = ref(false)
const checkPasswordConfirmationMock = vi.fn()

vi.mock('~/modules/settings/composables/usePasswordProtection', () => ({
    usePasswordProtection: () => ({
        showPasswordConfirmation,
        isProtectedContentVisible,
        isConfirmingPassword,
        checkPasswordConfirmation: checkPasswordConfirmationMock,
    }),
}))

describe('PasswordProtectedWrapper.vue', () => {
    beforeEach(() => {
        showPasswordConfirmation.value = false
        isProtectedContentVisible.value = false
        isConfirmingPassword.value = false
        checkPasswordConfirmationMock.mockClear()
    })

    const factory = () =>
        mount(PasswardProtectedContent, {
            global: {
                stubs: {
                    ConfirmPassword: ConfirmPasswordStub,
                },
            },
            slots: {
                default: '<div data-test="protected-content">SECRET</div>',
            },
        })

    it('shows loading spinner when content is not visible and confirmation is not shown', () => {
        const wrapper = factory()

        expect(wrapper.find('.animate-spin').exists()).toBe(true)
        expect(wrapper.find('[data-test="confirm-password"]').exists()).toBe(true)
        expect(wrapper.find('[data-test="protected-content"]').exists()).toBe(false)
    })

    it('passes correct props to ConfirmPassword', () => {
        showPasswordConfirmation.value = true
        isConfirmingPassword.value = true

        const wrapper = factory()
        const confirmPassword = wrapper.findComponent(ConfirmPasswordStub)

        expect(confirmPassword.props('isShow')).toBe(true)
        expect(confirmPassword.props('isLoading')).toBe(true)
    })

    it('renders protected slot content when content becomes visible', () => {
        isProtectedContentVisible.value = true

        const wrapper = factory()

        expect(wrapper.find('[data-test="protected-content"]').exists()).toBe(true)
        expect(wrapper.find('.animate-spin').exists()).toBe(false)
    })

    it('calls checkPasswordConfirmation on mount', () => {
        factory()
        expect(checkPasswordConfirmationMock).toHaveBeenCalledTimes(1)
    })
})
