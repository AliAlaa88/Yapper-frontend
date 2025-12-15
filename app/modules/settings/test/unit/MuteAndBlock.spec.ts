import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MuteAndBlock from '~/modules/settings/components/MuteAndBlock/MuteAndBlock.vue'

const DetailedPanelStub = { template: '<div><slot /></div>', props: ['title'] }
const DetailedRowStub = {
    template: '<div class="detailed-row">{{ category.label }}</div>',
    props: ['category'],
}

describe('MuteAndBlock.vue', () => {
    let wrapper: ReturnType<typeof mount>

    const factory = () =>
        mount(MuteAndBlock, {
            global: {
                mocks: {
                    t: (key: string) => key,
                },
                stubs: {
                    DetailedPanel: DetailedPanelStub,
                    DetailedRow: DetailedRowStub,
                },
            },
        })

    it('renders DetailedPanel with description', () => {
        wrapper = factory()
        expect(wrapper.html()).toContain('settings.muteAndBlock')
        expect(wrapper.html()).toContain('settings.muteAndBlock_desc')
    })

    it('renders two DetailedRow components with correct categories', () => {
        wrapper = factory()
        const rows = wrapper.findAllComponents(DetailedRowStub)
        expect(rows).toHaveLength(2)
        expect(rows[0].text()).toBe('settings.blockedAccounts')
        expect(rows[1].text()).toBe('settings.mutedAccounts')
    })
})
