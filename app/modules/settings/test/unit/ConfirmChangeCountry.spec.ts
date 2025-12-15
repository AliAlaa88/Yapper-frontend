import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import ConfirmChangeCountry from '~/modules/settings/components/AccountInformations/SubComponents/ConfirmChangeCountry.vue'

describe('ConfirmChangeCountry', () => {
    const factory = (props = {}) =>
        mount(ConfirmChangeCountry, {
            props: {
                isOpen: true,
                newCountry: 'Egypt',
                ...props,
            },
            global: {
                mocks: {
                    $t: (key: string) => key,
                },
                stubs: {
                    Popup: {
                        name: 'Popup',
                        template: '<div><slot /></div>',
                    },
                    Logo: true,
                    Button: true,
                },
            },
        })

    it('renders title and description text', () => {
        const wrapper = factory()

        expect(wrapper.text()).toContain('settings.changeCountry.title')
        expect(wrapper.text()).toContain('settings.changeCountry.description')
    })

    it('passes isOpen prop to Popup component', () => {
        const wrapper = factory({ isOpen: false })

        const popup = wrapper.find('[data-test="popup"]')
        expect(popup.attributes('is-open')).toBe('false')
    })

    it('emits confirm event when confirm button is clicked', async () => {
        const wrapper = factory()
        await wrapper.find('#confirm-change-country-button').trigger('click')

        expect(wrapper.emitted('confirm')).toBeTruthy()
        expect(wrapper.emitted('confirm')!.length).toBe(1)
    })

    it('emits cancel event when cancel button is clicked', async () => {
        const wrapper = factory()
        await wrapper.find('#cancel-change-country-button').trigger('click')

        expect(wrapper.emitted('cancel')).toBeTruthy()
        expect(wrapper.emitted('cancel')!.length).toBe(1)
    })
})
