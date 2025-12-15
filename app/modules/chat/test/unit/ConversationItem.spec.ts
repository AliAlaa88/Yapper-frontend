import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ConversationItem from '../../components/ChatList/subComponents/ConversationItem/ConversationItem.vue'
import type { Conversation } from '../../types'

// Mock utility functions
vi.mock('~/utils/helpers', () => ({
    shorterName: (name: string) => {
        if (name.length > 15) {
            return name.substring(0, 15) + '...'
        }
        return name
    },
    formatConversationDate: (date: string) => {
        if (!date) return ''
        const d = new Date(date)
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    },
}))

// Mock i18n composable
const mockT = vi.fn((key: string) => {
    const translations: Record<string, string> = {
        'chat.noMessagesYet': 'No messages yet',
        'chat.noMessagesYet2': 'No messages yet',
        'chat.youSentImage': 'You sent an image',
        'chat.imageSentToYou': 'Image sent to you',
        'chat.youSentVoice': 'You sent a voice message',
        'chat.voiceSentToYou': 'Voice message sent to you',
    }
    return translations[key] || key
})

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: mockT,
        locale: 'en',
    }),
}))

describe('ConversationItem Component', () => {
    const mockConversation: Conversation = {
        id: 'chat-1',
        participant: {
            id: 'user-1',
            username: 'johndoe',
            name: 'John Doe',
            avatar_url: 'https://example.com/avatar.jpg',
        },
        last_message: {
            id: 'msg-1',
            content: 'Hey, how are you?',
            message_type: 'text',
            sender: {
                id: 'user-1',
                username: 'johndoe',
                name: 'John Doe',
                avatar_url: 'https://example.com/avatar.jpg',
            },
            reply_to: null,
            is_read: false,
            is_edited: false,
            created_at: '2024-01-01T12:00:00Z',
            updated_at: '2024-01-01T12:00:00Z',
        },
        unread_count: 2,
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T12:00:00Z',
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Avatar Display', () => {
        it('should display avatar image when avatar_url is provided', () => {
            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: mockConversation,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const avatarImg = wrapper.find('img')
            expect(avatarImg.exists()).toBe(true)
            expect(avatarImg.attributes('src')).toBe('https://example.com/avatar.jpg')
            expect(avatarImg.attributes('alt')).toBe('johndoe')
        })

        it('should have fallback avatar URL available in template', () => {
            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: mockConversation,
                },
            })

            // The component renders one img with the provided avatar_url
            // and has a fallback to ui-avatars when avatar_url is null
            const avatarImg = wrapper.find('img')
            expect(avatarImg.exists()).toBe(true)
            expect(avatarImg.attributes('src')).toBe('https://example.com/avatar.jpg')
            // Verify the fallback mechanism exists for when avatar_url is null
            const conversationNoAvatar = { ...mockConversation, participant: { ...mockConversation.participant, avatar_url: null } }
            const wrapper2 = mount(ConversationItem, { props: { conversation: conversationNoAvatar } })
            const fallbackImg = wrapper2.find('img')
            expect(fallbackImg.attributes('src')).toContain('ui-avatars.com')
            expect(fallbackImg.attributes('src')).toContain(encodeURIComponent('John Doe'))
        })

        it('should display ui-avatars when avatar_url is null', () => {
            const conversationNoAvatar: Conversation = {
                ...mockConversation,
                participant: {
                    ...mockConversation.participant,
                    avatar_url: null,
                },
            }

            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: conversationNoAvatar,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const images = wrapper.findAll('img')
            const fallbackImg = images[0]
            expect(fallbackImg.attributes('src')).toContain('ui-avatars.com')
            expect(fallbackImg.attributes('src')).toContain(encodeURIComponent('John Doe'))
        })

        it('should apply correct avatar styling', () => {
            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: mockConversation,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const avatarImg = wrapper.find('img')
            expect(avatarImg.classes()).toContain('w-12')
            expect(avatarImg.classes()).toContain('h-12')
            expect(avatarImg.classes()).toContain('rounded-full')
            expect(avatarImg.classes()).toContain('object-cover')
        })
    })

    describe('Participant Information', () => {
        it('should display participant name', () => {
            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: mockConversation,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            expect(wrapper.text()).toContain('John Doe')
        })

        it('should display participant username with @ prefix', () => {
            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: mockConversation,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            expect(wrapper.text()).toContain('@johndoe')
        })

        it('should shorten long names', () => {
            const conversationLongName: Conversation = {
                ...mockConversation,
                participant: {
                    ...mockConversation.participant,
                    name: 'This is a very long name that should be shortened',
                },
            }

            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: conversationLongName,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            expect(wrapper.text()).toContain('This is a very ...')
        })

        it('should apply bold styling to participant name', () => {
            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: mockConversation,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const nameElement = wrapper.find('.font-bold.text-primary')
            expect(nameElement.exists()).toBe(true)
            expect(nameElement.text()).toContain('John Doe')
        })
    })

    describe('Last Message Display', () => {
        it('should display last message content when available', () => {
            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: mockConversation,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            expect(wrapper.text()).toContain('Hey, how are you?')
        })

        it('should display "No messages yet" when last_message is null', () => {
            const conversationNoMessage: Conversation = {
                ...mockConversation,
                last_message: undefined,
            }

            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: conversationNoMessage,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            expect(wrapper.text()).toContain('No messages yet')
            expect(mockT).toHaveBeenCalledWith('chat.noMessagesYet')
        })

        it('should apply bold styling when unread_count > 0', () => {
            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: mockConversation,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const messageText = wrapper.find('p.font-bold.text-primary')
            expect(messageText.exists()).toBe(true)
            expect(messageText.text()).toBe('Hey, how are you?')
        })

        it('should apply secondary text styling when unread_count is 0', () => {
            const conversationNoUnread: Conversation = {
                ...mockConversation,
                unread_count: 0,
            }

            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: conversationNoUnread,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const messageText = wrapper.find('p.text-secondary')
            expect(messageText.exists()).toBe(true)
            expect(messageText.classes()).not.toContain('font-bold')
        })

        it('should truncate long messages', () => {
            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: mockConversation,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const messageText = wrapper.find('p')
            expect(messageText.classes()).toContain('truncate')
        })
    })

    describe('Timestamp Display', () => {
        it('should display formatted last message date', () => {
            const conversationWithDate: Conversation = {
                ...mockConversation,
            }

            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: conversationWithDate,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            // The formatConversationDate should be called and rendered
            const dateElements = wrapper.findAll('.text-secondary.text-sm')
            expect(dateElements.length).toBeGreaterThan(0)
        })

        it('should handle empty date gracefully', () => {
            const conversationNoDate: Conversation = {
                ...mockConversation,
                last_message: undefined,
            }

            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: conversationNoDate,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            expect(wrapper.exists()).toBe(true)
        })
    })

    describe('Unread Count Badge', () => {
        it('should display unread badge when unread_count > 0', () => {
            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: mockConversation,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const badge = wrapper.find('.bg-accent.text-primary.text-xs.font-bold')
            expect(badge.exists()).toBe(true)
            expect(badge.text()).toBe('2')
        })

        it('should not display unread badge when unread_count is 0', () => {
            const conversationNoUnread: Conversation = {
                ...mockConversation,
                unread_count: 0,
            }

            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: conversationNoUnread,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const badge = wrapper.find('.bg-accent.text-primary.text-xs.font-bold')
            expect(badge.exists()).toBe(false)
        })

        it('should display correct unread count', () => {
            const conversationManyUnread: Conversation = {
                ...mockConversation,
                unread_count: 99,
            }

            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: conversationManyUnread,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const badge = wrapper.find('.bg-accent')
            expect(badge.text()).toBe('99')
        })

        it('should apply correct badge styling', () => {
            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: mockConversation,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const badge = wrapper.find('.bg-accent')
            expect(badge.classes()).toContain('rounded-full')
            expect(badge.classes()).toContain('font-bold')
            expect(badge.classes()).toContain('text-xs')
        })
    })

    describe('Selection State', () => {
        it('should apply selected styling when isSelected is true', () => {
            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: mockConversation,
                    isSelected: true,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const container = wrapper.find('div')
            expect(container.classes()).toContain('bg-hover')
            expect(container.classes()).toContain('border-r-3')
            expect(container.classes()).toContain('border-accent')
        })

        it('should not apply selected styling when isSelected is false', () => {
            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: mockConversation,
                    isSelected: false,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const container = wrapper.find('div')
            expect(container.classes()).not.toContain('border-r-3')
            expect(container.classes()).not.toContain('border-accent')
        })

        it('should not apply selected styling when isSelected is undefined', () => {
            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: mockConversation,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const container = wrapper.find('div')
            expect(container.classes()).not.toContain('border-r-3')
            expect(container.classes()).not.toContain('border-accent')
        })
    })

    describe('Hover and Cursor Styles', () => {
        it('should apply hover styling classes', () => {
            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: mockConversation,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const container = wrapper.find('div')
            expect(container.classes()).toContain('hover:bg-hover')
            expect(container.classes()).toContain('cursor-pointer')
            expect(container.classes()).toContain('transition-colors')
        })
    })

    describe('Layout and Structure', () => {
        it('should have correct flex layout', () => {
            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: mockConversation,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const container = wrapper.find('div')
            expect(container.classes()).toContain('flex')
            expect(container.classes()).toContain('items-center')
            expect(container.classes()).toContain('gap-3')
            expect(container.classes()).toContain('p-3')
        })

        it('should have shrink-0 on avatar container', () => {
            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: mockConversation,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const avatarContainer = wrapper.findAll('div')[1]
            expect(avatarContainer.classes()).toContain('shrink-0')
        })

        it('should have flex-1 min-w-0 on content container', () => {
            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: mockConversation,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const contentContainer = wrapper.findAll('div')[2]
            expect(contentContainer.classes()).toContain('flex-1')
            expect(contentContainer.classes()).toContain('min-w-0')
        })
    })

    describe('Edge Cases', () => {
        it('should handle conversation with empty string as last_message', () => {
            const conversationEmptyMessage: Conversation = {
                ...mockConversation,
                last_message: {
                    ...mockConversation.last_message!,
                    content: '',
                },
            }

            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: conversationEmptyMessage,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            expect(wrapper.text()).toContain('No messages yet')
        })

        it('should handle very long username', () => {
            const conversationLongUsername: Conversation = {
                ...mockConversation,
                participant: {
                    ...mockConversation.participant,
                    username: 'verylongusernamethatmightbreakthelayout',
                },
            }

            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: conversationLongUsername,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            expect(wrapper.text()).toContain('@verylongusernamethatmightbreakthelayout')
        })

        it('should handle special characters in participant name', () => {
            const conversationSpecialChars: Conversation = {
                ...mockConversation,
                participant: {
                    ...mockConversation.participant,
                    name: "O'Brien & Smith",
                },
            }

            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: conversationSpecialChars,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            expect(wrapper.text()).toContain("O'Brien & Smith")
        })

        it('should handle unread_count of 1', () => {
            const conversationOneUnread: Conversation = {
                ...mockConversation,
                unread_count: 1,
            }

            const wrapper = mount(ConversationItem, {
                props: {
                    conversation: conversationOneUnread,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const badge = wrapper.find('.bg-accent')
            expect(badge.exists()).toBe(true)
            expect(badge.text()).toBe('1')
        })
    })
})
