import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Tweet from '../../components/Tweet/Tweet.vue'

describe('Tweet component', () => {
  it('renders avatar image and NuxtLink to profile', () => {
    const sampleTweet = {
      id: 't1',
      content: 'Hello world',
      user: {
        id: 'u1',
        name: 'Alice',
        username: 'alice',
        avatar: '/avatar.jpg',
        link: undefined,
      },
      stats: { likes: 0, replies: 0, reposts: 0 },
      type: 'tweet',
      createdAt: '2020-01-01',
      updatedAt: '2020-01-01',
    }

    const wrapper = mount(Tweet as any, {
      props: { tweet: sampleTweet },
      global: {
        stubs: {
          // Render NuxtLink as simple <a> so we can assert href
          NuxtLink: {
            props: ['to'],
            template: `<a :href="to"><slot/></a>`,
          },
          // Stub child components so rendering is focused on structure
          Publisher: true,
          Content: true,
          Stats: true,
        },
      },
    })

    // Assert avatar image src and alt
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/avatar.jpg')
    expect(img.attributes('alt')).toBe('Alice')

    // NuxtLink href should point to profile URL (/profile/alice)
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('/profile/alice')
  })
})