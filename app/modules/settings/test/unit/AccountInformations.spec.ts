import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'

import AccountInformation from '~/modules/settings/components/YourAccount/AccountInformations.vue'

const mockUser = {
    id: '123',
    username: 'hagar',
    email: 'hagar@gmail.com',
    country: 'Egypt',
    birth_date: '1990-05-15',
    created_at: '2020-01-15T10:30:00Z',
}

const userRef = ref(mockUser)

vi.mock('../../utils/calculations', () => ({
    formatFullDateTime: (date: string) => date ? 'January 15, 2020 at 10:30 AM' : '',
    formatDate: (date: string) => date ? 'May 15, 1990' : '',
    calculateAge: (date: string) => date ? 34 : 0,
}))

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
    }),
}))

vi.mock('~/modules/auth/stores/userStore', () => {
    return {
        useUserStore: () => ({
            user: userRef,
        }),
    }
})

interface AccountInformationInstance {
    categories: {
        label: string
        content: string
        href: string
    }[]
}

describe('AccountInformation Component', () => {
    let wrapper: ReturnType<typeof mount>

    const createWrapper = () => mount(AccountInformation, {
        global: {
            stubs: {
                DetailedPanel: {
                    props: ['title'],
                    template: '<div data-testid="panel"><div data-testid="title">{{ title }}</div><slot /></div>',
                },
                DetailedRow: {
                    props: ['category'],
                    template: `<div class="row" :data-label="category.label" :data-content="category.content" :data-href="category.href"><slot /></div>`,
                },
                ChevronRight: true,
            },
            mocks: {
                $t: (key: string) => key,
            },
        },
    })

    beforeEach(() => {
        userRef.value = mockUser
        wrapper = createWrapper()
    })

    it('renders all user information with correct data and navigation', () => {
        expect(wrapper.find('[data-testid="title"]').text()).toBe('settings.accountInformation')

        const rows = wrapper.findAll('.row')
        expect(rows.length).toBe(6)

        const expectedRows = [
            { label: 'settings.accountInfo.username', content: 'hagar', href: '/settings/screen_name' },
            { label: 'settings.accountInfo.email', content: 'hagar@gmail.com', href: '/settings/email' },
            { label: 'settings.accountInfo.country', content: 'countries.Egypt', href: '/settings/country' },
            { label: 'settings.accountInfo.languages', content: 'English, Arabic', href: '/settings/languages' },
            { label: 'settings.accountInfo.birthDate', content: 'May 15, 1990', href: '/hagar/settings/profile' },
            { label: 'settings.accountInfo.age', content: '34', href: '/settings/your_yapper_data/age' },
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
    })

    it('computes categories with correct formatting and hrefs', () => {
        const component = wrapper.vm as unknown as AccountInformationInstance
        const categories = component.categories

        expect(categories).toHaveLength(7)
        expect(categories[0]?.content).toBe('hagar')
        expect(categories[1]?.content).toBe('hagar@gmail.com')
        expect(categories[2]?.content).toBe('countries.Egypt')
        expect(categories[3]?.content).toBe('English, Arabic')
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

        const paragraphs = accountSection.findAll('p.text-muted')
        expect(paragraphs.length).toBe(1)
        expect(paragraphs[0]?.text()).toBe('January 15, 2020 at 10:30 AM')

        expect(accountSection.findComponent({ name: 'ChevronRight' }).exists()).toBe(true)
    })

    it('uses fallback values when user data is null or undefined', async () => {
        userRef.value = null as any
        wrapper = createWrapper()

        const component = wrapper.vm as unknown as AccountInformationInstance
        const categories = component.categories

        expect(categories[0]?.content).toBeUndefined()
        expect(categories[1]?.content).toBeUndefined()
        expect(categories[4]?.content).toBe('')
        expect(categories[5]?.content).toBe('0')
        expect(categories[6]?.content).toBe('')

        const rows = wrapper.findAll('.row')
        rows.forEach((row) => {
            expect(row.attributes('data-label')).toBeDefined()
        })

        const accountSection = wrapper.find('.block.relative.px-5')
        expect(accountSection.exists()).toBe(true)
    })

    it('handles partial user data with missing fields', async () => {
        userRef.value = { username: 'partial_user' } as any
        wrapper = createWrapper()

        const component = wrapper.vm as unknown as AccountInformationInstance
        const categories = component.categories

        expect(categories[0]?.content).toBe('partial_user')
        expect(categories[1]?.content).toBeUndefined()
        expect(categories[4]?.href).toBe('/partial_user/settings/profile')
        expect(categories[4]?.content).toBe('')
        expect(categories[5]?.content).toBe('0')
    })
})
