import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import ChangeUsername from '~/modules/settings/components/AccountInformations/ChangeUsername.vue'

const DetailedPanelStub = { name: 'DetailedPanel', template: '<div><slot /></div>' }
const ButtonStub = {
    name: 'Button',
    props: ['isLoading', 'buttonText', 'disabled'],
    template: '<button :disabled="disabled"><slot /></button>',
}
const LoadingSpinnerStub = { name: 'LoadingSpinner', template: '<div class="loading" />' }

vi.mock('vue-i18n', () => ({
    useI18n: () => ({ t: (key: string) => key }),
}))

const userRef = ref({ username: 'oldUsername' })
vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => ({ user: userRef }),
}))

const mutateAsyncMock = vi.fn()
const resetMock = vi.fn()
const isSuccessRef = ref(false)
const isErrorRef = ref(false)

vi.mock('~/modules/settings/queries/userSettingsQueries', () => ({
    userSettingsQueries: () => ({
        updateUsernameMutation: {
            isPending: ref(false),
            isError: isErrorRef,
            isSuccess: isSuccessRef,
            isPaused: ref(false),
            error: ref(null),
            mutateAsync: mutateAsyncMock,
            reset: resetMock,
        },
        usernameRecommendation: {
            isLoading: ref(false),
            data: ref({ data: { recommendations: ['newUser1', 'newUser2'] } }),
        },
    }),
}))

describe('ChangeUsername.vue', () => {
    let wrapper: ReturnType<typeof mount>

    const factory = () =>
        mount(ChangeUsername, {
            global: {
                stubs: {
                    DetailedPanel: DetailedPanelStub,
                    Button: ButtonStub,
                    LoadingSpinner: LoadingSpinnerStub,
                },
            },
        })

    beforeEach(() => {
        vi.clearAllMocks()
        isSuccessRef.value = false
        isErrorRef.value = false
        userRef.value = { username: 'oldUsername' }
    })

    afterEach(() => {
        if (wrapper) wrapper.unmount()
    })

    it('renders current username in input', () => {
        wrapper = factory()
        const input = wrapper.find('input#username-input')
        expect(input.element.value).toBe('oldUsername')
    })

    it('validates username input format and removes invalid characters', async () => {
        wrapper = factory()
        const input = wrapper.find('input#username-input')
        await input.setValue('invalid*user!')
        expect(input.element.value).toBe('invaliduser')
    })

    it('shows username suggestions and allows selection', async () => {
        wrapper = factory()
        const suggestions = wrapper.findAll('div.text-accent')
        expect(suggestions[0]?.text()).toBe('newUser1')
        await suggestions[0]?.trigger('click')
        const input = wrapper.find('input#username-input')
        expect(input.element.value).toBe('newUser1')
    })

    it('disables submit if username invalid, unchanged, or too short', () => {
        wrapper = factory()
        const comp = wrapper.vm as any
        
        comp.newUsername = 'oldUsername'
        expect(comp.canSubmit).toBeFalsy()
        
        comp.newUsername = 'ab'
        expect(comp.canSubmit).toBeFalsy()
        
        comp.newUsername = ''
        expect(comp.canSubmit).toBeFalsy()
        
        comp.newUsername = 'validNewUsername'
        expect(comp.canSubmit).toBeTruthy()
    })

    it('submits new username and handles success with reset after timeout', async () => {
        mutateAsyncMock.mockResolvedValue({})
        wrapper = factory()
        const comp = wrapper.vm as any
        comp.newUsername = 'validUsername'

        vi.useFakeTimers()
        await comp.handleSubmit()
        
        expect(mutateAsyncMock).toHaveBeenCalledWith({ username: 'validUsername' })
        
        vi.advanceTimersByTime(2000)
        expect(resetMock).toHaveBeenCalled()
        vi.useRealTimers()
    })

    it('handles submit error and logs to console', async () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
        mutateAsyncMock.mockRejectedValue(new Error('Network error'))
        
        wrapper = factory()
        const comp = wrapper.vm as any
        comp.newUsername = 'validUsername'
        
        await comp.handleSubmit()
        
        expect(consoleError).toHaveBeenCalledWith('Failed to update username:', expect.any(Error))
        consoleError.mockRestore()
    })

    it('resets mutation when username changes and mutation was successful or had error', async () => {
        wrapper = factory()
        const comp = wrapper.vm as any
        
        isSuccessRef.value = true
        comp.newUsername = 'changedUsername'
        await nextTick()
        expect(resetMock).toHaveBeenCalled()
        
        resetMock.mockClear()
        isSuccessRef.value = false
        isErrorRef.value = true
        comp.newUsername = 'anotherChange'
        await nextTick()
        expect(resetMock).toHaveBeenCalled()
    })

    it('does not submit when canSubmit is false', async () => {
        wrapper = factory()
        const comp = wrapper.vm as any
        comp.newUsername = 'oldUsername' // same as current
        
        await comp.handleSubmit()
        expect(mutateAsyncMock).not.toHaveBeenCalled()
    })
})
