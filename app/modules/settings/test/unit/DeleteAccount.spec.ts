import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import DeleteAccount from '~/modules/settings/components/YourAccount/DeleteAccount.vue'

const DetailedPanelStub = { template: '<div><slot /></div>', props: ['title'] }

const ButtonStub = {
    props: ['isLoading', 'buttonText', 'buttonClass'],
    template: '<button @click="$emit(\'click\')">{{ buttonText }}</button>',
    inheritAttrs: false,
}

vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => ({
        user: ref({
            name: 'Hagar',
            username: 'hagar',
            avatar_url: 'avatar.png',
        }),
    }),
}))

const isPendingMock = ref(true)
const mutateAsyncMock = vi.fn().mockResolvedValue({})
vi.mock('~/modules/settings/queries/userSettingsQueries', () => ({
    userSettingsQueries: () => ({
        useDeleteAccount: {
            mutateAsync: mutateAsyncMock,
            isPending: isPendingMock,
        },
    }),
}))

describe('DeleteAccount.vue', () => {
    let wrapper: any

    beforeEach(() => {
        wrapper = mount(DeleteAccount, {
            global: {
                stubs: {
                    DetailedPanel: DetailedPanelStub,
                    Button: ButtonStub,
                },
                mocks: {
                    $t: (key: string, vars?: Record<string, string>) => {
                        if (vars?.username) return `${key} ${vars.username}`
                        return key
                    },
                },
            },
        })
    })

    it('renders user info and button', () => {
        expect(wrapper.text()).toContain('Hagar')
        expect(wrapper.text()).toContain('@hagar')
        const img = wrapper.find('img')
        expect(img.exists()).toBe(true)
        expect(img.attributes('src')).toBe('avatar.png')
        const button = wrapper.find('button')
        expect(button.exists()).toBe(true)
        expect(button.text()).toContain('settings.deleteAccount.button')
    })

    it('calls handleDelete when button is clicked', async () => {
        const button = wrapper.find('button')
        await button.trigger('click')
        expect(mutateAsyncMock).toHaveBeenCalled()
    })

    it('handles pending state correctly', async () => {
        const { userSettingsQueries } = await import(
            '~/modules/settings/queries/userSettingsQueries'
        )
        userSettingsQueries().useDeleteAccount.isPending.value = true
        await wrapper.vm.$nextTick()
        const button = wrapper.findComponent(ButtonStub)
        expect(button.props('isLoading')).toBe(true)
    })

    it('catches errors without breaking', async () => {
        mutateAsyncMock.mockRejectedValueOnce(new Error('Failed'))
        const button = wrapper.findComponent(ButtonStub)
        await button.trigger('click')
        expect(mutateAsyncMock).toHaveBeenCalled()
    })
})
