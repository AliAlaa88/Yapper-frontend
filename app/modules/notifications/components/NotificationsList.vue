<template>
    <TransitionGroup
        name="notification"
        tag="div"
        class="flex flex-col"
        appear>
        <NotificationItem
            v-for="noti in notifications"
            :key="$notificationsSocketService.getNotificationId(noti)"
            :notification="noti"
        />
    </TransitionGroup>
    <div
        v-if="hasNextPage"
        ref="loadMore"
        class="flex justify-center py-4">
        <LoadingSpinner />
    </div>
</template>

<script setup lang="ts">
import NotificationItem from './SubComponents/NotificationItem.vue'
import type { ApiNotification } from '../types/notifications'
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue'
const props = defineProps<{
    notifications: ApiNotification[]
    isFetchingNextPage: boolean
    hasNextPage: boolean
    fetchNextPage: () => unknown | Promise<void>
}>()

const { $notificationsSocketService } = useNuxtApp()


const loadMore = ref<HTMLElement | null>(null)

onMounted(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            const entry = entries[0]
            console.log('Intersection observed:', {
                isIntersecting: entry?.isIntersecting,
                hasNextPage: props.hasNextPage,
                isFetching: props.isFetchingNextPage,
            })

            if (
                entry?.isIntersecting &&
                props.hasNextPage &&
                !props.isFetchingNextPage
            ) {
                props.fetchNextPage()
            }
        },
        {
            threshold: 0.1,
            rootMargin: '100px',
        },
    )

    watch(loadMore, (newVal) => {
        if (newVal) {
            observer.observe(newVal)
        }
    }, { immediate: true })

    onUnmounted(() => {
        observer.disconnect()
    })
})

</script>
<style lang="css" scoped>
    .notification-enter-from {
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease-out;
    }

    .notification-enter-to {
    background-color: transparent;
    opacity: 1;
    transform: translateY(0);
    }

    .notification-enter-active {
    transition:
    opacity 0.4s ease,
    transform 0.4s ease,
    background-color 1s ease;
    }
</style>
