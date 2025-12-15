import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useTweetDetails } from '../../composables/useTweetDetails'

// Mock the query module
vi.mock('../../queries/useTweetQueries', () => ({
    useTweetDetailsQuery: vi.fn(),
}))

describe('useTweetDetails composable', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns empty replies when no tweetDetails', async () => {
        const { useTweetDetailsQuery } = await import('../../queries/useTweetQueries')
        vi.mocked(useTweetDetailsQuery).mockReturnValue({
            data: ref(null),
            isLoading: ref(false),
            error: ref(null),
            refetch: vi.fn(),
        } as any)

        const result = useTweetDetails('t1')
        expect(Array.isArray(result.replies.value)).toBe(true)
        expect(result.replies.value.length).toBe(0)
    })

    it('returns replies from tweetDetails when present', async () => {
        const replies = [{ id: 'r1' }, { id: 'r2' }]
        const { useTweetDetailsQuery } = await import('../../queries/useTweetQueries')
        // The composable expects replies to be an object with a `data` array
        vi.mocked(useTweetDetailsQuery).mockReturnValue({
            data: ref({
                tweet: {
                    id: 't1',
                    user: {},
                    content: { text: '' },
                    createdAt: '',
                    stats: {},
                },
                replies: { data: replies },
            } as any),
            isLoading: ref(false),
            error: ref(null),
            refetch: vi.fn(),
        } as any)

        const result = useTweetDetails('t1')
        expect(result.replies.value).toEqual(replies)
    })

    it('exposes isLoading and error from the query', async () => {
        const loadingRef = ref(true)
        const errorRef = ref(new Error('fetch failed'))

        const { useTweetDetailsQuery } = await import('../../queries/useTweetQueries')
        vi.mocked(useTweetDetailsQuery).mockReturnValue({
            data: ref(null),
            isLoading: loadingRef,
            error: errorRef,
            refetch: vi.fn(),
        } as any)

        const result = useTweetDetails('t1')
        expect(result.isLoading.value).toBe(true)
        expect(result.error.value).toEqual(new Error('fetch failed'))
    })

    it('fetchTweetDetails calls the underlying refetch', async () => {
        const refetchSpy = vi.fn()
        const { useTweetDetailsQuery } = await import('../../queries/useTweetQueries')
        vi.mocked(useTweetDetailsQuery).mockReturnValue({
            data: ref(null),
            isLoading: ref(false),
            error: ref(null),
            refetch: refetchSpy,
        } as any)

        const result = useTweetDetails('t1')
        result.fetchTweetDetails()
        expect(refetchSpy).toHaveBeenCalled()
    })

    it('reacts to changes in tweetDetails and updates replies', async () => {
        const dataRef = ref<any>(null)
        const { useTweetDetailsQuery } = await import('../../queries/useTweetQueries')
        vi.mocked(useTweetDetailsQuery).mockReturnValue({
            data: dataRef,
            isLoading: ref(false),
            error: ref(null),
            refetch: vi.fn(),
        } as any)

        const result = useTweetDetails('t1')
        expect(result.replies.value).toEqual([])

        dataRef.value = {
            tweet: {
                id: 't1',
                user: {},
                content: { text: '' },
                createdAt: '',
                stats: {},
            },
            replies: { data: [{ id: 'r1' }] },
        }
        await nextTick()
        expect(result.replies.value).toEqual([{ id: 'r1' }])
    })
})
