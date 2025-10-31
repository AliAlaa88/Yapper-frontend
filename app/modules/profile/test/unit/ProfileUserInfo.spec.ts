import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProfileUserInfo from '../../components/ProfileHeader/SubComponents/ProfileUserInfo.vue'

const mockUsers = {
    user1: {
        name: 'Mohamed Hassan',
        username: 'mhassan123',
    },
    user2: {
        name: 'Nour Ahmed',
        username: 'nourahmed90',
    },
    user3: {
        name: 'Sara Ibrahim',
        username: 'saraib',
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

    it('renders Nour Ahmed user info from db.json', () => {
        const wrapper = mount(ProfileUserInfo, {
            props: {
                displayName: mockUsers.user2.name,
                username: mockUsers.user2.username,
            },
        })

        expect(wrapper.find('h1').text()).toBe('Nour Ahmed')
        expect(wrapper.text()).toContain('@nourahmed90')
    })

    it('renders Sara Ibrahim user info from db.json', () => {
        const wrapper = mount(ProfileUserInfo, {
            props: {
                displayName: mockUsers.user3.name,
                username: mockUsers.user3.username,
            },
        })

        expect(wrapper.find('h1').text()).toBe('Sara Ibrahim')
        expect(wrapper.text()).toContain('@saraib')
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
        expect(usernameElement.classes()).toContain('text-[#71767b]')
    })
})
