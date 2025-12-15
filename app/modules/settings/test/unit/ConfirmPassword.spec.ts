import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ConfirmPassword from '~/modules/settings/components/YourAccount/SubComponents/ConfirmPassword.vue'

const ButtonStub = {
    template: '<button :disabled="disabled" @click="$emit(\'click\')">{{ buttonText }}</button>',
    props: ['isLoading', 'buttonText', 'buttonClass', 'disabled', 'type'],
}
const NuxtLinkStub = { template: '<a><slot /></a>', props: ['to'] }

const handlePasswordConfirmationMock = vi.fn()

vi.mock('~/modules/settings/composables/usePasswordProtection', () => ({
    usePasswordProtection: () => ({
        handlePasswordConfirmation: handlePasswordConfirmationMock,
        invalidateOnPasswordChange: vi.fn(),
        showPasswordConfirmation: ref(false),
        isProtectedContentVisible: ref(false),
        useConfirmPassword: {
            isPending: ref(false),
        },
    }),
}))

describe('ConfirmPassword', () => {
    let wrapper: any

    const factory = (props = { isShow: true, isLoading: false }) => {
        return mount(ConfirmPassword, {
            props,
            global: {
                stubs: { Button: ButtonStub, NuxtLink: NuxtLinkStub },
                mocks: { $t: (key: string) => key },
            },
        })
    }

    beforeEach(() => {
        handlePasswordConfirmationMock.mockReset()
        wrapper = factory()
    })

    it('renders the input, links, and button when visible', async () => {
        wrapper = factory()
        // Make the second link visible
        wrapper.vm.showNoPasswordWarning = true
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toContain('settings.confirm_password')
        expect(wrapper.find('input#confirm-password-input').exists()).toBe(true)
        expect(wrapper.findAllComponents(NuxtLinkStub)).toHaveLength(2)
        expect(wrapper.findComponent(ButtonStub).exists()).toBe(true)
    })

    it('calls handlePasswordConfirmation on submit with entered password', async () => {
        const input = wrapper.find('input#confirm-password-input')
        await input.setValue('mypassword')
        await wrapper.find('form').trigger('submit.prevent')
        expect(handlePasswordConfirmationMock).toHaveBeenCalledWith('mypassword')
    })

    it('shows error message for wrong password', async () => {
        handlePasswordConfirmationMock.mockRejectedValueOnce(new Error('WRONG_PASSWORD'))
        const input = wrapper.find('input#confirm-password-input')
        await input.setValue('wrongpass')
        await wrapper.find('form').trigger('submit.prevent')
        expect(wrapper.text()).toContain('The password you entered was incorrect.')
    })

    it('shows warning when no password is set', async () => {
        handlePasswordConfirmationMock.mockRejectedValueOnce(new Error('NO_PASSWORD_SET'))
        const input = wrapper.find('input#confirm-password-input')
        await input.setValue('any')
        await wrapper.find('form').trigger('submit.prevent')
        expect(wrapper.text()).toContain('settings.noPasswordSetTitle')
        expect(wrapper.text()).toContain('settings.noPasswordSetDescription')
    })

    it('resets error and warning on input change', async () => {
        const input = wrapper.find('input#confirm-password-input')
        wrapper.vm.errorMessage = 'Some error'
        wrapper.vm.showNoPasswordWarning = true
        await input.setValue('newpass')
        expect(wrapper.vm.errorMessage).toBe('')
        expect(wrapper.vm.showNoPasswordWarning).toBe(false)
    })

    it('disables submit button if input is empty', () => {
        wrapper.vm.password = ''
        const button = wrapper.findComponent(ButtonStub)
        expect(button.attributes('disabled')).toBeDefined()
    })

    it('disables submit button if loading is true', () => {
        wrapper.vm.password = 'something'
        wrapper.vm.isLoading = true
        const button = wrapper.findComponent(ButtonStub)
        expect(button.attributes('disabled')).toBeDefined()
    })
})
