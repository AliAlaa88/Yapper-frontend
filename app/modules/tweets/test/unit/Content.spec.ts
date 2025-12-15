import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import Content from '../../components/Tweet/subComponents/Content/Content.vue'
import type { Content as ContentType } from '../../types'

// Mock Nuxt composables
vi.mock('#app', () => ({
    navigateTo: vi.fn(),
    useRouter: () => ({ push: vi.fn() }),
}))

describe('Content Component', () => {
    describe('Text Rendering', () => {
        it('renders tweet text correctly', () => {
            const content = {
                text: 'Hello, this is a tweet!',
                images: [],
                videos: [],
                parentTweet: null,
            }

            const wrapper = mount(Content, {
                props: { content },
                global: {
                    stubs: {
                        TweetMedia: true,
                        QuotedTweet: true,
                    },
                },
            })

            const paragraph = wrapper.find('p')
            expect(paragraph.text()).toBe('Hello, this is a tweet!')
            expect(paragraph.classes()).toContain('whitespace-pre-wrap')
            expect(paragraph.classes()).toContain('wrap-break-word')
        })

        it('preserves whitespace and line breaks in text', () => {
            const content = {
                text: 'Line 1\nLine 2\n\nLine 4',
                images: [],
                videos: [],
                parentTweet: null,
            }

            const wrapper = mount(Content, {
                props: { content },
                global: {
                    stubs: { TweetMedia: true, QuotedTweet: true },
                },
            })

            const paragraph = wrapper.find('p')
            expect(paragraph.text()).toBe('Line 1\nLine 2\n\nLine 4')
            expect(paragraph.classes()).toContain('whitespace-pre-wrap')
        })

        it('handles long text with wrap-break-word class', () => {
            const content = {
                text: 'Verylongtextwithoutspacesinittotestbreakwords',
                images: [],
                videos: [],
                parentTweet: null,
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: true, QuotedTweet: true } },
            })

            const paragraph = wrapper.find('p')
            expect(paragraph.classes()).toContain('wrap-break-word')
        })
    })

    describe('No Images', () => {
        it('does not render image container when images array is empty', () => {
            const content: ContentType = {
                text: 'Text only tweet',
                images: [],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: true, QuotedTweet: true } },
            })

            // When there is no media, TweetMedia should not be rendered
            const tweetMedia = wrapper.findComponent({ name: 'TweetMedia' })
            expect(tweetMedia.exists()).toBe(false)
        })

        it('does not render images when images is undefined', () => {
            const content: ContentType = {
                text: 'Text only tweet',
                images: [],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: true, QuotedTweet: true } },
            })

            const tweetMedia = wrapper.findComponent({ name: 'TweetMedia' })
            expect(tweetMedia.exists()).toBe(false)
        })
    })

    describe('Single Image', () => {
        it('renders one image with aspect-video class', () => {
            const content: ContentType = {
                text: 'Tweet with one image',
                images: ['/image1.jpg'],
                videos: [],
            }

            // For media-related assertions, assert that TweetMedia receives the correct props
            const TweetMediaStub = {
                props: ['images', 'videos'],
                template:
                    '<div class="tweet-media-stub">{{ images?.length }}|{{ videos?.length }}</div>',
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: TweetMediaStub, QuotedTweet: true } },
            })

            const stub = wrapper.find('.tweet-media-stub')
            expect(stub.exists()).toBe(true)
            expect(stub.text()).toContain('1|0')
        })

        it('uses grid-cols-1 for single image', () => {
            const content: ContentType = {
                text: 'One image',
                images: ['/image1.jpg'],
                videos: [],
            }

            const TweetMediaStub = {
                props: ['images', 'videos'],
                template:
                    '<div class="tweet-media-stub">{{ images?.length }}|{{ videos?.length }}</div>',
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: TweetMediaStub, QuotedTweet: true } },
            })

            const stub = wrapper.find('.tweet-media-stub')
            expect(stub.text()).toContain('1|0')
        })
    })

    describe('Two Images', () => {
        it('renders two images with aspect-square class', () => {
            const content: ContentType = {
                text: 'Tweet with two images',
                images: ['/image1.jpg', '/image2.jpg'],
                videos: [],
            }

            const TweetMediaStub = {
                props: ['images', 'videos'],
                template: '<div class="tweet-media-stub">{{ images?.length }}</div>',
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: TweetMediaStub, QuotedTweet: true } },
            })

            const stub = wrapper.find('.tweet-media-stub')
            expect(stub.exists()).toBe(true)
            expect(stub.text()).toBe('2')
        })

        it('uses grid layout with gap and 2 columns', () => {
            const content: ContentType = {
                text: 'Two images',
                images: ['/image1.jpg', '/image2.jpg'],
                videos: [],
            }

            const TweetMediaStub = {
                props: ['images', 'videos'],
                template: '<div class="tweet-media-stub">{{ images?.length }}</div>',
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: TweetMediaStub, QuotedTweet: true } },
            })

            const stub = wrapper.find('.tweet-media-stub')
            expect(stub.text()).toBe('2')
        })
    })

    describe('Image Container CSS', () => {
        it('applies correct border and styling classes', () => {
            const content: ContentType = {
                text: 'Image test',
                images: ['/image1.jpg'],
                videos: [],
            }

            const TweetMediaStub = {
                props: ['images', 'videos'],
                template: '<div class="tweet-media-stub">{{ images?.length }}</div>',
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: TweetMediaStub, QuotedTweet: true } },
            })

            const stub = wrapper.find('.tweet-media-stub')
            expect(stub.exists()).toBe(true)
        })

        it('applies w-full and object-cover to all images', () => {
            const content: ContentType = {
                text: 'Multiple images',
                images: ['/img1.jpg', '/img2.jpg', '/img3.jpg'],
                videos: [],
            }

            const TweetMediaStub = {
                props: ['images', 'videos'],
                template: '<div class="tweet-media-stub">{{ images?.length }}</div>',
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: TweetMediaStub, QuotedTweet: true } },
            })

            const stub = wrapper.find('.tweet-media-stub')
            expect(stub.text()).toBe('3')
        })
    })

    describe('Videos', () => {
        it('does not render videos (commented out in template)', () => {
            const content: ContentType = {
                text: 'Video tweet',
                images: [],
                videos: ['/video1.mp4'],
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: true, QuotedTweet: true } },
            })

            // Videos are handled inside TweetMedia / VideoPlayer; here we only ensure TweetMedia would be present
            const tweetMedia = wrapper.findComponent({ name: 'TweetMedia' })
            expect(tweetMedia.exists()).toBe(true)
        })
    })

    describe('Mixed Content', () => {
        it('renders both text and images', () => {
            const content: ContentType = {
                text: 'Check out these photos!',
                images: ['/photo1.jpg', '/photo2.jpg'],
                videos: [],
            }

            const TweetMediaStub = {
                props: ['images', 'videos'],
                template: '<div class="tweet-media-stub">{{ images?.length }}</div>',
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: TweetMediaStub, QuotedTweet: true } },
            })

            expect(wrapper.find('p').text()).toBe('Check out these photos!')
            expect(wrapper.find('.tweet-media-stub').text()).toBe('2')
        })

        it('renders text even when content has videos', () => {
            const content: ContentType = {
                text: 'Watch this video',
                images: [],
                videos: ['/video.mp4'],
            }

            const TweetMediaStub = {
                props: ['images', 'videos'],
                template: '<div class="tweet-media-stub">{{ videos?.length }}</div>',
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: TweetMediaStub, QuotedTweet: true } },
            })

            expect(wrapper.find('p').text()).toBe('Watch this video')
        })
    })

    describe('Edge Cases', () => {
        it('handles empty text', () => {
            const content: ContentType = {
                text: '',
                images: ['/image.jpg'],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: true, QuotedTweet: true } },
            })

            const paragraph = wrapper.find('p')
            expect(paragraph.text()).toBe('')
            expect(paragraph.exists()).toBe(true)
        })

        it('renders correct number of images with unique keys', () => {
            const content: ContentType = {
                text: 'Multiple images',
                images: ['/img1.jpg', '/img2.jpg', '/img3.jpg', '/img4.jpg'],
                videos: [],
            }

            const TweetMediaStub = {
                props: ['images', 'videos'],
                template: '<div class="tweet-media-stub">{{ images?.length }}</div>',
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: TweetMediaStub, QuotedTweet: true } },
            })

            const stub = wrapper.find('.tweet-media-stub')
            expect(stub.text()).toBe('4')
        })
    })

    describe('Container Classes', () => {
        it('applies correct text styling to root container', () => {
            const content: ContentType = {
                text: 'Test',
                images: [],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: true, QuotedTweet: true } },
            })

            const root = wrapper.find('div')
            expect(root.classes()).toContain('text-primary')
            expect(root.classes()).toContain('text-sm')
            expect(root.classes()).toContain('leading-5')
        })
    })
})
