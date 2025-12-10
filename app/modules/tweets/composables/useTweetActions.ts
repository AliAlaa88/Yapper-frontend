import { inject, ref, type Ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { useConfirmation } from '~/modules/profile/composables/useConfirmation'
import type { useSnackbar } from '~/modules/profile/composables/useSnackbar'
import { useDeleteTweetMutation, useUpdateTweetMutation } from '../queries/useTweetQueries'
import { useRouter } from 'vue-router'
import { useQueryClient } from '@tanstack/vue-query'
import { cacheInvalidation } from '~/modules/Common/queries'

export function useTweetActions(
    tweetId: Ref<string | undefined>,
    parentTweetId?: Ref<string | undefined>,
) {
    const { t } = useI18n()

    const { showSnackbar, handleShowSnackbar } = inject('snackbar') as ReturnType<
        typeof useSnackbar
    >
    const { showConfirmation, handleShowConfirmation } = inject('confirmation') as ReturnType<
        typeof useConfirmation
    >
    const router = useRouter()
    const queryClient = useQueryClient()
    // Use the mutation queries
    const tweetIdValue = computed(() => tweetId.value ?? '')
    const deleteMutation = useDeleteTweetMutation(tweetIdValue.value)
    const updateMutation = useUpdateTweetMutation(tweetIdValue.value)

    // Edit modal state
    const showEditModal = ref(false)

    // Handle edit - opens modal and closes actions menu
    function handleEdit(showActionsMenu?: Ref<boolean>) {
        if (showActionsMenu) showActionsMenu.value = false
        showEditModal.value = true
    }

    // Handle save edit - updates tweet and closes modal
    async function handleSaveEdit(content: string) {
        await handleUpdateWithSnackbar(content)
        showEditModal.value = false
        // Refetch replies to show updated content
        if (tweetId.value) {
            console.log('Invalidating replies cache for tweet:', tweetId.value)
            cacheInvalidation.onReplyCreate(queryClient, tweetId.value, '')
        }
        // Also invalidate parent tweet's replies if available
        if (parentTweetId?.value) {
            console.log('Invalidating parent tweet replies cache:', parentTweetId.value)
            cacheInvalidation.onReplyCreate(queryClient, parentTweetId.value, '')
        }
    }

    // Handle close edit modal
    function handleCloseEditModal() {
        showEditModal.value = false
    }

    // Handle delete with confirmation dialog
    function handleDeleteWithConfirmation(showActionsMenu?: Ref<boolean>) {
        if (showActionsMenu) showActionsMenu.value = false

        async function handleClick() {
            try {
                await deleteMutation.mutateAsync()
                handleShowSnackbar(t('tweets.tweetDeleted'))
            } catch (error) {
                console.error('Failed to delete tweet:', error)
            }
        }

        handleShowConfirmation(
            t('tweets.deleteTweet'),
            t('tweets.confirmDelete'),
            'bg-red',
            'text-primary',
            'hover:opacity-90',
            t('tweets.confirmDeleteDescription'),
            handleClick,
        )
    }

    // Handle update with snackbar
    async function handleUpdateWithSnackbar(content: string, showActionsMenu?: Ref<boolean>) {
        try {
            await updateMutation.mutateAsync(content)
            handleShowSnackbar(t('tweets.tweetUpdated'))
        } catch (error) {
            console.error('Failed to update tweet:', error)
        }
        if (showActionsMenu) showActionsMenu.value = false
    }

    return {
        // Mutations
        deleteTweet: deleteMutation.mutateAsync,
        updateTweet: updateMutation.mutateAsync,
        isDeleteLoading: deleteMutation.isPending,
        isUpdateLoading: updateMutation.isPending,
        // Edit modal state
        showEditModal,
        // Handlers
        handleEdit,
        handleSaveEdit,
        handleCloseEditModal,
        handleDeleteWithConfirmation,
        handleUpdateWithSnackbar,
        // Snackbar/Confirmation
        showSnackbar,
        showConfirmation,
    }
}
