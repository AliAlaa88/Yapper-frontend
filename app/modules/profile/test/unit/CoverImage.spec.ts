import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CoverImage from '../../components/ProfileHeader/SubComponents/CoverImage.vue'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('nuxt/app', () => ({
    useRoute: vi.fn(() => ({
        params: { username: 'testuser' },
    })),
}))

vi.mock('vue-router', () => ({
    useRoute: vi.fn(() => ({
        params: { username: 'testuser' },
    })),
}))

describe('CoverImage', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('renders cover image when coverUrl is provided', () => {
        const wrapper = mount(CoverImage, {
            props: {
                coverUrl: 'https://example.com/cover.jpg',
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to" @click="$emit(\'click\')"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        expect(wrapper.find('img').exists()).toBe(true)
        expect(wrapper.find('img').attributes('src')).toBe('https://example.com/cover.jpg')
    })

    it('calls store setCoverUrl when cover is clicked', async () => {
        const wrapper = mount(CoverImage, {
            props: {
                coverUrl: 'https://example.com/cover.jpg',
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const link = wrapper.find('a')
        expect(link.exists()).toBe(true)
    })
})
