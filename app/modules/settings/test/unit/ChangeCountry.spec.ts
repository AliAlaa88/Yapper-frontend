import { ref } from 'vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ChangeCountry from '~/modules/settings/components/AccountInformations/ChangeCountry.vue'

const DetailedPanelStub = {
    name: 'DetailedPanel',
    props: ['title'],
    template: '<div><slot /></div>',
}
const ConfirmChangeCountryStub = {
    name: 'ConfirmChangeCountry',
    props: ['isOpen', 'newCountry'],
    template: '<div><button id="confirm">Confirm</button><button id="cancel">Cancel</button></div>',
}
const ChevronDownStub = { name: 'ChevronDown', template: '<div />' }

vi.mock('vue-i18n', () => ({
    useI18n: () => ({ t: (key: string) => key, locale: 'en' }),
}))

const updateUserMock = vi.fn()
vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => ({
        user: ref({ id: '123', username: 'hagar', country: 'Egypt' }),
        updateUser: updateUserMock,
    }),
}))

// Mock API mutation
const mutateAsyncMock = vi.fn(() => Promise.resolve())
vi.mock('~/modules/profile/queries/useEditProfileQuery', () => ({
    useEditProfileMutation: () => ({
        editProfileMutation: { mutateAsync: mutateAsyncMock },
    }),
}))

describe('ChangeCountry', () => {
    let wrapper: ReturnType<typeof mount>

    beforeEach(() => {
        wrapper = mount(ChangeCountry, {
            global: {
                stubs: {
                    DetailedPanel: DetailedPanelStub,
                    ConfirmChangeCountry: ConfirmChangeCountryStub,
                    ChevronDown: ChevronDownStub,
                },
            },
        })
        vi.clearAllMocks()
    })

    it('renders the panel and select dropdown', () => {
        const panel = wrapper.findComponent({ name: 'DetailedPanel' })
        expect(panel.exists()).toBe(true)
        expect(panel.props('title')).toBe('settings.accountInfo.change_country')

        const select = wrapper.find('#countries-options')
        expect(select.exists()).toBe(true)
        expect(select.element.value).toBe('Egypt')
    })

    it('opens modal when a new country is selected', async () => {
        const select = wrapper.find('#countries-options')
        await select.setValue('United_States')
        expect(wrapper.vm.showModal).toBe(true)
        expect(wrapper.vm.selectedCountry).toBe('United_States')
    })

    it('does not open modal if selected country is the same', async () => {
        const select = wrapper.find('#countries-options')
        await select.setValue('Egypt')
        expect(wrapper.vm.showModal).toBe(false)
        expect(wrapper.vm.selectedCountry).toBe('')
    })

    it('confirms country change and updates user', async () => {
        wrapper.vm.selectedCountry = 'United_States'
        wrapper.vm.showModal = true
        await wrapper.vm.updateCountry()
        await flushPromises()

        expect(mutateAsyncMock).toHaveBeenCalledWith({ country: 'United_States' })
        expect(updateUserMock).toHaveBeenCalledWith({ country: 'United_States' })
        expect(wrapper.vm.showModal).toBe(false)
    })

    it('cancels country change and resets values', async () => {
        wrapper.vm.country = 'United_States'
        wrapper.vm.selectedCountry = 'United_States'
        wrapper.vm.showModal = true
        await wrapper.vm.cancelChange()
        expect(wrapper.vm.country).toBe('Egypt')
        expect(wrapper.vm.selectedCountry).toBe('')
        expect(wrapper.vm.showModal).toBe(false)
    })

    it('renders ConfirmChangeCountry modal only when showModal is true', async () => {
        expect(wrapper.findComponent(ConfirmChangeCountryStub).exists()).toBe(false)
        wrapper.vm.showModal = true
        await wrapper.vm.$nextTick()
        expect(wrapper.findComponent(ConfirmChangeCountryStub).exists()).toBe(true)
    })
})
