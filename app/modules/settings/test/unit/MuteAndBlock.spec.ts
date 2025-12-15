import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MuteAndBlock from '~/modules/settings/components/MuteAndBlock/MuteAndBlock.vue'

const DetailedPanelStub = { 
    template: '<div class="detailed-panel"><slot /></div>', 
    props: ['title'] 
}

const DetailedRowStub = {
    template: '<div class="detailed-row">{{ category.label }} - {{ category.href }}</div>',
    props: ['category'],
}

describe('MuteAndBlock.vue', () => {
    let wrapper: ReturnType<typeof mount>
    let mockT: any

    const factory = (tMock?: any) => {
        mockT = tMock || ((key: string) => key)
        return mount(MuteAndBlock, {
            global: {
                mocks: {
                    t: mockT,
                },
                stubs: {
                    DetailedPanel: DetailedPanelStub,
                    DetailedRow: DetailedRowStub,
                },
            },
        })
    }

    beforeEach(() => {
        if (wrapper) {
            wrapper.unmount()
        }
    })

    it('renders DetailedPanel with correct title and description', () => {
        wrapper = factory()
        
        expect(wrapper.find('.detailed-panel').exists()).toBe(true)
        expect(wrapper.html()).toContain('settings.muteAndBlock')
        expect(wrapper.html()).toContain('settings.muteAndBlock_desc')
        expect(wrapper.find('p.text-muted').text()).toBe('settings.muteAndBlock_desc')
    })

    it('renders two DetailedRow components with correct categories', () => {
        wrapper = factory()
        
        const rows = wrapper.findAllComponents(DetailedRowStub)
        expect(rows).toHaveLength(2)
        expect(rows[0].props('category')).toEqual({
            label: 'settings.blockedAccounts',
            href: '/settings/blocked/all',
        })
        expect(rows[1].props('category')).toEqual({
            label: 'settings.mutedAccounts',
            href: '/settings/muted/all',
        })
    })

    it('categories computed property returns correct structure with labels and hrefs', () => {
        wrapper = factory()
        
        const rows = wrapper.findAllComponents(DetailedRowStub)
        
        expect(rows[0].text()).toContain('settings.blockedAccounts')
        expect(rows[0].text()).toContain('/settings/blocked/all')
        expect(rows[1].text()).toContain('settings.mutedAccounts')
        expect(rows[1].text()).toContain('/settings/muted/all')
    })

    it('uses i18n translation function for all text content', () => {
        wrapper = factory()
        
        const html = wrapper.html()
        
        expect(html).toContain('settings.muteAndBlock')
        expect(html).toContain('settings.muteAndBlock_desc')
        expect(html).toContain('settings.blockedAccounts')
        expect(html).toContain('settings.mutedAccounts')
    })

    it('provides fallback empty objects for categories when accessed by index', () => {
        wrapper = factory()
        
        const rows = wrapper.findAllComponents(DetailedRowStub)
        expect(rows).toHaveLength(2)
        
        rows.forEach((row) => {
            const category = row.props('category')
            expect(category).toBeDefined()
            expect(category).toHaveProperty('label')
            expect(category).toHaveProperty('href')
        })
    })
})
