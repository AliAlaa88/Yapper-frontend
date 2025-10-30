import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useTweetDetails } from '../../composables/useTweetDetails'

// Mock the underlying query used by the composable
vi.mock('../../queries/useTweetQueries', () => ({
  useTweetDetailsQuery: (tweetId: string) => ({
    data: ref(null),
    isLoading: ref(false),
    error: ref(null),
    refetch: vi.fn(),
  } as any),
}) as any)

describe('useTweetDetails composable', () => {
  it('returns empty replies when no tweetDetails', () => {
    const result = useTweetDetails('t1')
    expect(Array.isArray(result.replies.value)).toBe(true)
    expect(result.replies.value.length).toBe(0)
  })

  it('returns replies from tweetDetails when present', async () => {
    // Re-mock to provide tweetDetails with replies
    const replies = [{ id: 'r1' }, { id: 'r2' }]
    const module = await import('../../queries/useTweetQueries')
    vi.spyOn(module, 'useTweetDetailsQuery').mockImplementation(() => ({
      data: ref({ tweet: { id: 't1', user: {}, content: '', createdAt: '', type: 'tweet', stats: {} }, replies } as any),
      isLoading: ref(false),
      error: ref(null),
      refetch: vi.fn(),
    } as any))

    const result = useTweetDetails('t1')
    expect(result.replies.value).toEqual(replies)
  })
})
