<template>
    <div class="flex flex-col h-full w-full">
        <div class="flex-1 overflow-y-auto min-h-0 -mx-4 px-4">
            <InfiniteList
                v-model:load-more-trigger="loadMoreTrigger"
                :items="items"
                :is-pending="isPending"
                :is-fetching="isFetching"
                :is-fetching-next-page="isFetchingNextPage"
                :error="error"
                :loading-text="loadingText"
                :error-text="errorText"
                :retry-text="retryText"
                :empty-title="emptyTitle"
                :empty-description="emptyDescription"
                @retry="refetch"
            >
                <template #default="{ items: users }">
                    <div
                        v-for="user in users as FollowUser[]"
                        :key="user.user_id"
                        :class="[
                            'flex items-center gap-3 p-3 transition-colors cursor-pointer rounded-lg',
                            selectedUserId === user.user_id
                                ? 'border-2 border-accent bg-accent/5'
                                : 'hover:bg-hover',
                        ]"
                        @click="selectUser(user.user_id)"
                    >
                        <NuxtImg
                            :src="
                                user?.avatar_url ||
                                'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)
                            "
                            :alt="user.name"
                            class="h-10 w-10 rounded-full object-cover shrink-0"
                        />
                        <div class="flex-1 min-w-0">
                            <p class="font-semibold text-primary truncate text-sm">
                                {{ shorterName(user.name) }}
                            </p>
                            <p class="text-xs text-muted truncate">
                                @{{ shorterName(user.username) }}
                            </p>
                        </div>
                    </div>
                </template>
            </InfiniteList>
        </div>

        <div
            v-if="selectedUserId"
            class="sticky bottom-0 bg-primary border-t border-primary p-3 mt-auto shrink-0 -mx-4 px-4"
        >
            <Button
                :button-text="$t('chat.createConversation.next')"
                :is-loading="isCreating"
                :loading-text="$t('chat.createConversation.creating')"
                button-class="w-full bg-accent text-white rounded-full py-2.5 px-4 font-semibold text-sm hover:bg-accent/90 transition-colors disabled:opacity-50"
                @click="handleNext"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, toRef } from 'vue'
import { useGenericInfiniteQuery } from '~/modules/Common/composables/useGenericInfiniteQuery'
import { InfiniteList } from '~/modules/Common/components/InfiniteList'
import Button from '~/modules/Common/components/Button/Button.vue'
import type { Page } from '~/modules/Common/types/pagination'
import type { FollowUser } from '~/modules/profile/types/user'
import { useAddConversation } from '~/modules/chat/queries/useAddConversation'
import { shorterName } from '~/utils/helpers'
import { useRouter } from 'vue-router'

interface Props {
    searchQuery: string
    loadingText?: string
    errorText?: string
    retryText?: string
    emptyTitle?: string
    emptyDescription?: string
}

const props = withDefaults(defineProps<Props>(), {
    loadingText: 'Loading...',
    errorText: 'Failed to load',
    retryText: 'Try again',
    emptyTitle: 'No users found',
    emptyDescription: 'Try searching for a different username',
})

const emit = defineEmits<{
    (e: 'close'): void
}>()

const router = useRouter()

const selectedUserId = ref<string | null>(null)
const { $listService } = useNuxtApp()
const { mutateAsync: createConversation, isPending: isCreating } = useAddConversation()

const fetchingSource = computed(() => {
    if (!props.searchQuery.trim()) return null
    return `/search/users?query=${encodeURIComponent(props.searchQuery)}`
})

const { items, isFetching, error, refetch, isFetchingNextPage, isPending, loadMoreTrigger } =
    useGenericInfiniteQuery<Page<FollowUser>, FollowUser>({
        queryKey: computed(() => ['create-conversation-users', fetchingSource.value ?? '']),
        queryFn: ({ pageParam }) =>
            ($listService as any).fetchList(fetchingSource.value ?? '', pageParam),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        getPageData: (page) => page.data,
        enabled: computed(() => !!fetchingSource.value),
    })

const selectUser = (userId: string) => {
    selectedUserId.value = selectedUserId.value === userId ? null : userId
}

const handleNext = async () => {
    if (!selectedUserId.value) return

    try {
        const conversation = await createConversation(selectedUserId.value)
        const conversationId = conversation.id
        if (conversationId) {
            emit('close')
            router.push(`/messages/${conversationId}`)
        } else {
            router.push('/messages')
        }
    } catch (error) {
        console.error('Failed to create conversation:', error)
    }
}
</script>
