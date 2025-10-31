import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from '../../components/Counter.vue'

describe('Counter Component', () => {
    it('renders with default props', () => {
        const wrapper = mount(Counter)
        expect(wrapper.find('h1').text()).toBe('Hello, World!')
    })

    it('renders with custom name', () => {
        const wrapper = mount(Counter, {
            props: { name: 'Vue' },
        })
        expect(wrapper.find('h1').text()).toBe('Hello, Vue!')
    })

    it('updates message on button click', async () => {
        const wrapper = mount(Counter)
        await wrapper.find('button').trigger('click')
        expect(wrapper.find('h1').text()).toBe('Clicked! Hello, World!')
    })

    it('updates message with custom name on button click', async () => {
        const wrapper = mount(Counter, {
            props: { name: 'Vitest' },
        })
        await wrapper.find('button').trigger('click')
        expect(wrapper.find('h1').text()).toBe('Clicked! Hello, Vitest!')
    })
})
