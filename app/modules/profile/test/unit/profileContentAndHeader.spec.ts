import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, computed } from 'vue'

import EmptyState from '../../components/ProfileContent/SubComponents/EmptyState.vue'
import ProfileBlockedContent from '../../components/ProfileContent/SubComponents/ProfileBlockedContent.vue'
import SnackBar from '../../components/ProfileContent/SubComponents/SnackBar.vue'
import ProfileContent from '../../components/ProfileContent/ProfileContent.vue'
import ProfileHeader from '../../components/ProfileHeader/ProfileHeader.vue'
import { useProfileStore } from '../../stores/profileStore'

let mockRoutePath = '/john'
const mockRouterPush = vi.fn()

vi.mock('vue-router', () => ({
    useRoute: () => ({
        params: { username: 'john' },
        query: {},
        path: mockRoutePath,
        name: '',
        fullPath: mockRoutePath,
        meta: {},
    }),
    useRouter: () => ({ push: mockRouterPush, back: vi.fn(), replace: vi.fn(), go: vi.fn() }),
}))

const isBlockedRef = ref(false)
vi.mock('~/modules/profile/composables/useUserInfo', () => ({
    useUserInfo: () => ({
        isBlocked: computed(() => isBlockedRef.value),
        username: computed(() => 'john'),
    }),
}))

vi.mock('~/modules/Common/components/Tabs/Tabs.vue', () => ({
    default: defineComponent({
        name: 'Tabs',
        props: {
            tabs: { type: Array, required: true },
            activeTab: { type: String, required: true },
            onChange: { type: Function, required: true },
        },
        template: '<div class="tabs-stub" @click="onChange(activeTab)">tabs</div>',
    }),
}))

vi.mock('~/modules/tweets/components/TweetsList/TweetsList.vue', () => ({
    default: defineComponent({
        name: 'TweetsList',
        props: ['fetchingSource', 'compact'],
        template:
            '<div class="tweets-list-stub" :data-source="fetchingSource" :data-compact="String(compact)"></div>',
    }),
}))

vi.mock('~/modules/Common/components/MediaGrid/MediaGrid.vue', () => ({
    default: defineComponent({
        name: 'MediaGrid',
        props: ['fetchingSource'],
        template: '<div class="media-grid-stub" :data-source="fetchingSource"></div>',
    }),
}))

vi.mock('~/modules/Common/components/Logo/Logo.vue', () => ({
    default: defineComponent({ name: 'Logo', template: '<div class="logo-stub" />' }),
}))

vi.mock('~/modules/profile/components/ProfileHeader/SubComponents/CoverImage.vue', () => ({
    default: defineComponent({ name: 'CoverImage', template: '<div class="cover-stub" />' }),
}))
vi.mock('~/modules/profile/components/ProfileHeader/SubComponents/ProfileAvatar.vue', () => ({
    default: defineComponent({ name: 'ProfileAvatar', template: '<div class="avatar-stub" />' }),
}))
vi.mock('~/modules/profile/components/ProfileHeader/SubComponents/ProfileEditButton.vue', () => ({
    default: defineComponent({
        name: 'ProfileEditButton',
        template: '<div class="edit-btn-stub" />',
    }),
}))
vi.mock(
    '~/modules/profile/components/ProfileHeader/SubComponents/ProfileMessageButton.vue',
    () => ({
        default: defineComponent({
            name: 'ProfileMessageButton',
            template: '<div class="message-btn-stub" />',
        }),
    }),
)
vi.mock('~/modules/profile/components/ProfileHeader/SubComponents/ProfileActions.vue', () => ({
    default: defineComponent({ name: 'ProfileActions', template: '<div class="actions-stub" />' }),
}))
vi.mock('~/modules/profile/components/ProfileHeader/SubComponents/ProfileFollowAction.vue', () => ({
    default: defineComponent({
        name: 'ProfileFollowAction',
        template: '<div class="follow-action-stub" />',
    }),
}))
vi.mock(
    '~/modules/profile/components/ProfileHeader/SubComponents/ProfileBlockedAction.vue',
    () => ({
        default: defineComponent({
            name: 'ProfileBlockedAction',
            template: '<div class="blocked-action-stub" />',
        }),
    }),
)
vi.mock('~/modules/profile/components/ProfileHeader/SubComponents/ProfileInfo.vue', () => ({
    default: defineComponent({ name: 'ProfileInfo', template: '<div class="info-stub" />' }),
}))

