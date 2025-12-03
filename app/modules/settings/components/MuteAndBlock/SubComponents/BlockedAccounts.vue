<template>
    <DetailedPanel :title="$t('settings.blockedAccounts')">
        <div class="w-full text-primary">
            <div class="relative w-full border-b border-primary pb-4  px-5 py-2">
                <p class="text-muted text-[13px] mt-0.5">
                    {{ $t('settings.blockedAccounts_desc') }}
                </p>
            </div>
            <div
                v-if="myBlockedUsersQuery.isLoading.value"
                class="flex justify-center py-6">
                <div
                    class="animate-spin rounded-full h-5 w-5 border-2 border-accent border-t-transparent"
                />
            </div>
            <div v-else-if="myBlockedUsersQuery.isSuccess.value && users.length > 0">
                <UserAccountItem
                    v-for="user in users"
                    :key="user.user_id"
                    :account="user">
                    <SettingsBlockedButton :user-id="user.user_id" :is-blocked="user.is_blocked" />
                </UserAccountItem>
            </div>
            <div
                v-if="myBlockedUsersQuery.hasNextPage.value"
                ref="loadMore"
                class="flex justify-center py-4"
            >
                <div
                    v-if="myBlockedUsersQuery.isFetchingNextPage.value"
                    class="animate-spin rounded-full h-5 w-5 border-2 border-accent border-t-transparent"
                />
            </div>
            <div
                v-else-if="myBlockedUsersQuery.isSuccess.value && users.length === 0"
                class="flex justify-center"
            >
                <div class="flex flex-col justify-center text-left px-10 py-[60px]">
                    <h1 class="m-0 mb-2 text-4xl font-extrabold text-primary max-w-[300px]">
                        Block unwanted accounts
                    </h1>
                    <p class="m-0 max-w-[350px] text-[15px] leading-6 text-muted">
                        When you block someone, they won’t be able to follow or
                        message you, and you won’t see notifications from them.
                    </p>
                </div>
            </div>
        </div>
    </DetailedPanel>
</template>

<script setup lang="ts">
import UserAccountItem from './UserAccountItem.vue'
import DetailedPanel from '../DetailedPanel.vue'
import { userSettingsQueries } from '../../queries/userSettingsQueries'
import SettingsBlockedButton from './SettingsBlockedButton.vue'

const { myBlockedUsersQuery } = userSettingsQueries()
console.log('hahaga', myBlockedUsersQuery)
watch(() => myBlockedUsersQuery.data.value, (val) => {
    console.log('Blocked users response:', val)
})

watch(() => myBlockedUsersQuery.data.value, (val) => {
    console.log('Blocked users response:', val)
    if (val?.pages) {
        console.log('Total pages loaded:', val.pages.length)
        console.log('All pages:', val.pages)
    }
})

const users = computed(() =>
    myBlockedUsersQuery.data.value?.pages
        .flatMap(page => page.data.data) ?? [],
)

const loadMore = ref<HTMLElement | null>(null)

onMounted(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            const entry = entries[0]
            console.log('Intersection observed:', {
                isIntersecting: entry?.isIntersecting,
                hasNextPage: myBlockedUsersQuery.hasNextPage.value,
                isFetching: myBlockedUsersQuery.isFetchingNextPage.value,
            })

            if (
                entry?.isIntersecting &&
                myBlockedUsersQuery.hasNextPage.value &&
                !myBlockedUsersQuery.isFetchingNextPage.value
            ) {
                console.log('Fetching next page...')
                myBlockedUsersQuery.fetchNextPage()
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
