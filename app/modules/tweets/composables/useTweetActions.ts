import { inject, type Ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { useConfirmation } from '~/modules/profile/composables/useConfirmation'
import type { useSnackbar } from '~/modules/profile/composables/useSnackbar'
import { useDeleteTweetMutation, useUpdateTweetMutation } from '../queries/useTweetQueries'

export function useTweetActions(tweetId: Ref<string>) {
    const { t } = useI18n()

    const { showSnackbar, handleShowSnackbar } = inject('snackbar') as ReturnType<
        typeof useSnackbar
    >
    const { showConfirmation, handleShowConfirmation } = inject('confirmation') as ReturnType<
        typeof useConfirmation
    >

    // Use the mutation queries
    const tweetIdValue = computed(() => tweetId.value)
    const deleteMutation = useDeleteTweetMutation(tweetIdValue.value)
    const updateMutation = useUpdateTweetMutation(tweetIdValue.value)

    // Handle delete with confirmation dialog
    function handleDeleteWithConfirmation(showList?: Ref<boolean>) {
        if (showList) showList.value = false

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
    async function handleUpdateWithSnackbar(content: string, showList?: Ref<boolean>) {
        try {
            await updateMutation.mutateAsync(content)
            handleShowSnackbar(t('tweets.tweetUpdated'))
        } catch (error) {
            console.error('Failed to update tweet:', error)
        }
        if (showList) showList.value = false
    }

    return {
        deleteTweet: deleteMutation.mutateAsync,
        updateTweet: updateMutation.mutateAsync,
        isDeleteLoading: deleteMutation.isPending,
        isUpdateLoading: updateMutation.isPending,
        handleDeleteWithConfirmation,
        handleUpdateWithSnackbar,
        showSnackbar,
        showConfirmation,
    }
}
