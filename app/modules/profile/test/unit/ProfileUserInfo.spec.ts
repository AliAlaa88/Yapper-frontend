import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProfileUserInfo from '../../components/ProfileHeader/SubComponents/ProfileUserInfo.vue'

const mockUsers = {
    user1: {
        name: 'Mohamed Hassan',
        username: 'mhassan123',
    },
}

describe('ProfileUserInfo Component', () => {
    it('renders Mohamed Hassan user info from db.json', () => {
        const wrapper = mount(ProfileUserInfo, {
            props: {
                displayName: mockUsers.user1.name,
                username: mockUsers.user1.username,
            },
        })

        expect(wrapper.find('h1').text()).toBe('Mohamed Hassan')
        expect(wrapper.text()).toContain('@mhassan123')
    })

    it('displays username with @ symbol', () => {
        const wrapper = mount(ProfileUserInfo, {
            props: {
                displayName: mockUsers.user1.name,
                username: mockUsers.user1.username,
            },
        })

        const usernameElement = wrapper.find('p')
        expect(usernameElement.text()).toBe('@mhassan123')
        expect(usernameElement.classes()).toContain('text-muted')
    })
})
