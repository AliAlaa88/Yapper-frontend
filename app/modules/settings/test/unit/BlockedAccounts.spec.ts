import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import BlockedAccounts from '~/modules/settings/components/MuteAndBlock/SubComponents/BlockedAccounts.vue'

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
const SettingsBlockedButtonStub = { template: '<button />' }

const fetchNextPageMock = vi.fn()
const myBlockedUsersQuery = {
    data: ref(null),
    isLoading: ref(false),
    isSuccess: ref(false),
    hasNextPage: ref(false),
    isFetchingNextPage: ref(false),
    fetchNextPage: fetchNextPageMock,
}

vi.mock('~/modules/settings/queries/userSettingsQueries', () => ({
    userSettingsQueries: () => ({ myBlockedUsersQuery }),
}))

describe('BlockedAccounts.vue', () => {
    let wrapper: ReturnType<typeof mount>

    const factory = (queryOverrides = {}) => {
        Object.assign(myBlockedUsersQuery, queryOverrides)
        return mount(BlockedAccounts, {
            global: {
                mocks: {
                    $t: (key: string) => key,
                },
                stubs: {
                    DetailedPanel: DetailedPanelStub,
                    UserAccountItem: UserAccountItemStub,
                    SettingsBlockedButton: SettingsBlockedButtonStub,
                },
            },
        })
    }

    beforeEach(() => {
        fetchNextPageMock.mockClear()
        invalidateQueriesMock.mockClear()
        observeMock.mockClear()
        disconnectMock.mockClear()
        myBlockedUsersQuery.data.value = null
        myBlockedUsersQuery.isLoading.value = false
        myBlockedUsersQuery.isSuccess.value = false
        myBlockedUsersQuery.hasNextPage.value = false
        myBlockedUsersQuery.isFetchingNextPage.value = false
    })

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount()
        }
    })

    it('renders loading spinner when query is loading', async () => {
        wrapper = factory({ isLoading: ref(true) })
        await nextTick()
        expect(wrapper.find('div.animate-spin').exists()).toBe(true)
    })

    it('renders blocked users when query has data', async () => {
        wrapper = factory({
            isSuccess: ref(true),
            data: ref({ pages: [{ data: { data: [{ user_id: 1 }, { user_id: 2 }] } }] }),
        })
        await nextTick()
        const users = wrapper.findAll('.user-item')
        expect(users).toHaveLength(2)
    })

    it('renders empty state if no blocked users', async () => {
        wrapper = factory({
            isSuccess: ref(true),
            data: ref({ pages: [{ data: { data: [] } }] }),
        })
        await nextTick()
        expect(wrapper.text()).toContain('settings.blockedAccounts')
        expect(wrapper.text()).toContain('settings.block_accounts_description')
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
                    { data: { data: [{ user_id: 1 }, { user_id: 2 }] } },
                    { data: { data: [{ user_id: 3 }] } },
                ],
            }),
        })
        await nextTick()
        expect(wrapper.vm.users).toHaveLength(3)
    })

})
