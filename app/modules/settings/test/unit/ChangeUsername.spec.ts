import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ChangeUsername from '~/modules/settings/components/AccountInformations/ChangeUsername.vue'

const DetailedPanelStub = { name: 'DetailedPanel', template: '<div><slot /></div>' }
const ButtonStub = {
    name: 'Button',
    props: ['isLoading', 'buttonText'],
    template: '<button><slot /></button>',
}
const LoadingSpinnerStub = { name: 'LoadingSpinner', template: '<div />' }

vi.mock('vue-i18n', () => ({
    useI18n: () => ({ t: (key: string) => key }),
}))

const userRef = ref({ username: 'oldUsername' })
vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => ({ user: userRef }),
}))

const mutateAsyncMock = vi.fn().mockResolvedValue({})
const resetMock = vi.fn()
vi.mock('~/modules/settings/queries/userSettingsQueries', () => ({
    userSettingsQueries: () => ({
        updateUsernameMutation: {
            isPending: ref(false),
            isError: ref(false),
            isSuccess: ref(false),
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

    it('renders current username in input', () => {
        wrapper = factory()
        const input = wrapper.find('input#username-input')
        expect(input.element.value).toBe('oldUsername')
    })

    it('validates username input format', async () => {
        wrapper = factory()
        const input = wrapper.find('input#username-input')
        await input.setValue('invalid*user!')
        expect(input.element.value).toBe('invaliduser')
    })

    it('shows username suggestions and allows selection', async () => {
        wrapper = factory()
        const suggestion = wrapper.findAll('div.text-accent')[0]
        expect(suggestion?.text()).toBe('newUser1')
        await suggestion?.trigger('click')
        const input = wrapper.find('input#username-input')
        expect(input.element.value).toBe('newUser1')
    })

    it('disables submit if username invalid or unchanged', () => {
        wrapper = factory()
        const comp = wrapper.vm as any
        comp.newUsername = 'oldUsername'
        expect(comp.canSubmit).toBe(false)
        comp.newUsername = 'ab' 
        expect(comp.canSubmit).toBe(false)
    })

    it('submits new username if valid', async () => {
        wrapper = factory()
        const comp = wrapper.vm as any
        comp.newUsername = 'validUsername'
        await comp.handleSubmit()
        expect(mutateAsyncMock).toHaveBeenCalledWith({ username: 'validUsername' })
    })

    it('resets mutation state after submission', async () => {
        wrapper = factory()
        const comp = wrapper.vm as any
        comp.newUsername = 'validUsername'

        vi.useFakeTimers()
        await comp.handleSubmit()

        vi.advanceTimersByTime(2000)

        expect(resetMock).toHaveBeenCalled()
        vi.useRealTimers()
    })
})
