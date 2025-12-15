import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import ChatList from '../../components/ChatList/ChatList.vue'
import type { Conversation } from '../../types'

// Mock ConversationItem component
vi.mock('../../components/ChatList/subComponents/ConversationItem/ConversationItem.vue', () => ({
    default: {
        name: 'ConversationItem',
        props: ['conversation', 'isSelected'],
        template:
            '<div class="conversation-item" @click="$emit(\'click\')">{{ conversation.id }}</div>',
    },
}))

// Mock LoadingSpinner
vi.mock('~/modules/Common/components/Loading/LoadingSpinner.vue', () => ({
    default: {
        name: 'LoadingSpinner',
        template: '<div class="loading-spinner">Loading...</div>',
    },
}))

// Mock lucide-vue-next
vi.mock('lucide-vue-next', () => ({
    MessageSquarePlus: {
        name: 'MessageSquarePlus',
        template: '<svg class="message-square-plus"></svg>',
    },
}))

// Mock useGetConversation
const mockFetchNextPage = vi.fn()
const mockConversationsData = ref({
    pages: [
        {
            data: [
                {
                    id: 'chat-1',
                    participant: {
                        id: 'user-1',
                        username: 'john',
                        name: 'John Doe',
                        avatar_url: 'avatar1.jpg',
                    },
                    last_message: {
                        id: 'msg-1',
                        content: 'Hello',
                        message_type: 'text' as const,
                        sender: {
                            id: 'user-1',
                            username: 'john',
                            name: 'John Doe',
                            avatar_url: 'avatar1.jpg',
                        },
                        reply_to: null,
                        is_read: false,
                        is_edited: false,
                        created_at: '2024-01-01T10:00:00Z',
                        updated_at: '2024-01-01T10:00:00Z',
                    },
                    unread_count: 2,
                    created_at: '2024-01-01T09:00:00Z',
                    updated_at: '2024-01-01T10:00:00Z',
                },
                {
                    id: 'chat-2',
                    participant: {
                        id: 'user-2',
                        username: 'jane',
                        name: 'Jane Smith',
                        avatar_url: null,
                    },
                    last_message: {
                        id: 'msg-2',
                        content: 'Hi there',
                        message_type: 'text' as const,
                        sender: {
                            id: 'user-2',
                            username: 'jane',
                            name: 'Jane Smith',
                            avatar_url: null,
                        },
                        reply_to: null,
                        is_read: true,
                        is_edited: false,
                        created_at: '2024-01-01T11:00:00Z',
                        updated_at: '2024-01-01T11:00:00Z',
                    },
                    unread_count: 0,
                    created_at: '2024-01-01T09:00:00Z',
                    updated_at: '2024-01-01T11:00:00Z',
                },
            ],
        },
    ],
})
const mockIsFetching = ref(false)
const mockHasNextPage = ref(false)

vi.mock('~/modules/chat/queries/useGetConversation', () => ({
    useGetConversation: vi.fn(() => ({
        data: mockConversationsData,
        isFetching: mockIsFetching,
        fetchNextPage: mockFetchNextPage,
        hasNextPage: mockHasNextPage,
    })),
}))

// Mock useAddConversation
vi.mock('~/modules/chat/queries/useAddConversation', () => ({
    useAddConversation: vi.fn(() => ({
        mutateAsync: vi.fn(),
        isPending: ref(false),
    })),
}))

// Mock @vueuse/core
const mockUseIntersectionObserver = vi.fn()
vi.mock('@vueuse/core', () => ({
    useIntersectionObserver: (...args: any[]) => mockUseIntersectionObserver(...args),
}))

// Mock router and Nuxt app
const mockPush = vi.fn()
const mockRouter = {
    push: mockPush,
    currentRoute: {
        value: {
            params: {
                chat_id: undefined,
            },
        },
    },
}
const mockTotalUnreadCount = ref(5)
const mockChatSocketService = {
    totalUnreadCount: mockTotalUnreadCount,
}

vi.stubGlobal('useRouter', () => mockRouter)
vi.stubGlobal('useNuxtApp', () => ({
    $chatSocketService: mockChatSocketService,
}))

