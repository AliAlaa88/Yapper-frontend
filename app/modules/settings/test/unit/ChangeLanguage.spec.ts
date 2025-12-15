import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ChangeLanguage from '~/modules/settings/components/AccountInformations/ChangeLanguage.vue'

const DetailedPanelStub = { name: 'DetailedPanel', template: '<div><slot /></div>' }
const LanguageSelectorStub = {
    name: 'LanguageSelector',
    props: ['isOpen', 'handleClose'],
    template: '<div />',
}
const ChevronRightStub = { name: 'ChevronRight', template: '<div />' }
const ChevronLeftStub = { name: 'ChevronLeft', template: '<div />' }

vi.mock('vue-i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key: string) => key }),
}))

describe('ChangeLanguage', () => {
    const wrapper = mount(ChangeLanguage, {
        global: {
            mocks: {
                $t: (key: string) => key,
            },
            stubs: {
                DetailedPanel: DetailedPanelStub,
                LanguageSelector: LanguageSelectorStub,
                ChevronRight: ChevronRightStub,
                ChevronLeft: ChevronLeftStub,
            },
        },
    })

    it('renders description text', () => {
        expect(wrapper.text()).toContain('settings.languages.manage_desc')
    })

    it('renders language button with correct text', () => {
        const button = wrapper.find('#language-button')
        expect(button.exists()).toBe(true)
        expect(button.text()).toContain('settings.languages.appsAndLanguage')
        expect(button.text()).toContain('English and Arabic')
    })

    it('opens LanguageSelector on button click', async () => {
        const button = wrapper.find('#language-button')
        expect(wrapper.findComponent(LanguageSelectorStub).props('isOpen')).toBe(false)
        await button.trigger('click')
        expect(wrapper.findComponent(LanguageSelectorStub).props('isOpen')).toBe(true)
    })

    it('handleClose sets isOpen to false', async () => {
        const comp = wrapper.vm as any
        comp.isOpen = true
        comp.handleClose()
        expect(comp.isOpen).toBe(false)
    })
})
