import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProfileNotFound from '../../components/ProfileNotFound.vue'

describe('ProfileNotFound', () => {
    it('renders not found message', () => {
        const wrapper = mount(ProfileNotFound, {
            global: {
                mocks: {
                    $t: (key: string) => {
                        const translations: Record<string, string> = {
                            'profile.notFound.title': 'Profile not found',
                            'profile.notFound.description': "This account doesn't exist",
                            'profile.notFound.goHome': 'Go to home',
                        }
                        return translations[key] || key
                    },
                },
                stubs: {
                    NuxtLink: {
                        template: '<a :href="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        expect(wrapper.text()).toContain('Profile not found')
        expect(wrapper.text()).toContain("This account doesn't exist")
        expect(wrapper.text()).toContain('Go to home')
    })

    it('has link to home page', () => {
        const wrapper = mount(ProfileNotFound, {
            global: {
                mocks: {
                    $t: () => 'test',
                },
                stubs: {
                    NuxtLink: {
                        template: '<a :href="to"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        const link = wrapper.find('a')
        expect(link.exists()).toBe(true)
        expect(link.attributes('href')).toBe('/')
    })
})
