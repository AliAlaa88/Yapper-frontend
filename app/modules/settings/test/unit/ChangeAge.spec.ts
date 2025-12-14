import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ChangeAge from '~/modules/settings/components/AccountInformations/ChangeAge.vue'

const mockUserWithBirth = {
    username: 'hagar',
    birth_date: '1990-05-15',
}

const mockUserWithoutBirth = {
    username: 'hagar',
    birth_date: '',
}

const userRef = ref(mockUserWithBirth)

vi.mock('~/modules/auth/stores/userStore', () => {
    return {
        useUserStore: () => ({
            user: userRef,
        }),
    }
})

vi.mock('../../utils/calculations', () => ({
    calculateAge: (date: string) => (date ? 34 : 0),
}))

const NuxtLinkStub = {
    name: 'NuxtLink',
    props: ['to'],
    template: '<a :href="to"><slot /></a>',
}

const DetailedPanelStub = {
    name: 'DetailedPanel',
    props: ['title'],
    template: '<div><slot /></div>',
}

describe('ChangeAge', () => {
    let wrapper: ReturnType<typeof mount>

    const factory = (userData = mockUserWithBirth) => {
        userRef.value = userData
        return mount(ChangeAge, {
            global: {
                mocks: {
                    $t: (key: string) => key,
                },
                stubs: {
                    NuxtLink: NuxtLinkStub,
                    DetailedPanel: DetailedPanelStub,
                },
            },
        })
    }

    beforeEach(() => {
        userRef.value = mockUserWithBirth
    })

    it('renders age and description when birth_date exists', () => {
        wrapper = factory(mockUserWithBirth)

        expect(wrapper.text()).toContain('34')
        expect(wrapper.text()).toContain('settings.accountInfo.age_desc_long')
        expect(wrapper.text()).toContain('settings.accountInfo.age_notRight')
        expect(wrapper.text()).toContain('settings.accountInfo.age_notRight2')

        const link = wrapper.findComponent(NuxtLinkStub)
        expect(link.exists()).toBe(true)
        expect(link.attributes('href')).toBe('/hagar/settings/profile')
    })

    it('renders fallback text when birth_date is missing', () => {
        wrapper = factory(mockUserWithoutBirth)

        expect(wrapper.text()).toContain('Age not provided')

        const link = wrapper.findComponent(NuxtLinkStub)
        expect(link.exists()).toBe(true)
        expect(link.attributes('href')).toBe('/hagar/settings/profile')
    })
})
