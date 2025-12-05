<template>
    <DetailedPanel :title="title">
        <div class="w-full text-primary">
            <div class="relative w-full border-b border-primary pb-4  px-5 py-2">
                <p class="text-muted text-[13px] mt-0.5">
                    {{ description }}
                </p>
            </div>
            <div
                v-if="query.isLoading.value"
                class="flex justify-center py-6">
                <div
                    class="animate-spin rounded-full h-5 w-5 border-2
                    border-accent border-t-transparent"
                />
            </div>
            <div v-else-if="query.isSuccess.value && users.length > 0">
                <UserAccountItem
                    v-for="user in users"
                    :key="user.user_id"
                    :account="user">
                    <SettingsBlockedButton :user-id="user.user_id" :is-blocked="user.is_blocked" />
                </UserAccountItem>
            </div>
            <div
                v-if="query.hasNextPage.value"
                ref="loadMore"
                class="flex justify-center py-4"
            >
                <div
                    v-if="query.isFetchingNextPage.value"
                    class="animate-spin rounded-full h-5 w-5 border-2
                    border-accent border-t-transparent"
                />
            </div>
            <div
                v-else-if="query.isSuccess.value && users.length === 0"
                class="flex justify-center"
            >
                <div class="flex flex-col justify-center text-left px-10 py-[60px]">
                    <h1 class="m-0 mb-2 text-4xl font-extrabold text-primary max-w-[300px]">
                        {{ emptyTitle }}
                    </h1>
                    <p class="m-0 max-w-[350px] text-[15px] leading-6 text-muted">
                        {{ emptyDescription }}
                    </p>
                </div>
            </div>
        </div>
    </DetailedPanel>
</template>

<script setup lang="ts">
import UserAccountItem from '~/modules/settings/components/MuteAndBlock/SubComponents/UserAccountItem.vue'
import DetailedPanel from '../../DetailedPanel.vue'
import SettingsBlockedButton from '~/modules/settings/components/MuteAndBlock/SubComponents/SettingsBlockedButton.vue'
import type { UseInfiniteQueryReturnType } from '@tanstack/vue-query'
import type { MutedAndBlockedListsApiResponse } from '../../../types/settings'

const props = defineProps<{
    title: string
    description: string
    emptyTitle: string
    emptyDescription: string
    query: UseInfiniteQueryReturnType<MutedAndBlockedListsApiResponse>
}>()

console.log('hahaga', props.query)
watch(() => props.query.data.value, (val) => {
    console.log('Blocked users response:', val)
})

watch(() => props.query.data.value, (val) => {
    console.log('Blocked users response:', val)
    if (val?.pages) {
        console.log('Total pages loaded:', val.pages.length)
        console.log('All pages:', val.pages)
    }
})

const users = computed(() =>
    props.query.data.value?.pages
        .flatMap(page => page.data.data) ?? [],
)

const loadMore = ref<HTMLElement | null>(null)

onMounted(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            const entry = entries[0]
            console.log('Intersection observed:', {
                isIntersecting: entry?.isIntersecting,
                hasNextPage: props.query.hasNextPage.value,
                isFetching: props.query.isFetchingNextPage.value,
            })

            if (
                entry?.isIntersecting &&
                props.query.hasNextPage.value &&
                !props.query.isFetchingNextPage.value
            ) {
                console.log('Fetching next page...')
                props.query.fetchNextPage()
            }
        },
        {
            threshold: 0.1,
            rootMargin: '100px',
        },
    )

    watch(loadMore, (newVal) => {
        if (newVal) {
            console.log('Observing loadMore')
            observer.observe(newVal)
        }
    }, { immediate: true })

    onUnmounted(() => {
        observer.disconnect()
    })
})
</script>
