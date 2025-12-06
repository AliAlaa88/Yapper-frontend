  it('renders with zero and large stat values (formatted)', () => {
    const wrapper = shallowMount(Stats, {
      props: { stats: shallowReactive({
        likes: 0,
        replies: 0,
        retweets: 99999,
        views: 1234567,
        is_liked: false,
        is_reposted: false,
        is_bookmarked: false,
        tweet_id: 't2',
        username: 'bob',
        user_id: 'u2',
      }) },
      global,
    })
    // Only retweets count is visible, and is formatted as 99K
    expect(wrapper.text()).toContain('99K')
  })

  it('does not render views button if views is missing', () => {
    const wrapper = shallowMount(Stats, {
      props: { stats: shallowReactive({
        ...defaultStats,
        views: undefined,
      }) },
      global,
    })
    // Should not contain the views button id
    expect(wrapper.html()).not.toContain('tweet-views-button')
  })



  it('matches snapshot', () => {
    const wrapper = shallowMount(Stats, {
      props: { stats: shallowReactive({ ...defaultStats }) },
      global,
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
// Mock vue-i18n useI18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key, locale: 'en' }),
}))
// Mock the user store used in Stats.vue
vi.mock('~/modules/auth/stores/userStore', () => ({
  useUserStore: () => ({
    getUser: () => ({ user_id: 'u1' }),
  }),
}))

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { shallowReactive } from 'vue'
import Stats from '../../components/Tweet/subComponents/Stats/Stats.vue'

// Setup spies for mutation mocks
const likeMutate = vi.fn()
const repostMutate = vi.fn()
const bookmarkMutate = vi.fn()
vi.mock('../../queries/useTweetQueries', () => ({
  mutateTweetLikesQuery: () => ({ mutate: likeMutate, isPending: false }),
  mutateTweetRepostsQuery: () => ({ mutate: repostMutate, isPending: false }),
  mutateTweetBookmarkQuery: () => ({ mutate: bookmarkMutate, isPending: false }),
}))
vi.mock('../../stores/tweetTransition', () => ({
  useTweetTransitionStore: () => ({}),
}))

const defaultStats = {
  likes: 10,
  replies: 5,
  retweets: 3,
  views: 100,
  is_liked: false,
  is_reposted: false,
  is_bookmarked: false,
  tweet_id: 't1',
  username: 'alice',
  user_id: 'u1',
}

describe('Stats Component', () => {
  const mockSnackbar = { show: vi.fn() }
  const global = {
    provide: { snackbar: mockSnackbar },
    stubs: ['RouterLink', 'FontAwesomeIcon', 'CustomToolTip'],
  }

  beforeEach(() => {
    likeMutate.mockClear()
    repostMutate.mockClear()
    bookmarkMutate.mockClear()
  })

  it('renders retweets count as visible text', () => {
    const wrapper = shallowMount(Stats, {
      props: { stats: shallowReactive({ ...defaultStats }) },
      global,
    })
    expect(wrapper.text()).toContain('3')
  })

  it('renders CustomToolTip stubs', () => {
    const wrapper = shallowMount(Stats, {
      props: { stats: shallowReactive({ ...defaultStats }) },
      global,
    })
    expect(wrapper.findAllComponents({ name: 'CustomToolTip' }).length).toBeGreaterThan(0)
  })
})