import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import UserListSettings from '~/modules/settings/components/MuteAndBlock/SubComponents/UserListSettings.vue'

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

const DetailedPanelStub = {
    template: '<div><slot /></div>',
    props: ['title'],
}

const UserAccountItemStub = {
    template: '<div class="user-item"><slot /></div>',
    props: ['account'],
}

const SettingsBlockedButtonStub = {
    template: '<button class="blocked-btn" />',
}

const fetchNextPageMock = vi.fn()

const createQuery = (overrides = {}) => ({
    data: ref(null),
    isLoading: ref(false),
    isSuccess: ref(false),
    hasNextPage: ref(false),
    isFetchingNextPage: ref(false),
    fetchNextPage: fetchNextPageMock,
    ...overrides,
})

describe('MutedOrBlockedList.vue', () => {
    let wrapper: any
    let query: any

    const factory = (queryOverrides = {}) => {
        query = createQuery(queryOverrides)

        return mount(UserListSettings, {
            props: {
                title: 'Title',
                description: 'Description',
                emptyTitle: 'Empty title',
                emptyDescription: 'Empty description',
                query,
            },
            global: {
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
        observeMock.mockClear()
        disconnectMock.mockClear()
    })

    afterEach(() => {
        if (wrapper) wrapper.unmount()
    })

    it('renders loading spinner when loading', async () => {
        wrapper = factory({ isLoading: ref(true) })

        await nextTick()

        expect(wrapper.find('.animate-spin').exists()).toBe(true)
    })

    it('renders users when query is successful and has data', async () => {
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

    it('renders empty state when success but no users', async () => {
        wrapper = factory({
            isSuccess: ref(true),
            data: ref({
                pages: [{ data: { data: [] } }],
            }),
        })

        await nextTick()

        expect(wrapper.text()).toContain('Empty title')
        expect(wrapper.text()).toContain('Empty description')
    })

    it('computes users from multiple pages correctly', async () => {
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

    it('calls fetchNextPage when intersection happens and has next page', async () => {
        wrapper = factory({
            isSuccess: ref(true),
            hasNextPage: ref(true),
            data: ref({
                pages: [{ data: { data: [] } }],
            }),
        })

        await nextTick()

        observerCallback([{ isIntersecting: true }])

        expect(fetchNextPageMock).toHaveBeenCalled()
    })

    it('does not call fetchNextPage when already fetching', async () => {
        wrapper = factory({
            isSuccess: ref(true),
            hasNextPage: ref(true),
            isFetchingNextPage: ref(true),
            data: ref({
                pages: [{ data: { data: [] } }],
            }),
        })

        await nextTick()

        observerCallback([{ isIntersecting: true }])

        expect(fetchNextPageMock).not.toHaveBeenCalled()
    })

    it('disconnects observer on unmount', async () => {
        wrapper = factory()

        await nextTick()
        wrapper.unmount()

        expect(disconnectMock).toHaveBeenCalled()
    })
})
