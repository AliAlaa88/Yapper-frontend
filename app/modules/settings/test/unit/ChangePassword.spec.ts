import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ChangePassword from '~/modules/settings/components/YourAccount/ChangePassword.vue'

const DetailedPanelStub = { template: '<div><slot /></div>', props: ['title'] }
const ButtonStub = {
    template: '<button @click="$emit(\'click\')">{{ buttonText }}</button>',
    props: ['isLoading', 'buttonText', 'buttonClass', 'disabled', 'type'],
}

const useChangePasswordMock = {
    mutateAsync: vi.fn().mockResolvedValue({}),
    isPending: ref(false),
    isError: ref(false),
    error: ref(null),
    reset: vi.fn(),
    isSuccess: ref(false),
}

vi.mock('~/modules/settings/queries/userSettingsQueries', () => ({
    userSettingsQueries: () => ({
        useChangePassword: useChangePasswordMock,
    }),
}))

describe('ChangePassword.vue', () => {
    let showSnackbar: any
    let handleShowSnackbar: any
    let wrapper: any

    beforeEach(() => {
        showSnackbar = ref(false)
        handleShowSnackbar = vi.fn()

        wrapper = mount(ChangePassword, {
            global: {
                provide: {
                    snackbar: { showSnackbar, handleShowSnackbar },
                },
                mocks: { $t: (key: string) => key },
                stubs: { DetailedPanel: DetailedPanelStub, Button: ButtonStub },
            },
        })

        useChangePasswordMock.mutateAsync = vi.fn().mockResolvedValue({})
        useChangePasswordMock.isPending.value = false
        useChangePasswordMock.isError.value = false
        useChangePasswordMock.error.value = null
        useChangePasswordMock.isSuccess.value = false
    })

    it('renders form inputs and button', () => {
        expect(wrapper.find('#current-password-input').exists()).toBe(true)
        expect(wrapper.find('#new-password-input').exists()).toBe(true)
        expect(wrapper.find('#confirm-change-passowrd-input').exists()).toBe(true)
        expect(wrapper.findComponent(ButtonStub).exists()).toBe(true)
    })

    it('validates password strength and matching', async () => {
        const newPasswordInput = wrapper.find('#new-password-input')
        const confirmInput = wrapper.find('#confirm-change-passowrd-input')

        await newPasswordInput.setValue('Weak1')
        await confirmInput.setValue('Weak1')
        expect(wrapper.vm.isPasswordStrong).toBe(false)
        expect(wrapper.vm.passwordsMatch).toBe(true)

        await newPasswordInput.setValue('StrongPass1!')
        await confirmInput.setValue('StrongPass1!')
        expect(wrapper.vm.isPasswordStrong).toBe(true)
        expect(wrapper.vm.passwordsMatch).toBe(true)
    })

    it('does not submit if form is invalid', async () => {
        wrapper.vm.currentPassword = ''
        wrapper.vm.newPassword = ''
        wrapper.vm.confirmPassword = ''
        await wrapper.find('form').trigger('submit.prevent')
        expect(useChangePasswordMock.mutateAsync).not.toHaveBeenCalled()
    })

    it('submits successfully and resets form', async () => {
        wrapper.vm.currentPassword = 'CurrentPass1!'
        wrapper.vm.newPassword = 'StrongPass1!'
        wrapper.vm.confirmPassword = 'StrongPass1!'

        await wrapper.find('form').trigger('submit.prevent')

        expect(useChangePasswordMock.mutateAsync).toHaveBeenCalledWith({
            oldPassword: 'CurrentPass1!',
            newPassword: 'StrongPass1!',
        })

        expect(showSnackbar.value).toBe(true)
        expect(handleShowSnackbar).toHaveBeenCalledWith(
            'Your password has been successfully updated.',
        )

        await new Promise((resolve) => setTimeout(resolve, 2000))

        expect(wrapper.vm.currentPassword).toBe('')
        expect(wrapper.vm.newPassword).toBe('')
        expect(wrapper.vm.confirmPassword).toBe('')
        expect(useChangePasswordMock.reset).toHaveBeenCalled()
    })

    it('shows error when mutation fails', async () => {
        const error = { message: 'Failed' }
        useChangePasswordMock.mutateAsync = vi.fn().mockRejectedValue(error)

        wrapper.vm.currentPassword = 'CurrentPass1!'
        wrapper.vm.newPassword = 'StrongPass1!'
        wrapper.vm.confirmPassword = 'StrongPass1!'

        await wrapper.find('form').trigger('submit.prevent')
        expect(useChangePasswordMock.mutateAsync).toHaveBeenCalled()
    })
})
