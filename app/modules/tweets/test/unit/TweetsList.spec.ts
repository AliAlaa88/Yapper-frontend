import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import TweetsList from '../../components/TweetsList/TweetsList.vue'

// Mock the composable used by the component via relative path
vi.mock('../../queries/useTweetQueries', () => {
  return {
    useTweetsQuery: (fetchingSource?: any) => {
      // Default implementation: empty list
      return {
        data: ref([]),
        isLoading: ref(false),
        error: ref(null),
        refetch: vi.fn(),
      }
    },
  }
})

describe('TweetsList component', () => {
  afterEach(() => {
    // Clean up spies/mocks between tests and ensure fresh module imports
    vi.restoreAllMocks()
    vi.resetModules()
  })

  it('renders loading state when isLoading is true', async () => {
    const module = await import('../../queries/useTweetQueries')
    vi.spyOn(module, 'useTweetsQuery').mockImplementation(() => ({
      data: ref([]),
      isLoading: ref(true),
      error: ref(null),
      refetch: vi.fn(),
    }))

    const wrapper = mount(TweetsList as any, {
      global: { stubs: { Tweet: true } },
    })

    expect(wrapper.text()).toContain('Loading tweets...')
  })

  it('renders error state and calls refetch on retry', async () => {
    const refetch = vi.fn()
    const module = await import('../../queries/useTweetQueries')
    vi.spyOn(module, 'useTweetsQuery').mockImplementation(() => ({
      data: ref([]),
      isLoading: ref(false),
      error: ref('Failed to load'),
      refetch,
    }))

    const wrapper = mount(TweetsList as any, {
      global: { stubs: { Tweet: true } },
    })

    expect(wrapper.text()).toContain('Failed to load')

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    await button.trigger('click')
    expect(refetch).toHaveBeenCalled()
  })

  it('renders a list of Tweet items when tweets exist', async () => {
    const tweets = [
      { id: '1', user: { username: 'a' } },
      { id: '2', user: { username: 'b' } },
    ]

    const module = await import('../../queries/useTweetQueries')
    vi.spyOn(module, 'useTweetsQuery').mockImplementation(() => ({
      data: ref(tweets),
      isLoading: ref(false),
      error: ref(null),
      refetch: vi.fn(),
    }))

    // Stub the `Tweet` component so we can assert count
    const wrapper = mount(TweetsList as any, {
      global: { stubs: { Tweet: true } },
    })

    // There should be two Tweet stubs rendered
    const tweetStubs = wrapper.findAllComponents({ name: 'Tweet' })
    expect(tweetStubs.length).toBe(2)
  })

  // Additional tests

  it('renders no Tweet components when the tweets array is empty', async () => {
    const module = await import('../../queries/useTweetQueries')
    vi.spyOn(module, 'useTweetsQuery').mockImplementation(() => ({
      data: ref([]),
      isLoading: ref(false),
      error: ref(null),
      refetch: vi.fn(),
    }))

    const wrapper = mount(TweetsList as any, {
      global: { stubs: { Tweet: true } },
    })

    const tweetStubs = wrapper.findAllComponents({ name: 'Tweet' })
    expect(tweetStubs.length).toBe(0)
  })

  it('passes tweet prop to Tweet component (verified via a simple stub)', async () => {
    const tweets = [
      { id: '1', user: { username: 'alice' } },
      { id: '2', user: { username: 'bob' } },
    ]

    const module = await import('../../queries/useTweetQueries')
    vi.spyOn(module, 'useTweetsQuery').mockImplementation(() => ({
      data: ref(tweets),
      isLoading: ref(false),
      error: ref(null),
      refetch: vi.fn(),
    }))

    // Provide a stub that renders the passed tweet prop so we can assert prop forwarding
    const TweetStub = {
      props: ['tweet'],
      template: '<div class="tweet-stub">{{ tweet.user.username }}</div>',
    }

    const wrapper = mount(TweetsList as any, {
      global: { stubs: { Tweet: TweetStub } },
    })

    const stubNodes = wrapper.findAll('.tweet-stub')
    expect(stubNodes.length).toBe(2)
    expect(stubNodes[0].text()).toBe('alice')
    expect(stubNodes[1].text()).toBe('bob')
  })
})
