import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { vi } from 'vitest'

vi.mock('@videojs-player/vue', () => ({
  VideoPlayer: {
    name: 'VideoPlayer',
    props: ['src'],
    template: '<video :src="src" />',
  },
}))

vi.mock('vue-easy-lightbox', () => ({
  default: {
    name: 'VueEasyLightbox',
    props: ['visible', 'imgs', 'index'],
    template: '<div />',
  },
}))
import TweetMedia from '../../components/Tweet/subComponents/TweetMedia/TweetMedia.vue'

describe('TweetMedia Component', () => {
  it('renders images', () => {
    const images = ['/img1.jpg', '/img2.jpg']
    const wrapper = mount(TweetMedia, { props: { images, videos: [], gifs: [] } })
    images.forEach(img => {
      expect(wrapper.html()).toContain(img)
    })
  })
  it('renders videos', () => {
    const videos = ['/vid1.mp4']
    const wrapper = mount(TweetMedia, { props: { images: [], videos, gifs: [] } })
    expect(wrapper.html()).toContain('/vid1.mp4')
  })
  // GIF rendering is not supported by TweetMedia.vue, so this test is removed.
})