// Mock nuxt/app imports to prevent module resolution errors
vi.mock('nuxt/app', () => ({
    useRouter: () => mockRouter,
    useNuxtApp: () => ({
        $chatSocketService: mockChatSocketService,
    }),
}))

// Mock i18n
const mockT = vi.fn((key: string) => {
    const translations: Record<string, string> = {
        'chat.messages': 'Messages',
        'chat.noMessagesYet': 'No messages yet',
        'chat.noMessagesYetDescription': 'Start a conversation',
    }
    return translations[key] || key
})

describe('ChatList Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockConversationsData.value = {
            pages: [
                {
                    data: [
                        {
                            id: 'chat-1',
                            participant: {
                                id: 'user-1',
                                username: 'john',
                                name: 'John Doe',
                                avatar_url: 'avatar1.jpg',
                            },
                            last_message: {
                                id: 'msg-1',
                                content: 'Hello',
                                message_type: 'text',
                                sender: {
                                    id: 'user-1',
                                    username: 'john',
                                    name: 'John Doe',
                                    avatar_url: 'avatar1.jpg',
                                },
                                reply_to: null,
                                is_read: false,
                                is_edited: false,
                                created_at: '2024-01-01T10:00:00Z',
                                updated_at: '2024-01-01T10:00:00Z',
                            },
                            unread_count: 2,
                            created_at: '2024-01-01T09:00:00Z',
                            updated_at: '2024-01-01T10:00:00Z',
                        },
                        {
                            id: 'chat-2',
                            participant: {
                                id: 'user-2',
                                username: 'jane',
                                name: 'Jane Smith',
                                avatar_url: null,
                            },
                            last_message: {
                                id: 'msg-2',
                                content: 'Hi there',
                                message_type: 'text',
                                sender: {
                                    id: 'user-2',
                                    username: 'jane',
                                    name: 'Jane Smith',
                                    avatar_url: null,
                                },
                                reply_to: null,
                                is_read: true,
                                is_edited: false,
                                created_at: '2024-01-01T11:00:00Z',
                                updated_at: '2024-01-01T11:00:00Z',
                            },
                            unread_count: 0,
                            created_at: '2024-01-01T09:00:00Z',
                            updated_at: '2024-01-01T11:00:00Z',
                        },
                    ],
                },
            ],
        }
        mockIsFetching.value = false
        mockHasNextPage.value = false
        mockTotalUnreadCount.value = 5
    })

    describe('Header', () => {
        it('should render the header with Messages title', () => {
            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            expect(wrapper.text()).toContain('Messages')
            expect(mockT).toHaveBeenCalledWith('chat.messages')
        })

        it('should have container for unread count badge', () => {
            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            // Just verify the header structure exists where badge would appear
            const header = wrapper.find('.p-3.flex.items-center.justify-between')
            expect(header.exists()).toBe(true)
        })

        it('should render title and button in header', () => {
            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            expect(wrapper.text()).toContain('Messages')
            const newChatButton = wrapper.find('#new-chat-button')
            expect(newChatButton.exists()).toBe(true)
        })

        it('should render new chat button', () => {
            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const button = wrapper.find('#new-chat-button')
            expect(button.exists()).toBe(true)
        })

        it('should have sticky header with backdrop blur', () => {
            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const header = wrapper.find('.sticky.top-0.bg-primary\\/80.backdrop-blur-md')
            expect(header.exists()).toBe(true)
        })
    })

    describe('Conversation List', () => {
        it('should render all conversations', () => {
            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const conversations = wrapper.findAll('.conversation-item')
            expect(conversations).toHaveLength(2)
        })

        it('should pass correct props to ConversationItem', () => {
            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const firstConversation = wrapper.findAllComponents({ name: 'ConversationItem' })[0]
            expect(firstConversation.props('conversation').id).toBe('chat-1')
            expect(firstConversation.props('isSelected')).toBe(false)
        })

        it('should mark conversation as selected when selectedChatId matches', () => {
            const wrapper = mount(ChatList, {
                props: {
                    selectedChatId: 'chat-1',
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const firstConversation = wrapper.findAllComponents({ name: 'ConversationItem' })[0]
            expect(firstConversation.props('isSelected')).toBe(true)

            const secondConversation = wrapper.findAllComponents({ name: 'ConversationItem' })[1]
            expect(secondConversation.props('isSelected')).toBe(false)
        })

        it('should handle selectedChatId as null', () => {
            const wrapper = mount(ChatList, {
                props: {
                    selectedChatId: null,
                },
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const conversations = wrapper.findAllComponents({ name: 'ConversationItem' })
            conversations.forEach((conv) => {
                expect(conv.props('isSelected')).toBe(false)
            })
        })

        it('should set correct id attribute on conversation items', () => {
            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const firstItem = wrapper.find('#conversation-item-chat-1')
            const secondItem = wrapper.find('#conversation-item-chat-2')

            expect(firstItem.exists()).toBe(true)
            expect(secondItem.exists()).toBe(true)
        })
    })

    describe('Conversation Selection', () => {
        it('should emit select-conversation event when conversation is clicked', async () => {
            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const conversation = mockConversationsData.value.pages[0].data[0]

            // Simulate click on first conversation item
            const firstItem = wrapper.findAll('.conversation-item')[0]
            await firstItem.trigger('click')

            expect(wrapper.emitted('select-conversation')).toBeTruthy()
            expect(wrapper.emitted('select-conversation')![0]).toEqual([conversation])
        })

        it('should emit correct conversation when different items are clicked', async () => {
            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const secondConversation = mockConversationsData.value.pages[0].data[1]
            const secondItem = wrapper.findAll('.conversation-item')[1]
            await secondItem.trigger('click')

            const emittedEvents = wrapper.emitted('select-conversation')
            expect(emittedEvents).toBeTruthy()
            expect(emittedEvents![0]).toEqual([secondConversation])
        })
    })

    describe('Empty State', () => {
        it('should display empty state when no conversations exist', () => {
            mockConversationsData.value = { pages: [{ data: [] }] }
            mockIsFetching.value = false

            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            expect(wrapper.text()).toContain('No messages yet')
            expect(wrapper.text()).toContain('Start a conversation')
            expect(mockT).toHaveBeenCalledWith('chat.noMessagesYet')
            expect(mockT).toHaveBeenCalledWith('chat.noMessagesYetDescription')
        })

        it('should not display empty state when conversations exist', () => {
            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const emptyState = wrapper.find('.flex.flex-col.items-center.justify-center.p-8')
            expect(emptyState.exists()).toBe(false)
        })

        it('should not display empty state when fetching', () => {
            mockConversationsData.value = { pages: [{ data: [] }] }
            mockIsFetching.value = true

            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const emptyStateText = wrapper
                .findAll('p')
                .filter((p) => p.text() === 'No messages yet')
            expect(emptyStateText.length).toBe(0)
        })
    })

    describe('Loading State', () => {
        it('should display loading spinner when fetching', () => {
            mockIsFetching.value = true

            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const spinner = wrapper.findComponent({ name: 'LoadingSpinner' })
            expect(spinner.exists()).toBe(true)
        })

        it('should not display loading spinner when not fetching', () => {
            mockIsFetching.value = false

            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const spinner = wrapper.findComponent({ name: 'LoadingSpinner' })
            expect(spinner.exists()).toBe(false)
        })
    })

    describe('Infinite Scroll', () => {
        it('should render sentinel element when hasNextPage is true and not fetching', () => {
            mockHasNextPage.value = true
            mockIsFetching.value = false

            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            // Sentinel should exist
            expect(wrapper.vm.$refs.sentinelRef).toBeDefined()
        })

        it('should not render sentinel element when hasNextPage is false', () => {
            mockHasNextPage.value = false
            mockIsFetching.value = false

            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const sentinel = wrapper.find('.h-1')
            expect(sentinel.exists()).toBe(false)
        })

        it('should not render sentinel element when fetching', () => {
            mockHasNextPage.value = true
            mockIsFetching.value = true

            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const sentinel = wrapper.find('.h-1')
            expect(sentinel.exists()).toBe(false)
        })

        it('should set up intersection observer', () => {
            mockHasNextPage.value = true

            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            expect(mockUseIntersectionObserver).toHaveBeenCalled()
            const [sentinelRef, callback, options] = mockUseIntersectionObserver.mock.calls[0]

            // Verify options
            expect(options.rootMargin).toBe('100px')
        })

        it('should call fetchNextPage when sentinel intersects and conditions are met', () => {
            mockHasNextPage.value = true
            mockIsFetching.value = false

            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            // Get the callback from useIntersectionObserver
            const callback = mockUseIntersectionObserver.mock.calls[0][1]

            // Simulate intersection
            callback([{ isIntersecting: true }])

            expect(mockFetchNextPage).toHaveBeenCalled()
        })

        it('should not call fetchNextPage when not intersecting', () => {
            mockHasNextPage.value = true
            mockIsFetching.value = false

            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const callback = mockUseIntersectionObserver.mock.calls[0][1]
            callback([{ isIntersecting: false }])

            expect(mockFetchNextPage).not.toHaveBeenCalled()
        })

        it('should not call fetchNextPage when already fetching', () => {
            mockHasNextPage.value = true
            mockIsFetching.value = true

            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const callback = mockUseIntersectionObserver.mock.calls[0][1]
            callback([{ isIntersecting: true }])

            expect(mockFetchNextPage).not.toHaveBeenCalled()
        })

        it('should not call fetchNextPage when no next page', () => {
            mockHasNextPage.value = false
            mockIsFetching.value = false

            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const callback = mockUseIntersectionObserver.mock.calls[0][1]
            callback([{ isIntersecting: true }])

            expect(mockFetchNextPage).not.toHaveBeenCalled()
        })
    })

    describe('Computed Properties', () => {
        it('should flatten conversations from all pages', () => {
            mockConversationsData.value = {
                pages: [
                    {
                        data: [
                            {
                                id: 'chat-1',
                                participant: {
                                    id: 'user-1',
                                    username: 'john',
                                    name: 'John Doe',
                                    avatar_url: 'avatar1.jpg',
                                },
                                last_message: undefined,
                                unread_count: 0,
                                created_at: '2024-01-01T09:00:00Z',
                                updated_at: '2024-01-01T10:00:00Z',
                            },
                        ],
                    },
                    {
                        data: [
                            {
                                id: 'chat-2',
                                participant: {
                                    id: 'user-2',
                                    username: 'jane',
                                    name: 'Jane Smith',
                                    avatar_url: null,
                                },
                                last_message: undefined,
                                unread_count: 0,
                                created_at: '2024-01-01T09:00:00Z',
                                updated_at: '2024-01-01T11:00:00Z',
                            },
                        ],
                    },
                ],
            }

            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const conversations = wrapper.findAllComponents({ name: 'ConversationItem' })
            expect(conversations).toHaveLength(2)
        })

        it('should return empty array when data is undefined', () => {
            mockConversationsData.value = undefined as any

            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const conversations = wrapper.findAllComponents({ name: 'ConversationItem' })
            expect(conversations).toHaveLength(0)
        })
    })

    describe('Layout and Styling', () => {
        it('should have scrollable container', () => {
            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const scrollContainer = wrapper.find('#chat-list-scroll-container')
            expect(scrollContainer.exists()).toBe(true)
            expect(scrollContainer.classes()).toContain('overflow-y-auto')
            expect(scrollContainer.classes()).toContain('flex-1')
        })

        it('should have full height flex layout', () => {
            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const container = wrapper.find('.flex.flex-col.h-full')
            expect(container.exists()).toBe(true)
        })

        it('should have border on the right', () => {
            const wrapper = mount(ChatList, {
                global: {
                    mocks: {
                        $t: mockT,
                    },
                },
            })

            const container = wrapper.find('.border-r.border-primary')
            expect(container.exists()).toBe(true)
        })
    })
})
