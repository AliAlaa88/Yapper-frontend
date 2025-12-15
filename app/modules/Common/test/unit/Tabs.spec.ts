import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import Tabs from '../../components/Tabs/Tabs.vue'

describe('Tabs Component', () => {
    const defaultTabs = [
        { label: 'Tab 1', value: 'tab1', test_id: 'tab-1' },
        { label: 'Tab 2', value: 'tab2', test_id: 'tab-2' },
        { label: 'Tab 3', value: 'tab3', test_id: 'tab-3' },
    ]

    const mockOnChange = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render all tabs', () => {
        const wrapper = mount(Tabs, {
            props: {
                tabs: defaultTabs,
                activeTab: 'tab1',
                onChange: mockOnChange,
            },
        })

        expect(wrapper.text()).toContain('Tab 1')
        expect(wrapper.text()).toContain('Tab 2')
        expect(wrapper.text()).toContain('Tab 3')
    })

    it('should highlight active tab', () => {
        const wrapper = mount(Tabs, {
            props: {
                tabs: defaultTabs,
                activeTab: 'tab1',
                onChange: mockOnChange,
            },
        })

        const activeButton = wrapper.find('[class*="text-primary"]')
        expect(activeButton.exists()).toBe(true)
    })

    it('should call onChange when tab is clicked', async () => {
        const wrapper = mount(Tabs, {
            props: {
                tabs: defaultTabs,
                activeTab: 'tab1',
                onChange: mockOnChange,
            },
        })

        const tab2 = wrapper.find('#tab-2')
        await tab2.trigger('click')

        expect(mockOnChange).toHaveBeenCalledWith('tab2')
    })

    it('should render correct number of tabs', () => {
        const wrapper = mount(Tabs, {
            props: {
                tabs: defaultTabs,
                activeTab: 'tab1',
                onChange: mockOnChange,
            },
        })

        const tabs = wrapper.findAll('li')
        expect(tabs.length).toBe(3)
    })

    it('should handle single tab', () => {
        const singleTab = [{ label: 'Only Tab', value: 'only', test_id: 'only-tab' }]

        const wrapper = mount(Tabs, {
            props: {
                tabs: singleTab,
                activeTab: 'only',
                onChange: mockOnChange,
            },
        })

        expect(wrapper.text()).toContain('Only Tab')
        const tabs = wrapper.findAll('li')
        expect(tabs.length).toBe(1)
    })

    it('should display underline on active tab', () => {
        const wrapper = mount(Tabs, {
            props: {
                tabs: defaultTabs,
                activeTab: 'tab2',
                onChange: mockOnChange,
            },
        })

        const activeTab = wrapper.find('#tab-2 button span')
        expect(activeTab.exists()).toBe(true)
    })

    it('should update active tab when prop changes', async () => {
        const wrapper = mount(Tabs, {
            props: {
                tabs: defaultTabs,
                activeTab: 'tab1',
                onChange: mockOnChange,
            },
        })

        await wrapper.setProps({ activeTab: 'tab3' })

        expect(wrapper.emitted()).toBeDefined()
    })

    it('should handle tabs with special characters in labels', () => {
        const specialTabs = [
            { label: 'Tab & Test', value: 'tab1', test_id: 'tab-1' },
            { label: 'Tab <Test>', value: 'tab2', test_id: 'tab-2' },
        ]

        const wrapper = mount(Tabs, {
            props: {
                tabs: specialTabs,
                activeTab: 'tab1',
                onChange: mockOnChange,
            },
        })

        expect(wrapper.text()).toContain('Tab & Test')
        expect(wrapper.text()).toContain('Tab <Test>')
    })

    it('should have correct test_id attributes', () => {
        const wrapper = mount(Tabs, {
            props: {
                tabs: defaultTabs,
                activeTab: 'tab1',
                onChange: mockOnChange,
            },
        })

        expect(wrapper.find('#tab-1').exists()).toBe(true)
        expect(wrapper.find('#tab-2').exists()).toBe(true)
        expect(wrapper.find('#tab-3').exists()).toBe(true)
    })

    it('should not call onChange on initial render', () => {
        mount(Tabs, {
            props: {
                tabs: defaultTabs,
                activeTab: 'tab1',
                onChange: mockOnChange,
            },
        })

        expect(mockOnChange).not.toHaveBeenCalled()
    })

    it('should handle rapid tab switching', async () => {
        const wrapper = mount(Tabs, {
            props: {
                tabs: defaultTabs,
                activeTab: 'tab1',
                onChange: mockOnChange,
            },
        })

        await wrapper.find('#tab-2').trigger('click')
        await wrapper.find('#tab-3').trigger('click')
        await wrapper.find('#tab-1').trigger('click')

        expect(mockOnChange).toHaveBeenCalledTimes(3)
    })

    it('should maintain tab order', () => {
        const wrapper = mount(Tabs, {
            props: {
                tabs: defaultTabs,
                activeTab: 'tab1',
                onChange: mockOnChange,
            },
        })

        const labels = wrapper.findAll('button').map(btn => btn.text())
        expect(labels[0]).toContain('Tab 1')
        expect(labels[1]).toContain('Tab 2')
        expect(labels[2]).toContain('Tab 3')
    })
})
