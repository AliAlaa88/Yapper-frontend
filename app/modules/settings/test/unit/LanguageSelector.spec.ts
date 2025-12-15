import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

import LanguageSelector from '~/modules/settings/components/AccountInformations/SubComponents/LanguageSelector.vue'
import { LOCALE_COOKIE_KEY } from '~/modules/Common/constants/localStorageConstants'

const mutateMock = vi.fn()
const handleCloseMock = vi.fn()

vi.mock('~/modules/settings/queries/userSettingsQueries', () => ({
    userSettingsQueries: () => ({
        useChangeLanguage: {
            mutate: mutateMock,
            isPending: ref(false),
        },
    }),
}))

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
        locale: ref('en'),
    }),
}))

describe('LanguageSelector', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        document.cookie = ''
    })

    const factory = (props = {}) =>
        mount(LanguageSelector, {
            props: {
                isOpen: true,
                handleClose: handleCloseMock,
                ...props,
            },
            global: {
                mocks: {
                    $t: (key: string) => key,
                },
                stubs: {
                    Popup: {
                        props: ['isOpen'],
                        template: '<div><slot /></div>',
                    },
                    Button: {
                        template: '<button @click="$emit(\'click\')"><slot /></button>',
                    },
                    Circle: true,
                    CheckCircle2: true,
                },
            },
        })

    it('renders title and description', () => {
        const wrapper = factory()

        expect(wrapper.text()).toContain('settings.languages.selectAppLanguage')
        expect(wrapper.text()).toContain('settings.languages.selectAppLanguage_desc')
    })

    it('selects English when English button is clicked', async () => {
        const wrapper = factory()

        await wrapper.find('#english-button').trigger('click')

        expect(wrapper.find('#english-button').text()).toContain('English')
    })

    it('selects Arabic when Arabic button is clicked', async () => {
        const wrapper = factory()

        await wrapper.find('#arabic-button').trigger('click')

        expect(wrapper.find('#arabic-button').text()).toContain('Arabic')
    })

    it('calls handleClose and mutate on confirm', async () => {
        const wrapper = factory()

        await wrapper.find('#arabic-button').trigger('click')
        await wrapper.find('#next-language-button').trigger('click')

        expect(handleCloseMock).toHaveBeenCalled()
        expect(mutateMock).toHaveBeenCalledWith({ language: 'ar' })
    })

    it('sets locale cookie and reloads page', async () => {
        const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {})

        const wrapper = factory()
        await wrapper.find('#next-language-button').trigger('click')

        expect(document.cookie).toContain(LOCALE_COOKIE_KEY)
        expect(reloadSpy).toHaveBeenCalled()

        reloadSpy.mockRestore()
    })
})
