import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProfileEditButton from '../../components/ProfileHeader/SubComponents/ProfileEditButton.vue'

vi.mock('#app', () => ({
    useRoute: vi.fn(() => ({
        params: { username: 'testuser' },
    })),
    useRouter: vi.fn(() => ({
        push: vi.fn(),
    })),
}))

describe('ProfileEditButton', () => {
    it('renders edit profile button', () => {
        const wrapper = mount(ProfileEditButton, {
            global: {
                mocks: {
                    $t: (key: string) => key,
                },
            },
        })

        expect(wrapper.find('#btn-edit-profile').exists()).toBe(true)
        expect(wrapper.text()).toContain('profile.editProfile')
    })

    it('navigates to edit profile page on click', async () => {
        const pushMock = vi.fn()
        const { useRouter } = await import('#app')
        vi.mocked(useRouter).mockReturnValue({ push: pushMock } as any)

        const wrapper = mount(ProfileEditButton, {
            global: {
                mocks: {
                    $t: (key: string) => key,
                },
            },
        })

        await wrapper.find('#btn-edit-profile').trigger('click')

        expect(pushMock).toHaveBeenCalledWith('/testuser/settings/profile')
    })
})
