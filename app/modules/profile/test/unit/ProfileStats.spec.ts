import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ProfileStats from '../../components/ProfileHeader/SubComponents/ProfileStats.vue'
import { useUserInfo } from '../../composables/useUserInfo'

vi.mock('../../composables/useUserInfo', () => ({
    useUserInfo: vi.fn(),
}))

describe('ProfileStats', () => {
    it('renders following and followers count', () => {
        const mockUserInfo = {
            followersCount: ref(150),
            followingCount: ref(75),
        }

        vi.mocked(useUserInfo).mockReturnValue(mockUserInfo as ReturnType<typeof useUserInfo>)

        const wrapper = mount(ProfileStats, {
            global: {
                provide: {
                    'user-id': ref('test-user-id'),
                },
            },
        })

        expect(wrapper.text()).toContain('75')
        expect(wrapper.text()).toContain('Following')
        expect(wrapper.text()).toContain('150')
        expect(wrapper.text()).toContain('Followers')
    })
})
