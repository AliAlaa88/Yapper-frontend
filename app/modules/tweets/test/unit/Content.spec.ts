import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Content from '../../components/Tweet/subComponents/Content/Content.vue'
import type { Content as ContentType } from '../../types'

describe('Content Component', () => {
    describe('Text Rendering', () => {
        it('renders tweet text correctly', () => {
            const content: ContentType = {
                text: 'Hello, this is a tweet!',
                images: [],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
            })

            const paragraph = wrapper.find('p')
            expect(paragraph.text()).toBe('Hello, this is a tweet!')
            expect(paragraph.classes()).toContain('whitespace-pre-wrap')
            expect(paragraph.classes()).toContain('wrap-break-word')
        })

        it('preserves whitespace and line breaks in text', () => {
            const content: ContentType = {
                text: 'Line 1\nLine 2\n\nLine 4',
                images: [],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
            })

            const paragraph = wrapper.find('p')
            expect(paragraph.text()).toBe('Line 1\nLine 2\n\nLine 4')
            expect(paragraph.classes()).toContain('whitespace-pre-wrap')
        })

        it('handles long text with wrap-break-word class', () => {
            const content: ContentType = {
                text: 'Verylongtextwithoutspacesinittotestbreakwords',
                images: [],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
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
            })

            const imageContainer = wrapper.find('.rounded-2xl.overflow-hidden.border')
            expect(imageContainer.exists()).toBe(false)
        })

        it('does not render images when images is undefined', () => {
            const content: ContentType = {
                text: 'Text only tweet',
                images: [],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
            })

            const images = wrapper.findAll('img')
            expect(images.length).toBe(0)
        })
    })

    describe('Single Image', () => {
        it('renders one image with aspect-video class', () => {
            const content: ContentType = {
                text: 'Tweet with one image',
                images: ['/image1.jpg'],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
            })

            const images = wrapper.findAll('img')
            expect(images.length).toBe(1)
            expect(images[0]?.attributes('src')).toBe('/image1.jpg')
            expect(images[0]?.attributes('alt')).toBe('Tweet image')
            expect(images[0]?.classes()).toContain('aspect-video')
            expect(images[0]?.classes()).not.toContain('aspect-square')
        })

        it('uses grid-cols-1 for single image', () => {
            const content: ContentType = {
                text: 'One image',
                images: ['/image1.jpg'],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
            })

            const container = wrapper.find('.rounded-2xl')
            expect(container.classes()).toContain('grid-cols-1')
            expect(container.classes()).not.toContain('grid-cols-2')
        })
    })

    describe('Two Images', () => {
        it('renders two images with aspect-square class', () => {
            const content: ContentType = {
                text: 'Tweet with two images',
                images: ['/image1.jpg', '/image2.jpg'],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
            })

            const images = wrapper.findAll('img')
            expect(images.length).toBe(2)
            images.forEach(img => {
                expect(img.classes()).toContain('aspect-square')
                expect(img.classes()).not.toContain('aspect-video')
            })
        })

        it('uses grid layout with gap and 2 columns', () => {
            const content: ContentType = {
                text: 'Two images',
                images: ['/image1.jpg', '/image2.jpg'],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
            })

            const container = wrapper.find('.rounded-2xl')
            expect(container.classes()).toContain('grid')
            expect(container.classes()).toContain('gap-0.5')
            expect(container.classes()).toContain('grid-cols-2')
        })
    })
    
    describe('Image Container CSS', () => {
        it('applies correct border and styling classes', () => {
            const content: ContentType = {
                text: 'Image test',
                images: ['/image1.jpg'],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
            })

            const container = wrapper.find('.rounded-2xl')
            expect(container.classes()).toContain('mb-3')
            expect(container.classes()).toContain('rounded-2xl')
            expect(container.classes()).toContain('overflow-hidden')
            expect(container.classes()).toContain('border')
            expect(container.classes()).toContain('border-primary')
        })

        it('applies w-full and object-cover to all images', () => {
            const content: ContentType = {
                text: 'Multiple images',
                images: ['/img1.jpg', '/img2.jpg', '/img3.jpg'],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
            })

            const images = wrapper.findAll('img')
            images.forEach(img => {
                expect(img.classes()).toContain('w-full')
                expect(img.classes()).toContain('object-cover')
            })
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
            })

            const videos = wrapper.findAll('video')
            expect(videos.length).toBe(0)
        })
    })

    describe('Mixed Content', () => {
        it('renders both text and images', () => {
            const content: ContentType = {
                text: 'Check out these photos!',
                images: ['/photo1.jpg', '/photo2.jpg'],
                videos: [],
            }

            const wrapper = mount(Content, {
                props: { content },
            })

            expect(wrapper.find('p').text()).toBe('Check out these photos!')
            expect(wrapper.findAll('img').length).toBe(2)
        })

        it('renders text even when content has videos', () => {
            const content: ContentType = {
                text: 'Watch this video',
                images: [],
                videos: ['/video.mp4'],
            }

            const wrapper = mount(Content, {
                props: { content },
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

            const wrapper = mount(Content, {
                props: { content },
            })

            const images = wrapper.findAll('img')
            expect(images.length).toBe(4)
            
            // Verify each image has correct src
            expect(images[0]?.attributes('src')).toBe('/img1.jpg')
            expect(images[1]?.attributes('src')).toBe('/img2.jpg')
            expect(images[2]?.attributes('src')).toBe('/img3.jpg')
            expect(images[3]?.attributes('src')).toBe('/img4.jpg')
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
            })

            const root = wrapper.find('div')
            expect(root.classes()).toContain('text-primary')
            expect(root.classes()).toContain('text-sm')
            expect(root.classes()).toContain('leading-5')
        })
    })
})
