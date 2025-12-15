import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ChangeEmail from '~/modules/settings/components/AccountInformations/ChangeEmail.vue'

const DetailedPanelStub = { name: 'DetailedPanel', template: '<div><slot /></div>' }
const NuxtLinkStub = {
    name: 'NuxtLink',
    props: ['to'],
    template: '<a :href="to"><slot /></a>',
}

vi.mock('vue-i18n', () => ({
    useI18n: () => ({ t: (key: string) => key }),
}))

const mockUser = ref({ email: 'hagar@gmail.com' })
vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => ({
        user: mockUser,
    }),
}))

describe('ChangeEmail.vue', () => {
    const wrapper = mount(ChangeEmail, {
        global: {
            stubs: { DetailedPanel: DetailedPanelStub, NuxtLink: NuxtLinkStub },
        },
    })

    it('renders current email input', () => {
        const input = wrapper.find('#current-email-input')
        expect(input.exists()).toBe(true)
        expect(input.element.value).toBe('hagar@gmail.com')
        expect(input.attributes('readonly')).toBeDefined()
    })

    it('renders label with correct text', () => {
        expect(wrapper.text()).toContain('settings.accountInfo.current')
    })

    it('renders update email link correctly', () => {
        const link = wrapper.findComponent(NuxtLinkStub)
        expect(link.exists()).toBe(true)
        expect(link.attributes('href')).toBe('/settings/add_email') 
        expect(link.text()).toBe('settings.accountInfo.update_email_address')
    })
})
