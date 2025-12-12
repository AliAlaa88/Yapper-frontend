<template>
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
        :container-class="containerClass"
        :items-container-class="itemsContainerClass"
        @retry="refetch"
    >
        <template #default="{ items: users }">
            <slot name="default" :users="users" :items="users" />
        </template>

        <template v-if="$slots.empty" #empty>
            <slot name="empty" />
        </template>

        <template v-if="$slots.loading" #loading>
            <slot name="loading" />
        </template>

        <template v-if="$slots['loading-more']" #loading-more>
            <slot name="loading-more" />
        </template>

        <!-- <template v-if="$slots.error" #error="{ error: err, retry }">
            <slot name="error" :error="err" :retry="retry" />
        </template> -->
    </InfiniteList>
</template>

<script setup lang="ts" generic="T">
import { toRef, computed } from 'vue'
import { useGenericInfiniteQuery } from '~/modules/Common/composables/useGenericInfiniteQuery'
import { InfiniteList } from '~/modules/Common/components/InfiniteList'
import type { Page } from '~/modules/Common/types/pagination'

interface Props {
    fetchingSource?: string | null
    loadingText?: string
    errorText?: string
    retryText?: string
    emptyTitle?: string
    emptyDescription?: string
    containerClass?: string
    itemsContainerClass?: string
    queryKeyPrefix?: string
}

const props = withDefaults(defineProps<Props>(), {
    loadingText: 'Loading...',
    errorText: 'Failed to load',
    retryText: 'Try again',
    emptyTitle: 'Nothing here',
    emptyDescription: 'No items to display',
    containerClass: 'w-full',
    itemsContainerClass: 'w-full',
    queryKeyPrefix: 'users',
})

const fetchingSourceRef = toRef(props, 'fetchingSource')

const { $listService } = useNuxtApp()

// Use the generic infinite query composable
const {
    items,
    isFetching,
    error,
    refetch,
    isFetchingNextPage,
    isPending,
    loadMoreTrigger,
} = useGenericInfiniteQuery<Page<T>, T>({
    queryKey: computed(() => [props.queryKeyPrefix, fetchingSourceRef.value ?? '']),
    queryFn: ({ pageParam }) =>
        ($listService as any).fetchList(fetchingSourceRef.value ?? '', pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPageData: (page) => page.data,
})
</script>
