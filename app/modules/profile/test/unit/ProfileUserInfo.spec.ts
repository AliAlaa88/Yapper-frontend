import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProfileUserInfo from '../../components/ProfileHeader/SubComponents/ProfileUserInfo.vue'

describe('ProfileUserInfo Component', () => {
    it('renders display name and username', () => {
        const wrapper = mount(ProfileUserInfo, {
            props: {
                displayName: 'John Doe',
                username: 'johndoe',
            },
        })

        expect(wrapper.find('h1').text()).toBe('John Doe')
        expect(wrapper.text()).toContain('@johndoe')
    })

    it('renders with different user data', () => {
        const wrapper = mount(ProfileUserInfo, {
            props: {
                displayName: 'Jane Smith',
                username: 'janesmith',
            },
        })

        expect(wrapper.find('h1').text()).toBe('Jane Smith')
        expect(wrapper.text()).toContain('@janesmith')
    })
})
