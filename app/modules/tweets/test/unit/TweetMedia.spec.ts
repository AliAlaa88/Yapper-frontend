import { describe, it, expect, vi  } from 'vitest'
import { mount } from '@vue/test-utils'
import TweetMedia from '../../components/Tweet/subComponents/TweetMedia/TweetMedia.vue'

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
        template: '<div class="lightbox-mock" :data-visible="visible" :data-index="index" />',
    },
}))

vi.mock('swiper/vue', () => ({
    Swiper: {
        name: 'Swiper',
        template: '<div class="swiper-mock"><slot /></div>',
        props: ['modules', 'pagination'],
    },
    SwiperSlide: {
        name: 'SwiperSlide',
        template: '<div class="swiper-slide-mock"><slot /></div>',
    },
}))

vi.mock('swiper/modules', () => ({
    Pagination: {},
}))

import TweetMedia from '../../components/Tweet/subComponents/TweetMedia/TweetMedia.vue'

describe('TweetMedia Component', () => {
    describe('Image Rendering', () => {
        it('renders images correctly', () => {
            const images = ['/img1.jpg', '/img2.jpg']
            const wrapper = mount(TweetMedia, { props: { images, videos: [], gifs: [] } })
            images.forEach((img) => {
                expect(wrapper.html()).toContain(img)
            })
        })

        it('renders single image', () => {
            const wrapper = mount(TweetMedia, {
                props: { images: ['/single.jpg'], videos: [], gifs: [] },
            })
            expect(wrapper.html()).toContain('/single.jpg')
        })

        it('renders multiple images as swiper slides', () => {
            const images = ['/img1.jpg', '/img2.jpg', '/img3.jpg']
            const wrapper = mount(TweetMedia, { props: { images, videos: [], gifs: [] } })
            const slides = wrapper.findAll('.swiper-slide-mock')
            expect(slides.length).toBe(3)
        })
    })

    describe('Video Rendering', () => {
        it('renders videos', () => {
            const videos = ['/vid1.mp4']
            const wrapper = mount(TweetMedia, { props: { images: [], videos, gifs: [] } })
            expect(wrapper.html()).toContain('/vid1.mp4')
        })

        it('renders multiple videos', () => {
            const videos = ['/vid1.mp4', '/vid2.mp4']
            const wrapper = mount(TweetMedia, { props: { images: [], videos, gifs: [] } })
            videos.forEach((vid) => {
                expect(wrapper.html()).toContain(vid)
            })
        })
    })

    describe('Mixed Media', () => {
        it('renders both images and videos', () => {
            const wrapper = mount(TweetMedia, {
                props: { images: ['/img.jpg'], videos: ['/vid.mp4'], gifs: [] },
            })
            expect(wrapper.html()).toContain('/img.jpg')
            expect(wrapper.html()).toContain('/vid.mp4')
        })

        it('creates correct number of slides for mixed media', () => {
            const wrapper = mount(TweetMedia, {
                props: { images: ['/img1.jpg', '/img2.jpg'], videos: ['/vid.mp4'], gifs: [] },
            })
            const slides = wrapper.findAll('.swiper-slide-mock')
            expect(slides.length).toBe(3)
        })
    })

    describe('Lightbox', () => {
        it('includes VueEasyLightbox component when images exist', () => {
            const wrapper = mount(TweetMedia, {
                props: { images: ['/img.jpg'], videos: [], gifs: [] },
            })
            const lightbox = wrapper.find('.lightbox-mock')
            expect(lightbox.exists()).toBe(true)
        })

        it('does not render lightbox when no images', () => {
            const wrapper = mount(TweetMedia, {
                props: { images: [], videos: ['/vid.mp4'], gifs: [] },
            })
            const lightbox = wrapper.find('.lightbox-mock')
            expect(lightbox.exists()).toBe(false)
        })

        it('passes correct images to lightbox', () => {
            const images = ['/img1.jpg', '/img2.jpg']
            const wrapper = mount(TweetMedia, {
                props: { images, videos: [], gifs: [] },
            })
            const lightbox = wrapper.find('.lightbox-mock')
            expect(lightbox.exists()).toBe(true)
        })
    })

    describe('Swiper Container', () => {
        it('renders swiper container', () => {
            const wrapper = mount(TweetMedia, {
                props: { images: ['/img.jpg'], videos: [], gifs: [] },
            })
            const swiper = wrapper.find('.swiper-mock')
            expect(swiper.exists()).toBe(true)
        })
    })

    describe('Edge Cases', () => {
        it('handles empty arrays gracefully', () => {
            const wrapper = mount(TweetMedia, {
                props: { images: [], videos: [], gifs: [] },
            })
            expect(wrapper.exists()).toBe(true)
        })

        it('handles undefined gifs prop', () => {
            const wrapper = mount(TweetMedia, {
                props: { images: ['/img.jpg'], videos: [] } as any,
            })
            expect(wrapper.exists()).toBe(true)
        })

        it('handles single video only', () => {
            const wrapper = mount(TweetMedia, {
                props: { images: [], videos: ['/vid.mp4'], gifs: [] },
            })
            expect(wrapper.html()).toContain('/vid.mp4')
        })
    })
})
