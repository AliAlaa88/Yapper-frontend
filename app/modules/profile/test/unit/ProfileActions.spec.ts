import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ProfileActions from '../../components/ProfileHeader/SubComponents/ProfileActions.vue'

vi.mock('~/modules/profile/components/ProfileHeader/SubComponents/ProfileActionsMenu.vue', () => ({
    default: {
        name: 'ProfileActionsMenu',
        props: ['isTweet'],
        template: '<div class="mock-menu">Mock Menu</div>',
    },
}))

describe('ProfileActions', () => {
    it('renders actions button', () => {
        const wrapper = mount(ProfileActions, {
            props: {
                isTweet: false,
            },
        })

        const button = wrapper.find('#menu-button')
        expect(button.exists()).toBe(true)
        expect(button.text()).toBe('⋯')
    })

    it('toggles menu visibility on button click', async () => {
        const wrapper = mount(ProfileActions, {
            props: {
                isTweet: false,
            },
        })

        // Initially menu should not be visible
        expect(wrapper.find('.mock-menu').exists()).toBe(false)

        // Click button to show menu
        await wrapper.find('#menu-button').trigger('click')
        expect(wrapper.find('.mock-menu').exists()).toBe(true)

        // Click again to hide menu
        await wrapper.find('#menu-button').trigger('click')
        expect(wrapper.find('.mock-menu').exists()).toBe(false)
    })

    it('displays backdrop when menu is open', async () => {
        const wrapper = mount(ProfileActions, {
            props: {
                isTweet: false,
            },
        })

        await wrapper.find('#menu-button').trigger('click')

        const backdrop = wrapper.find('.fixed.inset-0.bg-gray-700\\/50')
        expect(backdrop.exists()).toBe(true)
    })

    it('passes isTweet prop to ProfileActionsMenu', async () => {
        const wrapper = mount(ProfileActions, {
            props: {
                isTweet: true,
            },
        })

        await wrapper.find('#menu-button').trigger('click')

        const menu = wrapper.findComponent({ name: 'ProfileActionsMenu' })
        expect(menu.props('isTweet')).toBe(true)
    })

    it('provides showList to child components', async () => {
        const wrapper = mount(ProfileActions, {
            props: {
                isTweet: false,
            },
        })

        const provided = wrapper.vm.$.provides
        expect(provided).toHaveProperty('show-list')
    })
})
