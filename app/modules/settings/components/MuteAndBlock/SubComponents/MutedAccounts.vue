<template>
    <DetailedPanel :title="t('settings.mutedAccounts')">
        <div class="w-full text-primary">
            <div class="relative w-full border-b border-primary pb-4  px-5 py-2">
                <p class="text-muted text-[13px] mt-0.5">
                    {{  t('settings.mutedAccounts_desc')    }}
                </p>
            </div>
            <div
                v-if="myMutedUsersQuery.isLoading.value"
                class="flex justify-center py-6">
                <div
                    class="animate-spin rounded-full h-5 w-5 border-2 border-accent border-t-transparent"
                />
            </div>
            <div v-else-if="myMutedUsersQuery.isSuccess.value">
                <UserAccountItem
                    v-for="user in users"
                    :key="user.user_id"
                    :account="user">
                    <SettingsMutedButton :user-id="user.user_id" :is-muted="user.is_muted" />
                </UserAccountItem>
            </div>
            <div
                v-if="myMutedUsersQuery.hasNextPage.value"
                ref="loadMore"
                class="flex justify-center py-4"
            >
                <div
                    v-if="myMutedUsersQuery.isFetchingNextPage.value"
                    class="animate-spin rounded-full h-5 w-5 border-2 border-accent border-t-transparent"
                />
            </div>
            <div
                v-else-if="myMutedUsersQuery.isSuccess.value && users.length === 0"
                class="flex justify-center"
            >
                <div class="flex flex-col justify-center text-left px-10 py-[60px]">
                    <h1 class="m-0 mb-2 text-4xl font-extrabold text-primary max-w-[300px]">
                        {{ $t('settings.mutedAccounts') }}
                    </h1>
                    <p class="m-0 max-w-[350px] text-[15px] leading-6 text-muted">
                        {{ $t('settings.muted_accounts_description') }}
                    </p>
                </div>
            </div>
        </div>
    </DetailedPanel>
</template>

<script setup lang="ts">
import UserAccountItem from '~/modules/settings/components/MuteAndBlock/SubComponents/UserAccountItem.vue'
import DetailedPanel from '../../DetailedPanel.vue'
import { userSettingsQueries } from '../../../queries/userSettingsQueries'
import { useI18n } from 'vue-i18n'
import SettingsMutedButton from '~/modules/settings/components/MuteAndBlock/SubComponents/SettingsMutedButton.vue'
const { t } = useI18n()

const { myMutedUsersQuery } = userSettingsQueries()
const { $queryClient } = useNuxtApp()
watch(
    () => myMutedUsersQuery.data,
    (val) => {
        if (val) {
            console.log('Muted users response:', val)
        }
    },
    { immediate: true, deep: true },
)

watch(
    () => myMutedUsersQuery.isLoading.value,
    (val) => {
        console.log('isLoading users response:', val)

    },
    { immediate: true, deep: true },
)
const users = computed(() =>
    myMutedUsersQuery.data.value?.pages
        .flatMap(page => page.data.data) ?? [],
)

const loadMore = ref<HTMLElement | null>(null)

onMounted(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            const entry = entries[0]
            console.log('Intersection observed:', {
                isIntersecting: entry?.isIntersecting,
                hasNextPage: myMutedUsersQuery.hasNextPage.value,
                isFetching: myMutedUsersQuery.isFetchingNextPage.value,
            })

            if (
                entry?.isIntersecting &&
                myMutedUsersQuery.hasNextPage.value &&
                !myMutedUsersQuery.isFetchingNextPage.value
            ) {
                console.log('Fetching next page...')
                myMutedUsersQuery.fetchNextPage()
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

onUnmounted(() => {
    $queryClient.invalidateQueries({
        queryKey: ['muted-users'],
    })
})
</script>
