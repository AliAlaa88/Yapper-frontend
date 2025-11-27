import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import SidebarCategories from '../../components/SidebarCategories.vue'

const mockRoute = reactive({ path: '/settings/account' })

vi.mock('nuxt/app', () => ({
    useRoute: () => mockRoute,
}))

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
    }),
}))

describe('SidebarCategories Component', () => {
    let wrapper: ReturnType<typeof mount>

    const createWrapper = () => {
        return mount(SidebarCategories, {
            global: {
                stubs: {
                    NuxtLink: {
                        props: ['to'],
                        template: '<a :href="to"><slot /></a>',
                    },
                    DetailedHeader: {
                        template: '<div data-testid="detailed-header" />',
                    },
                    ChevronRight: {
                        template: '<div data-testid="chevron-right" />',
                    },
                    Search: {
                        template: '<div data-testid="search-icon" />',
                    },
                },
            },
        })
    }

    beforeEach(() => {
        mockRoute.path = '/settings/account'
        wrapper = createWrapper()
    })

    it('renders header, search input, and category links', () => {
        expect(wrapper.find('input[type="text"]').exists()).toBe(true)
        expect(wrapper.find('input[type="text"]').attributes('placeholder')).toBe('Search Settings')

        const links = wrapper.findAll('a')
        expect(links.length).toBe(3)

        expect(links[0]?.text()).toContain('settings.yourAccount')
        expect(links[1]?.text()).toContain('settings.privacyAndSafety')
        expect(links[2]?.text()).toContain('settings.displayAndLanguages')
        expect(links[0]?.attributes('href')).toBe('/settings/account')
        expect(links[1]?.attributes('href')).toBe('/settings/privacy_and_safety')
        expect(links[2]?.attributes('href')).toBe('/settings/display_and_languages')
    })

    it('marks the correct category as selected based on route', async () => {
        let links = wrapper.findAll('a')
        expect(links[0]?.classes()).toContain('bg-hover')
        expect(links[1]?.classes()).not.toContain('bg-hover')
        expect(links[2]?.classes()).not.toContain('bg-hover')

        let indicators = wrapper.findAll('.bg-accent')
        expect(indicators.length).toBe(1)

        mockRoute.path = '/settings/display_and_languages'
        await wrapper.vm.$nextTick()

        links = wrapper.findAll('a')
        expect(links[0]?.classes()).not.toContain('bg-hover')
        expect(links[1]?.classes()).not.toContain('bg-hover')
        expect(links[2]?.classes()).toContain('bg-hover')


        indicators = wrapper.findAll('.bg-accent')
        expect(indicators.length).toBe(1)

        mockRoute.path = '/settings/privacy_and_safety'
        await wrapper.vm.$nextTick()

        links = wrapper.findAll('a')
        expect(links[0]?.classes()).not.toContain('bg-hover')
        expect(links[1]?.classes()).toContain('bg-hover')
        expect(links[2]?.classes()).not.toContain('bg-hover')
    })

    it('displays accent indicator only on selected category', () => {
        const indicators = wrapper.findAll('.bg-accent')
        expect(indicators.length).toBe(1)

        const firstLink = wrapper.findAll('a')[0]
        const indicator = firstLink?.find('.bg-accent')
        expect(indicator?.exists()).toBe(true)
        expect(indicator?.classes()).toContain('rounded-l')
    })

    it('applies hover styles correctly', () => {
        const links = wrapper.findAll('a')
        links.forEach(link => {
            expect(link.classes()).toContain('hover:bg-hover')
            expect(link.classes()).toContain('transition-colors')
        })
    })

    it('renders responsive header for mobile', () => {
        const mobileHeader = wrapper.find('.md\\:hidden')
        expect(mobileHeader.exists()).toBe(true)
        expect(mobileHeader.classes()).toContain('sticky')
        expect(mobileHeader.classes()).toContain('top-0')
        expect(mobileHeader.classes()).toContain('z-20')
    })
})
