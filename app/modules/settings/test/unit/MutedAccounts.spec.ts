import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import MutedAccounts from '~/modules/settings/components/MuteAndBlock/SubComponents/MutedAccounts.vue'

const invalidateQueriesMock = vi.fn()
const mockQueryClient = {
    invalidateQueries: invalidateQueriesMock,
}

vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $queryClient: mockQueryClient,
    }),
}))

let observerCallback: Function
const observeMock = vi.fn()
const disconnectMock = vi.fn()

vi.stubGlobal(
    'IntersectionObserver',
    class {
        constructor(cb: Function) {
            observerCallback = cb
        }
        observe = observeMock
        disconnect = disconnectMock
    },
)

const DetailedPanelStub = { template: '<div><slot /></div>' }
const UserAccountItemStub = {
    template: '<div class="user-item"><slot /></div>',
    props: ['account'],
}
const SettingsMutedButtonStub = { template: '<button />' }

const fetchNextPageMock = vi.fn()

const myMutedUsersQuery = {
    data: ref(null),
    isLoading: ref(false),
    isSuccess: ref(false),
    hasNextPage: ref(false),
    isFetchingNextPage: ref(false),
    fetchNextPage: fetchNextPageMock,
}

vi.mock('~/modules/settings/queries/userSettingsQueries', () => ({
    userSettingsQueries: () => ({ myMutedUsersQuery }),
}))

describe('MutedAccounts.vue', () => {
    let wrapper: ReturnType<typeof mount>

    const factory = (queryOverrides = {}) => {
        Object.assign(myMutedUsersQuery, queryOverrides)

        return mount(MutedAccounts, {
            global: {
                mocks: {
                    $t: (key: string) => key,
                },
                stubs: {
                    DetailedPanel: DetailedPanelStub,
                    UserAccountItem: UserAccountItemStub,
                    SettingsMutedButton: SettingsMutedButtonStub,
                },
            },
        })
    }

    beforeEach(() => {
        fetchNextPageMock.mockClear()
        invalidateQueriesMock.mockClear()
        observeMock.mockClear()
        disconnectMock.mockClear()

        myMutedUsersQuery.data.value = null
        myMutedUsersQuery.isLoading.value = false
        myMutedUsersQuery.isSuccess.value = false
        myMutedUsersQuery.hasNextPage.value = false
        myMutedUsersQuery.isFetchingNextPage.value = false
    })

    afterEach(() => {
        wrapper?.unmount()
    })

    it('renders loading spinner when query is loading', async () => {
        wrapper = factory({ isLoading: ref(true) })
        await nextTick()

        expect(wrapper.find('.animate-spin').exists()).toBe(true)
    })

    it('renders muted users when query succeeds', async () => {
        wrapper = factory({
            isSuccess: ref(true),
            data: ref({
                pages: [{ data: { data: [{ user_id: 1 }, { user_id: 2 }] } }],
            }),
        })

        await nextTick()

        const users = wrapper.findAll('.user-item')
        expect(users).toHaveLength(2)
    })

    it('renders empty state when no muted users', async () => {
        wrapper = factory({
            isSuccess: ref(true),
            data: ref({ pages: [{ data: { data: [] } }] }),
        })

        await nextTick()

        expect(wrapper.text()).toContain('settings.mutedAccounts')
        expect(wrapper.text()).toContain('settings.muted_accounts_description')
    })

    it('calls fetchNextPage when loadMore intersects and hasNextPage is true', async () => {
        wrapper = factory({
            isSuccess: ref(true),
            data: ref({ pages: [{ data: { data: [] } }] }),
            hasNextPage: ref(true),
        })

        await nextTick()

        observerCallback([{ isIntersecting: true }])

        expect(fetchNextPageMock).toHaveBeenCalled()
    })

    it('does not call fetchNextPage if already fetching next page', async () => {
        wrapper = factory({
            isSuccess: ref(true),
            data: ref({ pages: [{ data: { data: [] } }] }),
            hasNextPage: ref(true),
            isFetchingNextPage: ref(true),
        })

        await nextTick()

        observerCallback([{ isIntersecting: true }])

        expect(fetchNextPageMock).not.toHaveBeenCalled()
    })

    it('computes users from all pages correctly', async () => {
        wrapper = factory({
            isSuccess: ref(true),
            data: ref({
                pages: [
                    { data: { data: [{ user_id: 1 }] } },
                    { data: { data: [{ user_id: 2 }, { user_id: 3 }] } },
                ],
            }),
        })

        await nextTick()

        expect(wrapper.vm.users).toHaveLength(3)
    })
})
