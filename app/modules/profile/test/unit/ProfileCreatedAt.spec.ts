import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProfileCreatedAt from '../../components/ProfileHeader/SubComponents/ProfileCreatedAt.vue'

const mockCreatedDates = {
    mohamedHassan: '2025-09-15',
    nourAhmed: '2025-08-20',
    saraIbrahim: '2025-07-25',
    omarYoussef: '2025-04-20',
    lailaMostafa: '2025-03-25',
}

describe('ProfileCreatedAt Component', () => {
    it('renders Mohamed Hassan created date from db.json', () => {
        const wrapper = mount(ProfileCreatedAt, {
            props: {
                createdAt: mockCreatedDates.mohamedHassan,
            },
        })

        expect(wrapper.text()).toBe('2025-09-15')
        expect(wrapper.find('p').exists()).toBe(true)
    })

    it('renders Nour Ahmed created date from db.json', () => {
        const wrapper = mount(ProfileCreatedAt, {
            props: {
                createdAt: mockCreatedDates.nourAhmed,
            },
        })

        expect(wrapper.text()).toBe('2025-08-20')
    })

    it('renders Sara Ibrahim created date from db.json', () => {
        const wrapper = mount(ProfileCreatedAt, {
            props: {
                createdAt: mockCreatedDates.saraIbrahim,
            },
        })

        expect(wrapper.text()).toBe('2025-07-25')
    })

    it('renders Omar Youssef created date from db.json', () => {
        const wrapper = mount(ProfileCreatedAt, {
            props: {
                createdAt: mockCreatedDates.omarYoussef,
            },
        })

        expect(wrapper.text()).toBe('2025-04-20')
    })

    it('renders Laila Mostafa created date from db.json', () => {
        const wrapper = mount(ProfileCreatedAt, {
            props: {
                createdAt: mockCreatedDates.lailaMostafa,
            },
        })

        expect(wrapper.text()).toBe('2025-03-25')
    })

    it('does not render when createdAt is undefined', () => {
        const wrapper = mount(ProfileCreatedAt, {
            props: {
                createdAt: undefined,
            },
        })

        expect(wrapper.find('p').exists()).toBe(false)
    })
})
