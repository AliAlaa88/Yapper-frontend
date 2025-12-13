import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref, computed } from 'vue'

import FollowersList from '../../components/FollowLists/SubComponents/FollowersList.vue'
import FollowingList from '../../components/FollowLists/SubComponents/FollowingList.vue'
import MutualFollowersList from '../../components/FollowLists/SubComponents/MutualFollowersList.vue'
import FollowLists from '../../components/FollowLists/FollowLists.vue'
import { useProfileStore } from '../../stores/profileStore'

let mockRoutePath = '/jane/followers'
const mockRouterPush = vi.fn()
const mockRouterBack = vi.fn()

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $queryClient: {},
        runWithContext: (fn: any) => fn(),
    }),
}))

vi.mock('~/modules/profile/queries/useUserActionsQuery', () => ({
    useUserActionsQuery: vi.fn(() => ({
        userQuery: { data: { value: null } },
    })),
}))

vi.mock('~/modules/profile/composables/useUserActions', () => ({
    useUserActions: () => ({
        followMutation: { isPending: ref(false) },
        unfollowMutation: { isPending: ref(false) },
        muteMutation: { isPending: ref(false) },
        unmuteMutation: { isPending: ref(false) },
        blockMutation: { isPending: ref(false) },
        unblockMutation: { isPending: ref(false) },
        removeFollowerMutation: { isPending: ref(false) },
        isFollowLoading: computed(() => false),
        isMuteLoading: computed(() => false),
        isBlockLoading: computed(() => false),
        isRemoveFollowerLoading: computed(() => false),
        toggleFollow: vi.fn(),
        toggleMute: vi.fn(),
        toggleBlock: vi.fn(),
        removeFollower: vi.fn(),
    }),
}))

vi.mock('~/modules/Common/composables/useGenericInfiniteQuery', () => {
    return {
        useGenericInfiniteQuery: () => ({
            items: ref([{ user_id: '1', username: 'alice', name: 'Alice' }]),
            isFetching: ref(false),
            isPending: ref(false),
            isFetchingNextPage: ref(false),
            error: ref(null),
            refetch: vi.fn(),
            loadMoreTrigger: ref(false),
        }),
    }
})

vi.mock('vue-i18n', () => ({
    useI18n: () => ({ t: (key: string) => key }),
}))

vi.mock('vue-router', () => ({
    useRoute: () => ({
        params: { username: 'jane' },
        query: {},
        path: mockRoutePath,
        name: '',
        fullPath: mockRoutePath,
        meta: {},
    }),
    useRouter: () => ({ push: mockRouterPush, back: mockRouterBack }),
}))

vi.mock('~/modules/Common/components/Tabs/Tabs.vue', () => {
    return {
        default: defineComponent({
            name: 'Tabs',
            props: {
                tabs: { type: Array, required: true },
                activeTab: { type: String, required: true },
                onChange: { type: Function, required: true },
            },
            template: '<div class="tabs-stub" @click="onChange(tabs[0]?.value)">{{ tabs.map(t => t.value).join(",") }}</div>',
        }),
    }
})

vi.mock('~/modules/profile/components/ProfileContent/SubComponents/SnackBar.vue', () => ({
    default: defineComponent({ name: 'SnackBar', template: '<div class="snackbar-stub" />' }),
}))

vi.mock('~/modules/profile/components/ProfileHeader/SubComponents/ConfirmtionModal.vue', () => ({
    default: defineComponent({ name: 'ConfirmtionModal', template: '<div class="confirm-modal-stub" />' }),
}))

vi.mock('~/modules/profile/composables/useProfile', () => ({ useProfile: vi.fn() }))
vi.mock('~/modules/profile/composables/useProfileProviders', () => ({ useProfileProviders: vi.fn() }))

vi.mock('~/modules/Common/components/UserList', () => {
    return {
        UserList: defineComponent({
            name: 'UserList',
            props: {
                fetchingSource: { type: String, required: true },
                queryKeyPrefix: { type: String, required: true },
                loadingText: { type: String, required: false },
                errorText: { type: String, required: false },
                retryText: { type: String, required: false },
                emptyTitle: { type: String, required: false },
                emptyDescription: { type: String, required: false },
            },
            setup(props, { slots }) {
                return () =>
                    h(
                        'div',
                        {
                            class: 'user-list-stub',
                            'data-fetching-source': props.fetchingSource,
                            'data-query-key': props.queryKeyPrefix,
                        },
                        [slots.default?.({ users: [{ user_id: '1', username: 'alice', name: 'Alice' }] }), slots.empty?.()]
                    )
            },
        }),
    }
})

