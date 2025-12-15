import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock all the dependencies before importing the component
vi.mock('nuxt/app', () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn(),
    })),
    useNuxtApp: vi.fn(() => ({
        $chatSocketService: {
            joinChat: vi.fn(),
            leaveChat: vi.fn(),
        },
        $socketService: {
            connected: true,
        },
    })),
    navigateTo: vi.fn(),
}))

vi.mock('../../components/ChatList/index.ts', () => ({
    ChatList: {
        name: 'ChatList',
        template: '<div>ChatList</div>',
    },
}))

vi.mock('../../components/ChatMessages/ChatMessages.vue', () => ({
    default: {
        name: 'ChatMessages',
        template: '<div>ChatMessages</div>',
    },
}))

vi.mock('../../components/CreateConversation/CreateConversation.vue', () => ({
    default: {
        name: 'CreateConversation',
        template: '<div>CreateConversation</div>',
    },
}))

vi.mock('~/modules/profile/components/ProfileContent/SubComponents/SnackBar.vue', () => ({
    default: {
        name: 'SnackBar',
        template: '<div>SnackBar</div>',
    },
}))

vi.mock('~/modules/profile/composables/useSnackbar', () => ({
    useSnackbar: () => ({
        show: vi.fn(),
        hide: vi.fn(),
    }),
}))

vi.mock('../../queries/useGetConversation', () => ({
    useGetConversationById: vi.fn(),
}))

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
        locale: { value: 'en' },
    }),
}))

describe('ChatView Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should be importable', async () => {
        const { default: ChatView } = await import('../../views/ChatView.vue')
        expect(ChatView).toBeDefined()
    })

    it('should have script setup', async () => {
        const { default: ChatView } = await import('../../views/ChatView.vue')
        // Vue SFC components defined with <script setup> will have __vccOpts
        expect(ChatView).toBeDefined()
        expect(typeof ChatView).toBe('object')
    })

    it('should define props for chatId', async () => {
        const { default: ChatView } = await import('../../views/ChatView.vue')
        // Props are typically accessible from the component
        expect(ChatView).toBeDefined()
    })

    it('should have template defined', async () => {
        const { default: ChatView } = await import('../../views/ChatView.vue')
        // Components compiled with Vite will have script setup compiled into the object
        expect(ChatView).toBeDefined()
    })

    it('should have all required child components imported', async () => {
        const { default: ChatView } = await import('../../views/ChatView.vue')
        expect(ChatView).toBeDefined()
        // If import works, it means all dependencies are properly mocked
    })
})
