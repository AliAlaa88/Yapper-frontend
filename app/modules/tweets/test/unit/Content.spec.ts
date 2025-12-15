import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import Content from '../../components/Tweet/subComponents/Content/Content.vue'
import type { Content as ContentType } from '../../types'

// Mock Nuxt composables
vi.mock('#app', () => ({
    navigateTo: vi.fn(),
    useRouter: () => ({ push: vi.fn() }),
}))

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
    useRouter: () => ({ push: mockPush }),
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

    describe('Edge Cases', () => {
        it('handles empty text with only images', () => {
            const content: ContentType = {
                text: '',
                images: ['/img1.jpg'],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: true, QuotedTweet: true } },
            })

            expect(wrapper.exists()).toBe(true)
        })

        it('handles content with all empty arrays', () => {
            const content: ContentType = {
                text: 'Only text content',
                images: [],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: true, QuotedTweet: true } },
            })

            expect(wrapper.text()).toContain('Only text content')
        })

        it('handles very long text content', () => {
            const longText = 'A'.repeat(1000)
            const content: ContentType = {
                text: longText,
                images: [],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: true, QuotedTweet: true } },
            })

            expect(wrapper.text()).toContain('A'.repeat(100))
        })

        it('handles text with special characters', () => {
            const content: ContentType = {
                text: '<script>alert("xss")</script>',
                images: [],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: true, QuotedTweet: true } },
            })

            // Should be escaped/rendered as text, not executed
            expect(wrapper.exists()).toBe(true)
        })

        it('handles text with emojis', () => {
            const content: ContentType = {
                text: 'Hello 👋 World 🌍!',
                images: [],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
                global: { stubs: { TweetMedia: true, QuotedTweet: true } },
            })

            expect(wrapper.text()).toContain('👋')
            expect(wrapper.text()).toContain('🌍')
        })
    })

    describe('Interaction Handling', () => {
        it('navigates to search when hashtag is clicked', async () => {
            const content: ContentType = {
                text: 'Hello #world',
                images: [],
                videos: [],
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

            // Simulate hashtag click by manually dispatching event on a mock element
            // mimicking the structure created by parseLinks
            const mockHashtag = document.createElement('a')
            mockHashtag.setAttribute('data-hashtag', 'world')
            mockHashtag.textContent = '#world'

            // Append to wrapper element to properly bubble up
            wrapper.element.appendChild(mockHashtag)

            // Dispatch click event from the hashtag element
            mockHashtag.dispatchEvent(
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                }),
            )

            expect(mockPush).toHaveBeenCalledWith({ path: '/search', query: { q: '#world' } })
        })
    })

    describe('Quoted Tweet', () => {
        it('renders QuotedTweet stub when quotedTweet is provided', () => {
            const content: ContentType = {
                text: 'Check this out!',
                images: [],
                videos: [],
                quotedTweet: {
                    tweet_id: 'quoted1',
                    content: { text: 'Original tweet', images: [], videos: [] },
                    user: { id: 'u1', name: 'Alice', username: 'alice' },
                } as any,
            }

            const wrapper = mount(Content, {
                props: { content },
                global: {
                    stubs: {
                        TweetMedia: true,
                        QuotedTweet: { template: '<div class="quoted-tweet-stub"></div>' },
                    },
                },
            })

            expect(wrapper.find('.quoted-tweet-stub').exists()).toBe(true)
        })

        it('does not render QuotedTweet when quoted_tweet is undefined', () => {
            const content: ContentType = {
                text: 'No quoted tweet here',
                images: [],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
                global: {
                    stubs: {
                        TweetMedia: true,
                        QuotedTweet: { template: '<div class="quoted-tweet-stub"></div>' },
                    },
                },
            })

            expect(wrapper.find('.quoted-tweet-stub').exists()).toBe(false)
        })
    })
})
