import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed } from 'vue'

// Import after mocks are set up
import { useTweetActions } from '../../composables/useTweetActions'

// Mock all dependencies before importing
vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
    }),
}))

vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}))

const mockDeleteMutation = {
    mutateAsync: vi.fn(),
    isPending: ref(false),
}

const mockUpdateMutation = {
    mutateAsync: vi.fn(),
    isPending: ref(false),
}

vi.mock('../../queries/useTweetQueries', () => ({
    useDeleteTweetMutation: () => mockDeleteMutation,
    useUpdateTweetMutation: () => mockUpdateMutation,
}))

vi.mock('@tanstack/vue-query', () => ({
    useQueryClient: () => ({
        invalidateQueries: vi.fn(),
    }),
}))

vi.mock('~/modules/Common/queries', () => ({
    cacheInvalidation: {
        onReplyCreate: vi.fn(),
    },
}))

const mockShowSnackbar = ref(false)
const mockHandleShowSnackbar = vi.fn()
const mockShowConfirmation = ref(false)
const mockHandleShowConfirmation = vi.fn()

// Mock provide/inject
vi.mock('vue', async () => {
    const actual = await vi.importActual('vue')
    return {
        ...(actual as any),
        inject: (key: string) => {
            if (key === 'snackbar') {
                return {
                    showSnackbar: mockShowSnackbar,
                    handleShowSnackbar: mockHandleShowSnackbar,
                }
            }
            if (key === 'confirmation') {
                return {
                    showConfirmation: mockShowConfirmation,
                    handleShowConfirmation: mockHandleShowConfirmation,
                }
            }
            return undefined
        },
    }
})

describe('useTweetActions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockDeleteMutation.mutateAsync.mockResolvedValue({})
        mockUpdateMutation.mutateAsync.mockResolvedValue({})
    })

    describe('initialization', () => {
        it('returns all expected properties', () => {
            const tweetId = ref('tweet-123')
            const result = useTweetActions(tweetId)

            expect(result.deleteTweet).toBeDefined()
            expect(result.updateTweet).toBeDefined()
            expect(result.isDeleteLoading).toBeDefined()
            expect(result.isUpdateLoading).toBeDefined()
            expect(result.showEditModal).toBeDefined()
            expect(result.handleEdit).toBeDefined()
            expect(result.handleSaveEdit).toBeDefined()
            expect(result.handleCloseEditModal).toBeDefined()
            expect(result.handleDeleteWithConfirmation).toBeDefined()
            expect(result.handleUpdateWithSnackbar).toBeDefined()
        })

        it('initializes showEditModal as false', () => {
            const tweetId = ref('tweet-123')
            const result = useTweetActions(tweetId)

            expect(result.showEditModal.value).toBe(false)
        })
    })

    describe('handleEdit', () => {
        it('sets showEditModal to true', () => {
            const tweetId = ref('tweet-123')
            const result = useTweetActions(tweetId)

            result.handleEdit()

            expect(result.showEditModal.value).toBe(true)
        })

        it('closes actions menu when provided', () => {
            const tweetId = ref('tweet-123')
            const showActionsMenu = ref(true)
            const result = useTweetActions(tweetId)

            result.handleEdit(showActionsMenu)

            expect(showActionsMenu.value).toBe(false)
            expect(result.showEditModal.value).toBe(true)
        })
    })

    describe('handleCloseEditModal', () => {
        it('sets showEditModal to false', () => {
            const tweetId = ref('tweet-123')
            const result = useTweetActions(tweetId)

            // First open the modal
            result.handleEdit()
            expect(result.showEditModal.value).toBe(true)

            // Then close it
            result.handleCloseEditModal()
            expect(result.showEditModal.value).toBe(false)
        })
    })

    describe('handleSaveEdit', () => {
        it('calls updateMutation with content', async () => {
            const tweetId = ref('tweet-123')
            const result = useTweetActions(tweetId)

            await result.handleSaveEdit('Updated content')

            expect(mockUpdateMutation.mutateAsync).toHaveBeenCalledWith('Updated content')
        })

        it('closes edit modal after save', async () => {
            const tweetId = ref('tweet-123')
            const result = useTweetActions(tweetId)

            result.handleEdit() // Open modal
            await result.handleSaveEdit('Updated content')

            expect(result.showEditModal.value).toBe(false)
        })

        it('shows snackbar on success', async () => {
            const tweetId = ref('tweet-123')
            const result = useTweetActions(tweetId)

            await result.handleSaveEdit('Updated content')

            expect(mockHandleShowSnackbar).toHaveBeenCalledWith('tweets.tweetUpdated')
        })
    })

    describe('handleDeleteWithConfirmation', () => {
        it('closes actions menu when provided', () => {
            const tweetId = ref('tweet-123')
            const showActionsMenu = ref(true)
            const result = useTweetActions(tweetId)

            result.handleDeleteWithConfirmation(showActionsMenu)

            expect(showActionsMenu.value).toBe(false)
        })

        it('calls handleShowConfirmation with correct parameters', () => {
            const tweetId = ref('tweet-123')
            const result = useTweetActions(tweetId)

            result.handleDeleteWithConfirmation()

            expect(mockHandleShowConfirmation).toHaveBeenCalledWith(
                'tweets.deleteTweet',
                'tweets.confirmDelete',
                'bg-red',
                'text-primary',
                'hover:opacity-90',
                'tweets.confirmDeleteDescription',
                expect.any(Function),
            )
        })
    })

    describe('handleUpdateWithSnackbar', () => {
        it('calls updateMutation with content', async () => {
            const tweetId = ref('tweet-123')
            const result = useTweetActions(tweetId)

            await result.handleUpdateWithSnackbar('New content')

            expect(mockUpdateMutation.mutateAsync).toHaveBeenCalledWith('New content')
        })

        it('shows snackbar on success', async () => {
            const tweetId = ref('tweet-123')
            const result = useTweetActions(tweetId)

            await result.handleUpdateWithSnackbar('New content')

            expect(mockHandleShowSnackbar).toHaveBeenCalledWith('tweets.tweetUpdated')
        })

        it('closes actions menu when provided', async () => {
            const tweetId = ref('tweet-123')
            const showActionsMenu = ref(true)
            const result = useTweetActions(tweetId)

            await result.handleUpdateWithSnackbar('New content', showActionsMenu)

            expect(showActionsMenu.value).toBe(false)
        })

        it('handles errors gracefully', async () => {
            mockUpdateMutation.mutateAsync.mockRejectedValue(new Error('Update failed'))
            const tweetId = ref('tweet-123')
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            const result = useTweetActions(tweetId)

            await result.handleUpdateWithSnackbar('New content')

            expect(consoleSpy).toHaveBeenCalledWith('Failed to update tweet:', expect.any(Error))
            consoleSpy.mockRestore()
        })
    })

    describe('mutation properties', () => {
        it('exposes deleteTweet function', () => {
            const tweetId = ref('tweet-123')
            const result = useTweetActions(tweetId)

            expect(result.deleteTweet).toBe(mockDeleteMutation.mutateAsync)
        })

        it('exposes updateTweet function', () => {
            const tweetId = ref('tweet-123')
            const result = useTweetActions(tweetId)

            expect(result.updateTweet).toBe(mockUpdateMutation.mutateAsync)
        })
    })
})
