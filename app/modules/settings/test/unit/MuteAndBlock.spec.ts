import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import MuteAndBlock from '~/modules/settings/components/MuteAndBlock/MuteAndBlock.vue'

const DetailedPanelStub = { 
    template: '<div class="detailed-panel"><slot /></div>', 
    props: ['title'] 
}

const DetailedRowStub = {
    template: '<div class="detailed-row" :data-label="category?.label" :data-href="category?.href">{{ category?.label }} - {{ category?.href }}</div>',
    props: ['category'],
}

describe('MuteAndBlock.vue', () => {
    let wrapper: ReturnType<typeof mount>

    const factory = (tMock?: any) => {
        return mount(MuteAndBlock, {
            global: {
                mocks: {
                    t: tMock || ((key: string) => key),
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

    it('renders DetailedPanel with correct title and description text', () => {
        wrapper = factory()
        
        expect(wrapper.find('.detailed-panel').exists()).toBe(true)
        expect(wrapper.html()).toContain('settings.muteAndBlock')
        expect(wrapper.html()).toContain('settings.muteAndBlock_desc')
        expect(wrapper.find('p.text-muted').text()).toBe('settings.muteAndBlock_desc')
    })

    it('renders two DetailedRow components with correct category props', () => {
        wrapper = factory()
        
        const rows = wrapper.findAllComponents(DetailedRowStub)
        expect(rows).toHaveLength(2)

        expect(rows[0]!.props('category')).toEqual({
            label: 'settings.blockedAccounts',
            href: '/settings/blocked/all',
        })
        expect(rows[1]!.props('category')).toEqual({
            label: 'settings.mutedAccounts',
            href: '/settings/muted/all',
        })

        expect(rows[0]!.text()).toContain('settings.blockedAccounts')
        expect(rows[0]!.text()).toContain('/settings/blocked/all')
        expect(rows[1]!.text()).toContain('settings.mutedAccounts')
        expect(rows[1]!.text()).toContain('/settings/muted/all')
    })

    it('uses i18n translation function and verifies all text content', () => {
        wrapper = factory()
        
        const html = wrapper.html()
        expect(html).toContain('settings.muteAndBlock')
        expect(html).toContain('settings.muteAndBlock_desc')
        expect(html).toContain('settings.blockedAccounts')
        expect(html).toContain('settings.mutedAccounts')
    })

    it('provides valid category objects with required properties', () => {
        wrapper = factory()
        
        const rows = wrapper.findAllComponents(DetailedRowStub)
        expect(rows).toHaveLength(2)
        
        rows.forEach((row) => {
            const category = row.props('category')
            expect(category).toBeDefined()
            expect(category).toHaveProperty('label')
            expect(category).toHaveProperty('href')
            expect(typeof category.label).toBe('string')
            expect(typeof category.href).toBe('string')
            expect(category.label.length).toBeGreaterThan(0)
            expect(category.href.startsWith('/settings/')).toBe(true)
        })
    })

    it('renders with correct structure and CSS classes', () => {
        wrapper = factory()
        
        expect(wrapper.find('.detailed-panel').exists()).toBe(true)
        expect(wrapper.find('div.relative.w-full.px-5.py-2').exists()).toBe(true)
        expect(wrapper.find('p.text-muted.text-\\[13px\\]').exists()).toBe(true)
        expect(wrapper.findAll('.detailed-row')).toHaveLength(2)
    })
})
