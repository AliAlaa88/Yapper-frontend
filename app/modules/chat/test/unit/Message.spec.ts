import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Message from '../../components/ChatMessages/SubComponents/Message/Message.vue'
import type { Message as MessageType } from '../../types'

// Mock the utility function
vi.mock('~/utils/helpers', () => ({
    formatMessageDate: (date: string) => {
        const d = new Date(date)
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    },
}))

// Mock userStore
const mockUserStore = {
    getUser: vi.fn(() => ({
        user_id: 'current-user-id',
    })),
}

vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => mockUserStore,
}))

describe('Message Component', () => {
    const mockOwnMessage: MessageType = {
        id: 'msg-1',
        content: 'Hello, this is my message',
        message_type: 'text',
        sender: {
            id: 'current-user-id',
            username: 'john_doe',
            name: 'John Doe',
            avatar_url: 'https://example.com/avatar.jpg',
        },
        reply_to: null,
        is_read: true,
        is_edited: false,
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z',
    }

    const mockOtherMessage: MessageType = {
        id: 'msg-2',
        content: 'Hello, this is a message from someone else',
        message_type: 'text',
        sender: {
            id: 'other-user-id',
            username: 'jane_doe',
            name: 'Jane Doe',
            avatar_url: 'https://example.com/avatar2.jpg',
        },
        reply_to: null,
        is_read: true,
        is_edited: false,
        created_at: '2024-01-01T10:05:00Z',
        updated_at: '2024-01-01T10:05:00Z',
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Own Messages', () => {
        it('should render own message with correct styling', () => {
            const wrapper = mount(Message, {
                props: {
                    message: mockOwnMessage,
                },
            })

            expect(wrapper.find('.flex').classes()).toContain('justify-end')
            expect(wrapper.text()).toContain('Hello, this is my message')
        })

        it('should apply accent background color for own messages', () => {
            const wrapper = mount(Message, {
                props: {
                    message: mockOwnMessage,
                },
            })

            const messageBubble = wrapper.find('.rounded-3xl')
            expect(messageBubble.classes()).toContain('bg-accent')
        })

        it('should align timestamp to the right for own messages', () => {
            const wrapper = mount(Message, {
                props: {
                    message: mockOwnMessage,
                },
            })

            const timestamp = wrapper.find('.text-xs')
            expect(timestamp.classes()).toContain('text-right')
        })
    })

    describe('Other Users Messages', () => {
        it('should render other user message with correct styling', () => {
            const wrapper = mount(Message, {
                props: {
                    message: mockOtherMessage,
                },
            })

            expect(wrapper.find('.flex').classes()).toContain('justify-start')
            expect(wrapper.text()).toContain('Hello, this is a message from someone else')
        })

        it('should apply dark-gray background color for other messages', () => {
            const wrapper = mount(Message, {
                props: {
                    message: mockOtherMessage,
                },
            })

            const messageBubble = wrapper.find('.rounded-3xl')
            expect(messageBubble.classes()).toContain('bg-dark-gray')
        })

        it('should align timestamp to the left for other messages', () => {
            const wrapper = mount(Message, {
                props: {
                    message: mockOtherMessage,
                },
            })

            const timestamp = wrapper.find('.text-xs')
            expect(timestamp.classes()).toContain('text-left')
        })
    })

    describe('Message Content', () => {
        it('should display message content correctly', () => {
            const messageContent = 'Test message content'
            const customMessage = { ...mockOwnMessage, content: messageContent }

            const wrapper = mount(Message, {
                props: {
                    message: customMessage,
                },
            })

            expect(wrapper.text()).toContain(messageContent)
        })

        it('should preserve whitespace in message content', () => {
            const messageWithWhitespace = {
                ...mockOwnMessage,
                content: 'Line 1\nLine 2\nLine 3',
            }

            const wrapper = mount(Message, {
                props: {
                    message: messageWithWhitespace,
                },
            })

            const messageElement = wrapper.find('p')
            expect(messageElement.classes()).toContain('whitespace-pre-wrap')
        })
    })

    describe('Media Display', () => {
        it('should display images when media is present', () => {
            const messageWithImage = {
                ...mockOwnMessage,
                media: [
                    {
                        url: 'https://example.com/image.jpg',
                        type: 'image' as const,
                    },
                ],
            }

            const wrapper = mount(Message, {
                props: {
                    message: messageWithImage,
                },
            })

            const image = wrapper.find('img')
            expect(image.exists()).toBe(true)
            expect(image.attributes('src')).toBe('https://example.com/image.jpg')
            expect(image.attributes('alt')).toBe('Media 1')
        })

        it('should display videos when media is present', () => {
            const messageWithVideo = {
                ...mockOwnMessage,
                media: [
                    {
                        url: 'https://example.com/video.mp4',
                        type: 'video' as const,
                    },
                ],
            }

            const wrapper = mount(Message, {
                props: {
                    message: messageWithVideo,
                },
            })

            const video = wrapper.find('video')
            expect(video.exists()).toBe(true)
            expect(video.attributes('src')).toBe('https://example.com/video.mp4')
            expect(video.attributes('controls')).toBeDefined()
        })

        it('should display multiple media items', () => {
            const messageWithMultipleMedia = {
                ...mockOwnMessage,
                media: [
                    { url: 'https://example.com/image1.jpg', type: 'image' as const },
                    { url: 'https://example.com/image2.jpg', type: 'image' as const },
                    { url: 'https://example.com/video.mp4', type: 'video' as const },
                ],
            }

            const wrapper = mount(Message, {
                props: {
                    message: messageWithMultipleMedia,
                },
            })

            const images = wrapper.findAll('img')
            const videos = wrapper.findAll('video')

            expect(images).toHaveLength(2)
            expect(videos).toHaveLength(1)
        })

        it('should not display media section when media is empty', () => {
            const wrapper = mount(Message, {
                props: {
                    message: mockOwnMessage,
                },
            })

            expect(wrapper.find('img').exists()).toBe(false)
            expect(wrapper.find('video').exists()).toBe(false)
        })
    })

    describe('Timestamp', () => {
        it('should display formatted timestamp', () => {
            const wrapper = mount(Message, {
                props: {
                    message: mockOwnMessage,
                },
            })

            expect(wrapper.text()).toMatch(/\d{2}:\d{2}/)
        })

        it('should format different dates correctly', () => {
            const messageAtDifferentTime = {
                ...mockOwnMessage,
                created_at: '2024-12-06T15:30:00Z',
            }

            const wrapper = mount(Message, {
                props: {
                    message: messageAtDifferentTime,
                },
            })

            expect(wrapper.find('.text-xs').text()).toBeTruthy()
        })
    })

    describe('Sender Information', () => {
        it('should correctly identify own messages by sender id', () => {
            const wrapper = mount(Message, {
                props: {
                    message: mockOwnMessage,
                },
            })

            // Own message should align to right
            expect(wrapper.find('.flex').classes()).toContain('justify-end')
        })

        it('should correctly identify other messages by different sender id', () => {
            const wrapper = mount(Message, {
                props: {
                    message: mockOtherMessage,
                },
            })

            // Other message should align to left
            expect(wrapper.find('.flex').classes()).toContain('justify-start')
        })

        it('should handle string and numeric user id comparison', () => {
            // Test with numeric id that needs to be converted to string
            mockUserStore.getUser.mockReturnValue({
                user_id: 123,
            })

            const messageWithNumericSender = {
                ...mockOwnMessage,
                sender: {
                    ...mockOwnMessage.sender,
                    id: '123',
                },
            }

            const wrapper = mount(Message, {
                props: {
                    message: messageWithNumericSender,
                },
            })

            // Should be treated as own message
            expect(wrapper.find('.flex').classes()).toContain('justify-end')
        })
    })
})
