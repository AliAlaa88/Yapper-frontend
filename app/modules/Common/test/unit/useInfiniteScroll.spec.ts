import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useInfiniteScroll } from '../../composables/useInfiniteScroll'

// Mock IntersectionObserver
const mockObserve = vi.fn()
const mockDisconnect = vi.fn()
const mockIntersectionObserver = vi.fn().mockImplementation((callback) => {
    return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        callback,
    }
})

vi.stubGlobal('IntersectionObserver', mockIntersectionObserver)

// Mock Vue lifecycle hooks
vi.mock('vue', async () => {
    const actual = await vi.importActual('vue')
    return {
        ...actual,
        onUnmounted: vi.fn((cb) => cb),
    }
})

describe('useInfiniteScroll', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('returns loadMoreTrigger ref', () => {
        const hasNextPage = ref(true)
        const isFetchingNextPage = ref(false)
        const fetchNextPage = vi.fn()

        const { loadMoreTrigger } = useInfiniteScroll({
            hasNextPage,
            isFetchingNextPage,
            fetchNextPage,
        })

        expect(loadMoreTrigger).toBeDefined()
        expect(loadMoreTrigger.value).toBeNull()
    })

    it('creates IntersectionObserver when loadMoreTrigger element is set', async () => {
        const hasNextPage = ref(true)
        const isFetchingNextPage = ref(false)
        const fetchNextPage = vi.fn()

        const { loadMoreTrigger } = useInfiniteScroll({
            hasNextPage,
            isFetchingNextPage,
            fetchNextPage,
        })

        // Set a mock element
        const mockElement = document.createElement('div')
        loadMoreTrigger.value = mockElement
        await nextTick()

        expect(mockIntersectionObserver).toHaveBeenCalled()
        expect(mockObserve).toHaveBeenCalledWith(mockElement)
    })

    it('calls fetchNextPage when element is intersecting and conditions are met', async () => {
        const hasNextPage = ref(true)
        const isFetchingNextPage = ref(false)
        const fetchNextPage = vi.fn()

        const { loadMoreTrigger } = useInfiniteScroll({
            hasNextPage,
            isFetchingNextPage,
            fetchNextPage,
        })

        const mockElement = document.createElement('div')
        loadMoreTrigger.value = mockElement
        await nextTick()

        // Simulate intersection
        const observerCallback = mockIntersectionObserver.mock.calls[0][0]
        observerCallback([{ isIntersecting: true }])

        expect(fetchNextPage).toHaveBeenCalled()
    })

    it('does not call fetchNextPage when hasNextPage is false', async () => {
        const hasNextPage = ref(false)
        const isFetchingNextPage = ref(false)
        const fetchNextPage = vi.fn()

        const { loadMoreTrigger } = useInfiniteScroll({
            hasNextPage,
            isFetchingNextPage,
            fetchNextPage,
        })

        const mockElement = document.createElement('div')
        loadMoreTrigger.value = mockElement
        await nextTick()

        const observerCallback = mockIntersectionObserver.mock.calls[0][0]
        observerCallback([{ isIntersecting: true }])

        expect(fetchNextPage).not.toHaveBeenCalled()
    })

    it('does not call fetchNextPage when isFetchingNextPage is true', async () => {
        const hasNextPage = ref(true)
        const isFetchingNextPage = ref(true)
        const fetchNextPage = vi.fn()

        const { loadMoreTrigger } = useInfiniteScroll({
            hasNextPage,
            isFetchingNextPage,
            fetchNextPage,
        })

        const mockElement = document.createElement('div')
        loadMoreTrigger.value = mockElement
        await nextTick()

        const observerCallback = mockIntersectionObserver.mock.calls[0][0]
        observerCallback([{ isIntersecting: true }])

        expect(fetchNextPage).not.toHaveBeenCalled()
    })

    it('does not call fetchNextPage when element is not intersecting', async () => {
        const hasNextPage = ref(true)
        const isFetchingNextPage = ref(false)
        const fetchNextPage = vi.fn()

        const { loadMoreTrigger } = useInfiniteScroll({
            hasNextPage,
            isFetchingNextPage,
            fetchNextPage,
        })

        const mockElement = document.createElement('div')
        loadMoreTrigger.value = mockElement
        await nextTick()

        const observerCallback = mockIntersectionObserver.mock.calls[0][0]
        observerCallback([{ isIntersecting: false }])

        expect(fetchNextPage).not.toHaveBeenCalled()
    })

    it('disconnects observer when element is removed', async () => {
        const hasNextPage = ref(true)
        const isFetchingNextPage = ref(false)
        const fetchNextPage = vi.fn()

        const { loadMoreTrigger } = useInfiniteScroll({
            hasNextPage,
            isFetchingNextPage,
            fetchNextPage,
        })

        const mockElement = document.createElement('div')
        loadMoreTrigger.value = mockElement
        await nextTick()

        // Remove the element
        loadMoreTrigger.value = null
        await nextTick()

        expect(mockDisconnect).toHaveBeenCalled()
    })

    it('uses custom observer options when provided', async () => {
        const hasNextPage = ref(true)
        const isFetchingNextPage = ref(false)
        const fetchNextPage = vi.fn()
        const customOptions = { threshold: 0.5, rootMargin: '10px' }

        const { loadMoreTrigger } = useInfiniteScroll({
            hasNextPage,
            isFetchingNextPage,
            fetchNextPage,
            observerOptions: customOptions,
        })

        const mockElement = document.createElement('div')
        loadMoreTrigger.value = mockElement
        await nextTick()

        expect(mockIntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            expect.objectContaining({
                threshold: 0.5,
                rootMargin: '10px',
            }),
        )
    })
})
