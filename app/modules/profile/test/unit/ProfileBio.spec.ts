import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProfileBio from '../../components/ProfileHeader/SubComponents/ProfileBio.vue'

const mockBios = {
    mohamedHassan: 'Software developer from Cairo',
    nourAhmed: 'Egyptian content creator',
    saraIbrahim: 'Alexandria based photographer',
    omarYoussef: 'Web developer from Alexandria',
    lailaMostafa: 'UX designer based in Cairo',
}

describe('ProfileBio Component', () => {
    it('renders Mohamed Hassan bio from db.json', () => {
        const wrapper = mount(ProfileBio, {
            props: {
                bio: mockBios.mohamedHassan,
            },
        })

        expect(wrapper.text()).toBe('Software developer from Cairo')
        expect(wrapper.find('p').exists()).toBe(true)
    })

    it('renders Nour Ahmed bio from db.json', () => {
        const wrapper = mount(ProfileBio, {
            props: {
                bio: mockBios.nourAhmed,
            },
        })

        expect(wrapper.text()).toBe('Egyptian content creator')
    })

    it('renders Sara Ibrahim bio from db.json', () => {
        const wrapper = mount(ProfileBio, {
            props: {
                bio: mockBios.saraIbrahim,
            },
        })

        expect(wrapper.text()).toBe('Alexandria based photographer')
    })

    it('renders Omar Youssef bio from db.json', () => {
        const wrapper = mount(ProfileBio, {
            props: {
                bio: mockBios.omarYoussef,
            },
        })

        expect(wrapper.text()).toBe('Web developer from Alexandria')
    })

    it('renders Laila Mostafa bio from db.json', () => {
        const wrapper = mount(ProfileBio, {
            props: {
                bio: mockBios.lailaMostafa,
            },
        })

        expect(wrapper.text()).toBe('UX designer based in Cairo')
    })

    it('does not render when bio is empty', () => {
        const wrapper = mount(ProfileBio, {
            props: {
                bio: undefined,
            },
        })

        expect(wrapper.find('p').exists()).toBe(false)
    })
})