vi.mock('../../../../Common/components/UserCard/UserCard.vue', () => {
    return {
        default: defineComponent({
            name: 'FollowListUserCard',
            props: ['user', 'showTooltip', 'hideBio'],
            template: '<div class="user-card-stub">{{ user?.username }}</div>',
        }),
    }
})

vi.mock('~/modules/profile/components/ProfileContent/SubComponents/EmptyState.vue', () => ({
    default: defineComponent({
        name: 'EmptyState',
        props: ['icon', 'title', 'description'],
        template: '<div class="empty-state-stub">{{ title }}</div>',
    }),
}))

vi.mock('lucide-vue-next', () => ({ ArrowLeft: defineComponent({ name: 'ArrowLeft', template: '<svg />' }) }))

const globalMount = {
    global: {
        mocks: {
            $t: (key: string) => key,
        },
        provide: {
            snackbar: {
                showSnackbar: ref(false),
                snackbar: ref({ username: '', message: '', action: '', handleClick: null }),
            },
            confirmation: {
                showConfirmation: ref(false),
                handleShowConfirmation: vi.fn(),
            },
        },
    },
}

const setProfileStore = (isMine = true) => {
    const store = useProfileStore()
    store.setProfile(
        {
            user_id: '123',
            username: 'jane',
            name: 'Jane Doe',
        } as any,
        isMine
    )
}

describe('FollowersList', () => {
    beforeEach(() => setProfileStore(true))

    it('passes correct props to UserList and renders user cards', () => {
        const wrapper = mount(FollowersList, globalMount)

        const list = wrapper.find('.user-list-stub')
        expect(list.attributes('data-fetching-source')).toBe('/users/123/followers?following=false')
        expect(list.attributes('data-query-key')).toBe('followers')

        const card = wrapper.find('.user-card-stub')
    })
})

describe('FollowingList', () => {
    beforeEach(() => setProfileStore(false))

    it('uses following endpoint', () => {
        const wrapper = mount(FollowingList, globalMount)
        const list = wrapper.find('.user-list-stub')
        expect(list.attributes('data-fetching-source')).toBe('/users/123/following')
        expect(list.attributes('data-query-key')).toBe('following')
    })
})

describe('MutualFollowersList', () => {
    beforeEach(() => setProfileStore(false))

    it('uses mutual followers endpoint', () => {
        const wrapper = mount(MutualFollowersList, globalMount)
        const list = wrapper.find('.user-list-stub')
        expect(list.attributes('data-fetching-source')).toBe('/users/123/followers?following=true')
        expect(list.attributes('data-query-key')).toBe('mutual-followers')
    })
})

describe('FollowLists page', () => {
    beforeEach(() => {
        mockRouterPush.mockReset()
        mockRouterBack.mockReset()
    })

    it('shows mutual tab for other profiles', () => {
        setProfileStore(false)
        mockRoutePath = '/jane/followers'
        const wrapper = mount(FollowLists, globalMount)
        const tabs = wrapper.findComponent({ name: 'Tabs' }).props('tabs') as any[]
        expect(tabs.map((t) => t.value)).toContain('followers_you_follow')
    })

    it('omits mutual tab for own profile', () => {
        setProfileStore(true)
        mockRoutePath = '/jane/followers'
        const wrapper = mount(FollowLists, globalMount)
        const tabs = wrapper.findComponent({ name: 'Tabs' }).props('tabs') as any[]
        expect(tabs.map((t) => t.value)).not.toContain('followers_you_follow')
    })

    it('navigates on tab change', async () => {
        setProfileStore(false)
        mockRoutePath = '/jane/followers'
        const wrapper = mount(FollowLists, globalMount)
        const tabs = wrapper.findComponent({ name: 'Tabs' })
        ;(tabs.props('onChange') as (val: string) => void)('following')
        expect(mockRouterPush).toHaveBeenCalledWith('/jane/following')
    })

    it('renders the correct list based on route', () => {
        setProfileStore(false)
        mockRoutePath = '/jane/following'
        const wrapper = mount(FollowLists, globalMount)
        expect(wrapper.findComponent(FollowingList).exists()).toBe(true)
        expect(wrapper.findComponent(FollowersList).exists()).toBe(false)
    })
})
