import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

import { useTweetActions } from '../../composables/useTweetActions'

const mockHandleShowSnackbar = vi.fn()
const mockHandleShowConfirmation = vi.fn()
const mockDeleteMutateAsync = vi.fn()
const mockUpdateMutateAsync = vi.fn()

// Mock vue's inject function
vi.mock('vue', async (importOriginal) => {
    const actual = (await importOriginal()) as any
    return {
        ...actual,
        inject: vi.fn((key: string) => {
            if (key === 'snackbar') {
                return {
                    showSnackbar: actual.ref(false),
                    handleShowSnackbar: mockHandleShowSnackbar,
                }
            }
            if (key === 'confirmation') {
                return {
                    showConfirmation: actual.ref(false),
                    handleShowConfirmation: mockHandleShowConfirmation,
                }
            }
            return undefined
        }),
    }
})

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
    useI18n: vi.fn(() => ({
        t: (key: string) => key,
        locale: 'en',
    })),
}))

// Mock vue-router
vi.mock('vue-router', () => ({
    useRouter: vi.fn(() => ({
        back: vi.fn(),
        push: vi.fn(),
    })),
}))

// Mock vue-query
vi.mock('@tanstack/vue-query', () => ({
    useQueryClient: vi.fn(() => ({
        invalidateQueries: vi.fn(),
        setQueryData: vi.fn(),
        getQueryData: vi.fn(),
    })),
}))

// Mock cache invalidation
vi.mock('~/modules/Common/queries', () => ({
    cacheInvalidation: {
        onReplyCreate: vi.fn(),
        invalidateTweetQueries: vi.fn(),
    },
}))

// Mock mutation queries
vi.mock('../../queries/useTweetQueries', () => ({
    useDeleteTweetMutation: vi.fn(() => ({
        mutateAsync: mockDeleteMutateAsync,
        isPending: ref(false),
    })),
    useUpdateTweetMutation: vi.fn(() => ({
        mutateAsync: mockUpdateMutateAsync,
        isPending: ref(false),
    })),
}))

describe('useTweetActions composable', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockDeleteMutateAsync.mockResolvedValue(undefined)
        mockUpdateMutateAsync.mockResolvedValue(undefined)
    })

    describe('Initialization', () => {
        it('returns expected properties and methods', () => {
            const tweetId = ref('tweet123')
            const result = useTweetActions(tweetId)

            expect(result).toHaveProperty('deleteTweet')
            expect(result).toHaveProperty('updateTweet')
            expect(result).toHaveProperty('isDeleteLoading')
            expect(result).toHaveProperty('isUpdateLoading')
            expect(result).toHaveProperty('showEditModal')
            expect(result).toHaveProperty('handleEdit')
            expect(result).toHaveProperty('handleSaveEdit')
            expect(result).toHaveProperty('handleCloseEditModal')
            expect(result).toHaveProperty('handleDeleteWithConfirmation')
            expect(result).toHaveProperty('handleUpdateWithSnackbar')
        })

        it('initializes with showEditModal as false', () => {
            const tweetId = ref('tweet123')
            const result = useTweetActions(tweetId)

            expect(result.showEditModal.value).toBe(false)
        })

        it('accepts optional parentTweetId parameter', () => {
            const tweetId = ref('tweet123')
            const parentTweetId = ref('parent456')
            const result = useTweetActions(tweetId, parentTweetId)

            expect(result).toBeDefined()
        })
    })

    describe('handleEdit', () => {
        it('sets showEditModal to true', () => {
            const tweetId = ref('tweet123')
            const result = useTweetActions(tweetId)

            result.handleEdit()

            expect(result.showEditModal.value).toBe(true)
        })

        it('closes actions menu when provided', () => {
            const tweetId = ref('tweet123')
            const showActionsMenu = ref(true)
            const result = useTweetActions(tweetId)

            result.handleEdit(showActionsMenu)

            expect(showActionsMenu.value).toBe(false)
            expect(result.showEditModal.value).toBe(true)
        })
    })

    describe('handleCloseEditModal', () => {
        it('sets showEditModal to false', () => {
            const tweetId = ref('tweet123')
            const result = useTweetActions(tweetId)

            // First open the modal
            result.handleEdit()
            expect(result.showEditModal.value).toBe(true)

            // Then close it
            result.handleCloseEditModal()
            expect(result.showEditModal.value).toBe(false)
        })
    })

    describe('handleDeleteWithConfirmation', () => {
        it('calls handleShowConfirmation with correct parameters', () => {
            const tweetId = ref('tweet123')
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

        it('closes actions menu when provided', () => {
            const tweetId = ref('tweet123')
            const showActionsMenu = ref(true)
            const result = useTweetActions(tweetId)

            result.handleDeleteWithConfirmation(showActionsMenu)

            expect(showActionsMenu.value).toBe(false)
        })
    })

    describe('handleUpdateWithSnackbar', () => {
        it('calls updateMutation with content', async () => {
            const tweetId = ref('tweet123')
            const result = useTweetActions(tweetId)

            await result.handleUpdateWithSnackbar('Updated content')

            expect(mockUpdateMutateAsync).toHaveBeenCalledWith('Updated content')
        })

        it('shows snackbar on success', async () => {
            const tweetId = ref('tweet123')
            const result = useTweetActions(tweetId)

            await result.handleUpdateWithSnackbar('Updated content')

            expect(mockHandleShowSnackbar).toHaveBeenCalledWith('tweets.tweetUpdated')
        })

        it('closes actions menu when provided', async () => {
            const tweetId = ref('tweet123')
            const showActionsMenu = ref(true)
            const result = useTweetActions(tweetId)

            await result.handleUpdateWithSnackbar('Updated content', showActionsMenu)

            expect(showActionsMenu.value).toBe(false)
        })
    })

    describe('handleSaveEdit', () => {
        it('calls handleUpdateWithSnackbar and closes modal', async () => {
            const tweetId = ref('tweet123')
            const result = useTweetActions(tweetId)

            // Open modal first
            result.handleEdit()
            expect(result.showEditModal.value).toBe(true)

            // Save edit
            await result.handleSaveEdit('New content')

            // Modal should be closed
            expect(result.showEditModal.value).toBe(false)
        })
    })

    describe('Loading states', () => {
        it('isDeleteLoading is initially false', () => {
            const tweetId = ref('tweet123')
            const result = useTweetActions(tweetId)

            expect(result.isDeleteLoading.value).toBe(false)
        })

        it('isUpdateLoading is initially false', () => {
            const tweetId = ref('tweet123')
            const result = useTweetActions(tweetId)

            expect(result.isUpdateLoading.value).toBe(false)
        })
    })
})
