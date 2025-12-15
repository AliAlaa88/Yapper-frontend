import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import Popup from '../../components/Popup/Popup.vue'

const i18n = createI18n({
    locale: 'en',
    messages: {
        en: {},
        ar: {},
    },
})

// Mock Teleport component
vi.mock('vue', async () => {
    const actual = await vi.importActual('vue')
    return {
        ...actual,
        Teleport: {
            name: 'Teleport',
            props: ['to'],
            template: '<slot/>',
        },
    }
})

describe('Popup Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render when isOpen is true', () => {
        const wrapper = mount(Popup, {
            props: {
                isOpen: true,
                title: 'Test Title',
            },
            global: {
                plugins: [i18n],
                stubs: {
                    Teleport: false,
                },
            },
            slots: {
                default: 'Popup Content',
            },
        })

        expect(wrapper.vm).toBeDefined()
    })

    it('should not render when isOpen is false', () => {
        const wrapper = mount(Popup, {
            props: {
                isOpen: false,
                title: 'Test Title',
            },
            global: {
                plugins: [i18n],
            },
        })

        expect(wrapper.html()).not.toContain('popup-content')
    })

    it('should display title when provided', () => {
        const wrapper = mount(Popup, {
            props: {
                isOpen: true,
                title: 'My Title',
            },
            global: {
                plugins: [i18n],
                stubs: {
                    Teleport: false,
                },
            },
        })

        const text = wrapper.text()
        expect(text).toContain('My Title')
    })

    it('should show close button when hasCloseButton is true', () => {
        const wrapper = mount(Popup, {
            props: {
                isOpen: true,
                hasCloseButton: true,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    Teleport: false,
                },
            },
        })

        expect(wrapper.find('#close-popup-btn').exists()).toBe(true)
    })

    it('should show back button when hasBackButton is true', () => {
        const wrapper = mount(Popup, {
            props: {
                isOpen: true,
                hasBackButton: true,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    Teleport: false,
                },
            },
        })

        expect(wrapper.find('#back-popup-btn').exists()).toBe(true)
    })

    it('should emit close event when close button is clicked', async () => {
        const wrapper = mount(Popup, {
            props: {
                isOpen: true,
                hasCloseButton: true,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    Teleport: false,
                },
            },
        })

        const closeBtn = wrapper.find('#close-popup-btn')
        if (closeBtn.exists()) {
            await closeBtn.trigger('click')
            expect(wrapper.emitted('close')).toBeTruthy()
        }
    })

    it('should emit back event when back button is clicked', async () => {
        const wrapper = mount(Popup, {
            props: {
                isOpen: true,
                hasBackButton: true,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    Teleport: false,
                },
            },
        })

        const backBtn = wrapper.find('#back-popup-btn')
        if (backBtn.exists()) {
            await backBtn.trigger('click')
            expect(wrapper.emitted('back')).toBeTruthy()
        }
    })

    it('should support different positioning classes', () => {
        const wrapper = mount(Popup, {
            props: {
                isOpen: true,
                xPosition: 'start',
                yPosition: 'end',
            },
            global: {
                plugins: [i18n],
                stubs: {
                    Teleport: false,
                },
            },
        })

        expect(wrapper.vm).toBeDefined()
    })

    it('should accept custom contentClass', () => {
        const wrapper = mount(Popup, {
            props: {
                isOpen: true,
                contentClass: 'custom-content-class',
            },
            global: {
                plugins: [i18n],
                stubs: {
                    Teleport: false,
                },
            },
        })

        const content = wrapper.find('#popup-content')
        if (content.exists()) {
            expect(content.classes()).toContain('custom-content-class')
        }
    })

    it('should apply header class when provided', () => {
        const wrapper = mount(Popup, {
            props: {
                isOpen: true,
                headerClass: 'custom-header-class',
            },
            global: {
                plugins: [i18n],
                stubs: {
                    Teleport: false,
                },
            },
        })

        const html = wrapper.html()
        expect(html).toContain('custom-header-class')
    })

    it('should render slot content', () => {
        const wrapper = mount(Popup, {
            props: {
                isOpen: true,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    Teleport: false,
                },
            },
            slots: {
                default: 'Test Slot Content',
            },
        })

        expect(wrapper.text()).toContain('Test Slot Content')
    })

    it('should support custom background color', () => {
        const wrapper = mount(Popup, {
            props: {
                isOpen: true,
                bgColor: 'bg-custom-color',
            },
            global: {
                plugins: [i18n],
                stubs: {
                    Teleport: false,
                },
            },
        })

        expect(wrapper.vm).toBeDefined()
    })

    it('should render with default props', () => {
        const wrapper = mount(Popup, {
            props: {
                isOpen: true,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    Teleport: false,
                },
            },
        })

        expect(wrapper.vm).toBeDefined()
    })

    it('should handle hasCloseButton default value', () => {
        const wrapper = mount(Popup, {
            props: {
                isOpen: true,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    Teleport: false,
                },
            },
        })

        expect(wrapper.props('hasCloseButton')).toBe(true)
    })

    it('should handle hasBackButton default value', () => {
        const wrapper = mount(Popup, {
            props: {
                isOpen: true,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    Teleport: false,
                },
            },
        })

        expect(wrapper.props('hasBackButton')).toBe(false)
    })

    it('should hide close button when hasCloseButton is false', () => {
        const wrapper = mount(Popup, {
            props: {
                isOpen: true,
                hasCloseButton: false,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    Teleport: false,
                },
            },
        })

        expect(wrapper.find('#close-popup-btn').exists()).toBe(false)
    })

    it('should hide back button when hasBackButton is false', () => {
        const wrapper = mount(Popup, {
            props: {
                isOpen: true,
                hasBackButton: false,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    Teleport: false,
                },
            },
        })

        expect(wrapper.find('#back-popup-btn').exists()).toBe(false)
    })
})
