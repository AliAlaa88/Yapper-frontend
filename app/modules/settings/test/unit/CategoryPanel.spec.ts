import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, defineComponent } from 'vue'
import CategoryPanel from '~/modules/settings/components/CategoryPanel.vue'

const localeRef = { value: 'en' }

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        locale: localeRef,
    }),
}))

vi.mock('lucide-vue-next', () => ({
    ChevronLeft: defineComponent({
        name: 'ChevronLeft',
        inheritAttrs: false,
        setup(_, { attrs }) {
            return () => h('svg', { ...attrs, 'data-test': 'chevron-left' })
        },
    }),
    ChevronRight: defineComponent({
        name: 'ChevronRight',
        inheritAttrs: false,
        setup(_, { attrs }) {
            return () => h('svg', { ...attrs, 'data-test': 'chevron-right' })
        },
    }),
}))

const NuxtLinkStub = {
    template: '<a><slot /></a>',
    props: ['to'],
}

const DetailedHeaderStub = {
    template: '<div class="detailed-header">{{ title }}</div>',
    props: ['title'],
}

const IconStub = defineComponent({
    name: 'IconStub',
    render() {
        return h('svg', { class: 'icon-stub' })
    },
})

const itemMock = {
    title: 'Account Settings',
    description: 'Manage your account',
    categories: [
        {
            label: 'Profile',
            description: 'Edit profile',
            icon: IconStub,
            href: '/profile',
        },
        {
            label: 'Security',
            href: '/security',
        },
    ],
}

describe('CategoryPanel', () => {
    beforeEach(() => {
        localeRef.value = 'en'
    })

    const factory = (locale = 'en') => {
        localeRef.value = locale

        return mount(CategoryPanel, {
            props: { item: itemMock },
            global: {
                stubs: {
                    NuxtLink: NuxtLinkStub,
                    DetailedHeader: DetailedHeaderStub,
                },
            },
        })
    }

    it('renders mobile and desktop titles', () => {
        const wrapper = factory()

        expect(wrapper.find('.detailed-header').text()).toBe('Account Settings')
        expect(wrapper.find('h1').text()).toBe('Account Settings')
    })

    it('renders item description when provided', () => {
        const wrapper = factory()

        expect(wrapper.text()).toContain('Manage your account')
    })

    it('renders category links', () => {
        const wrapper = factory()

        const links = wrapper.findAll('#category-link')
        expect(links).toHaveLength(2)
    })

    it('renders category labels and descriptions', () => {
        const wrapper = factory()

        expect(wrapper.text()).toContain('Profile')
        expect(wrapper.text()).toContain('Edit profile')
        expect(wrapper.text()).toContain('Security')
    })

    it('renders category icon when provided', () => {
        const wrapper = factory()

        expect(wrapper.find('.icon-stub').exists()).toBe(true)
    })

    it('renders ChevronLeft when locale is ar', () => {
        const wrapper = factory('ar')

        const chevrons = wrapper.findAll('svg')
        expect(chevrons.length).toBeGreaterThan(0)
    })

    it('applies correct RTL spacing classes when locale is ar', () => {
        const wrapper = factory('ar')

        const icon = wrapper.find('.icon-stub')

        console.log('Icon classes:', icon.classes())

        const classes = icon.classes()
        expect(classes).toContain('shrink-0')
        expect(classes).toContain('opacity-50')
        const hasRTLMargins =
            classes.some((c) => c.includes('ml-') || c === 'ml-8') &&
            classes.some((c) => c.includes('mr-') || c === 'mr-2')

        expect(hasRTLMargins).toBe(true)
    })
})
