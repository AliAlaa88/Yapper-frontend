import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import SettingsBlockedButton from '~/modules/settings/components/MuteAndBlock/SubComponents/SettingsBlockedButton.vue'

/* ------------------------------------------------------------------
 * Mock Button component
 * ------------------------------------------------------------------ */
const ButtonStub = {
    template: `
        <button
            :disabled="isLoading"
            @click="$emit('click')"
        >
            {{ buttonText }}
        </button>
    `,
    props: ['buttonText', 'buttonClass', 'isLoading'],
}

/* ------------------------------------------------------------------
 * Mock composable: useUserInteractions
 * ------------------------------------------------------------------ */
const handleBlockMock = vi.fn()
const handleUnblockMock = vi.fn()

const isBlockLoading = ref(false)
const isUnblockLoading = ref(false)

vi.mock('~/modules/profile/composables/useUserInteractions', () => ({
    useUserInteractions: () => ({
        handleBlockWithSnackbar: handleBlockMock,
        handleUnblockWithSnackbar: handleUnblockMock,
        isBlockLoading,
        isUnblockLoading,
    }),
}))

/* ------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------ */
describe('SettingsBlockButton.vue', () => {
    const factory = (props = {}) =>
        mount(SettingsBlockedButton, {
            props: {
                userId: '123',
                ...props,
            },
            global: {
                stubs: {
                    Button: ButtonStub,
                },
                mocks: {
                    $t: (key: string) => key,
                },
            },
        })

    beforeEach(() => {
        handleBlockMock.mockReset()
        handleUnblockMock.mockReset()
        isBlockLoading.value = false
        isUnblockLoading.value = false
    })

    it('renders block button when user is not blocked', () => {
        const wrapper = factory({ isBlocked: false })

        expect(wrapper.text()).toContain('profile.blockButton')
    })

    it('renders unblock button when user is blocked', () => {
        const wrapper = factory({ isBlocked: true })

        expect(wrapper.text()).toContain('profile.blockedButton')
    })

    it('applies correct button class when blocked', () => {
        const wrapper = factory({ isBlocked: true })
        const button = wrapper.findComponent(ButtonStub)

        expect(button.props('buttonClass')).toContain('bg-red')
    })

    it('applies correct button class when not blocked', () => {
        const wrapper = factory({ isBlocked: false })
        const button = wrapper.findComponent(ButtonStub)

        expect(button.props('buttonClass')).toContain('border-red')
    })

    it('calls handleBlockWithSnackbar when clicking and not blocked', async () => {
        const wrapper = factory({ isBlocked: false })

        await wrapper.find('button').trigger('click')

        expect(handleBlockMock).toHaveBeenCalled()
        expect(handleUnblockMock).not.toHaveBeenCalled()
    })

    it('calls handleUnblockWithSnackbar when clicking and blocked', async () => {
        const wrapper = factory({ isBlocked: true })

        await wrapper.find('button').trigger('click')

        expect(handleUnblockMock).toHaveBeenCalled()
        expect(handleBlockMock).not.toHaveBeenCalled()
    })

    it('isLoading is true when block loading is active', async () => {
        isBlockLoading.value = true

        const wrapper = factory({ isBlocked: false })
        await nextTick()

        const button = wrapper.findComponent(ButtonStub)
        expect(button.props('isLoading')).toBe(true)
    })

    it('isLoading is true when unblock loading is active', async () => {
        isUnblockLoading.value = true

        const wrapper = factory({ isBlocked: true })
        await nextTick()

        const button = wrapper.findComponent(ButtonStub)
        expect(button.props('isLoading')).toBe(true)
    })
})
