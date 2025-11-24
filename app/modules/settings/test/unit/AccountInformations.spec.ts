import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AccountInformation from '../../components/AccountInformations.vue'

const mockUser = {
    id: '123',
    username: 'hagar',
    email: 'hagar@gmail.com',
    country: 'Egypt',
    birth_date: '1990-05-15',
    created_at: '2020-01-15T10:30:00Z',
}

vi.mock('~/utils/helpers', () => ({
    getUser: () => mockUser,
}))

vi.mock('../../utils/calculations', () => ({
    formatFullDateTime: (_date: string) => 'January 15, 2020 at 10:30 AM',
    formatDate: (_date: string) => 'May 15, 1990',
    calculateAge: (_date: string) => 34,
}))

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
    }),
}))

interface AccountInformationInstance {
    categories: {
        label: string
        content: string
        href: string
    }[]
}


describe('AccountInformation Component', () => {
    let wrapper: ReturnType<typeof mount>

    beforeEach(() => {
        wrapper = mount(AccountInformation, {
            global: {
                stubs: {
                    DetailedPanel: {
                        props: ['title'],
                        template:
                            '<div data-testid="panel"><div data-testid="title">{{ title }}</div><slot /></div>',
                    },
                    DetailedRow: {
                        props: ['category'],
                        template: `
                            <div class="row" :data-label="category.label" :data-content="category.content" :data-href="category.href">
                                <slot />
                            </div>
                        `,
                    },
                    ChevronRight: true,
                },
                mocks: {
                    $t: (key: string) => key,
                },
            },
        })
    })

    it('renders all user information with correct data and navigation', () => {
        expect(wrapper.find('[data-testid="title"]').text()).toBe('settings.accountInformation')

        const rows = wrapper.findAll('.row')
        expect(rows.length).toBe(6)
        const expectedRows = [
            { label: 'settings.accountInfo.username', content: 'hagar', href: '' },
            { label: 'settings.accountInfo.email', content: 'hagar@gmail.com', href: '' },
            { label: 'settings.accountInfo.country', content: 'Egypt', href: '' },
            {
                label: 'settings.accountInfo.languages',
                content: 'English, Arabic',
                href: '/settings/languages',
            },
            {
                label: 'settings.accountInfo.birthDate',
                content: 'May 15, 1990',
                href: '/hagar/settings/profile',
            },
            {
                label: 'settings.accountInfo.age',
                content: '34',
                href: '/settings/your_yapper_data/age',
            },
        ]

        expectedRows.forEach((expected, index) => {
            expect(rows[index]?.attributes('data-label')).toBe(expected.label)
            expect(rows[index]?.attributes('data-content')).toBe(expected.content)
            expect(rows[index]?.attributes('data-href')).toBe(expected.href)
        })

        const accountSection = wrapper.find('.block.relative.px-5')
        expect(accountSection.exists()).toBe(true)
        expect(accountSection.text()).toContain('settings.accountInfo.accountCreation')
        expect(accountSection.text()).toContain('January 15, 2020 at 10:30 AM')
        expect(accountSection.text()).toContain('Egypt')
        expect(rows[4]?.text()).toContain('settings.accountInfo.birthDate_desc')
    })

    it('computes categories with correct formatting and hrefs', () => {
        const component = wrapper.vm as unknown as AccountInformationInstance
        const categories = component.categories

        expect(categories).toHaveLength(7)
        expect(categories[4]?.content).toBe('May 15, 1990')
        expect(categories[5]?.content).toBe('34')
        expect(categories[6]?.content).toBe('January 15, 2020 at 10:30 AM')
        expect(categories[3]?.href).toBe('/settings/languages')
        expect(categories[4]?.href).toBe('/hagar/settings/profile')
        expect(categories[5]?.href).toBe('/settings/your_yapper_data/age')
        expect(categories[6]?.href).toBe('/settings/your_twitter_data/account_creation')
    })

    it('handles conditional rendering and styling correctly', () => {
        const accountSection = wrapper.find('.block.relative.px-5')
        expect(accountSection.classes()).toContain('border-t')
        expect(accountSection.classes()).toContain('border-b')
        expect(accountSection.classes()).toContain('border-primary')

        const countryParagraphs = accountSection.findAll('p.text-muted')
        expect(countryParagraphs.length).toBe(2)
        expect(countryParagraphs[1]?.text()).toBe('Egypt')
        expect(accountSection.findComponent({ name: 'ChevronRight' }).exists()).toBe(true)
    })
})