vi.mock('lucide-vue-next', () => ({
    Lock: defineComponent({ name: 'Lock', template: '<svg class="lock-stub" />' }),
}))

const setProfile = (isMine: boolean) => {
    const store = useProfileStore()
    store.setProfile(
        {
            user_id: '123',
            username: 'john',
            name: 'John',
        } as any,
        isMine,
    )
}

const globalMocks = {
    mocks: {
        $t: (key: string) => key,
    },
}

describe('EmptyState', () => {
    it('renders provided title and description', () => {
        const wrapper = mount(EmptyState, {
            props: { icon: 'icon', title: 'Title', description: 'Description' },
            global: globalMocks,
        })

        expect(wrapper.text()).toContain('Title')
        expect(wrapper.text()).toContain('Description')
    })
})

describe('ProfileBlockedContent', () => {
    it('shows blocked messages', () => {
        const wrapper = mount(ProfileBlockedContent, {
            props: { username: 'john' },
            global: globalMocks,
        })
        expect(wrapper.text()).toContain('profile.blocked.title')
        expect(wrapper.text()).toContain('profile.blocked.description')
    })
})

describe('SnackBar', () => {
    it('renders and handles action click', async () => {
        const showSnackbar = ref(true)
        const handleClick = vi.fn()
        const snackbar = ref({ username: 'user', message: ' message', action: 'Undo', handleClick })

        const wrapper = mount(SnackBar, {
            global: {
                ...globalMocks,
                provide: {
                    snackbar: { showSnackbar, snackbar },
                },
            },
        })

        expect(wrapper.text()).toContain('@user message')
        const button = wrapper.find('#snackbar-button')
        await button.trigger('click')
        expect(handleClick).toHaveBeenCalled()
        expect(showSnackbar.value).toBe(false)
    })
})

describe('ProfileContent', () => {
    beforeEach(() => {
        isBlockedRef.value = false
        mockRouterPush.mockReset()
    })

    it('renders posts timeline when on posts', () => {
        setProfile(false)
        mockRoutePath = '/john'
        const wrapper = mount(ProfileContent, { global: globalMocks })
        const tweets = wrapper.find('.tweets-list-stub')
        expect(tweets.attributes('data-source')).toBe('/users/123/posts')
        expect(tweets.attributes('data-compact')).toBe('false')
        expect(wrapper.find('.media-grid-stub').exists()).toBe(false)
    })

    it('shows likes info and fetches liked posts for own profile', () => {
        setProfile(true)
        mockRoutePath = '/john/likes'
        const wrapper = mount(ProfileContent, { global: globalMocks })
        const tweets = wrapper.find('.tweets-list-stub')
        expect(tweets.attributes('data-source')).toBe('/users/me/liked-posts')
        expect(tweets.attributes('data-compact')).toBe('true')
        expect(wrapper.text()).toContain('profile.privacy.likesPrivate')
    })

    it('renders media grid on media tab', () => {
        setProfile(false)
        mockRoutePath = '/john/media'
        const wrapper = mount(ProfileContent, { global: globalMocks })
        const media = wrapper.find('.media-grid-stub')
        expect(media.exists()).toBe(true)
        expect(media.attributes('data-source')).toBe('/users/123/media')
    })

    it('shows blocked content when user is blocked', () => {
        setProfile(false)
        isBlockedRef.value = true
        mockRoutePath = '/john'
        const wrapper = mount(ProfileContent, { global: globalMocks })
        expect(wrapper.findComponent(ProfileBlockedContent).exists()).toBe(true)
        expect(wrapper.find('.tabs-stub').exists()).toBe(false)
    })
})

describe('ProfileHeader', () => {
    it('shows edit controls for own profile', () => {
        setProfile(true)
        const wrapper = mount(ProfileHeader, { global: globalMocks })
        expect(wrapper.find('.edit-btn-stub').exists()).toBe(true)
        expect(wrapper.find('.follow-action-stub').exists()).toBe(false)
        expect(wrapper.find('.message-btn-stub').exists()).toBe(false)
    })

    it('shows follow controls for other profile', () => {
        setProfile(false)
        const wrapper = mount(ProfileHeader, { global: globalMocks })
        expect(wrapper.find('.follow-action-stub').exists()).toBe(true)
        expect(wrapper.find('.message-btn-stub').exists()).toBe(true)
        expect(wrapper.find('.blocked-action-stub').exists()).toBe(true)
    })
})
