<template>
    <NuxtLink :to="link" class="flex gap-3 border-b border-primary p-5 hover:bg-hover transition">
        <component
            :is="icon"
            :color="iconColor"
            :fill="fillColor"
            :size="28" />

        <div class="flex flex-1 gap-3">
            <div class="flex-1">
                <div class="flex -space-x-[-5px] mb-1">
                    <div v-for="user in users" :key="user.id">
                        <NuxtLink :to="`/${user.username}`">
                            <CustomToolTip
                                :delay-duration="300"
                                content-class="rounded-2xl shadow-xl border border-primary">
                                <template #trigger>
                                    <img
                                        :src="user.avatar_url ?? `https://ui-avatars.com/api/?name=${user.username}`"
                                        class="w-8 h-8 rounded-full"
                                        alt="user avatar">
                                </template>
                                <template #content>
                                    <UserCard
                                        :id="user.id"
                                        :name="user.name"
                                        :username="user.username"
                                        :avatar="user.avatar_url ?? ''"
                                        :bio="user.bio ?? null"
                                        :followers-count="user.followers ?? null"
                                        :following-count="user.following ?? null" />
                                </template>
                            </CustomToolTip>
                        </NuxtLink>
                    </div>
                </div>
                <div class="flex justify-between mt-2">
                    <p class="text-primary leading-relaxed">
                        <span>
                            <template v-for="(user, index) in displayedUsers" :key="user.id">
                                <CustomToolTip
                                    :delay-duration="300"
                                    content-class="rounded-2xl shadow-xl border border-primary">
                                    <template #trigger>
                                        <NuxtLink
                                            :to="`/${user.username}`"
                                            class="hover:underline underline-offset-2 font-bold inline-block"
                                            @click.stop>
                                            {{ user.username }}
                                        </NuxtLink>
                                    </template>
                                    <template #content>
                                        <UserCard
                                            :id="user.id"
                                            :name="user.name"
                                            :username="user.username"
                                            :avatar="user.avatar_url ?? ''"
                                            :bio="user.bio ?? null"
                                            :followers-count="user.followers ?? null"
                                            :following-count="user.following ?? null" />
                                    </template>
                                </CustomToolTip>
                                <template v-if="index < displayedUsers.length - 1">
                                    <span v-if="displayedUsers.length > 1"> {{ $t('notifications.and') }} </span>
                                </template>
                            </template>
                            <template v-if="hiddenCount > 0">
                                {{ $t('notifications.and') }} <span class="font-bold">{{ hiddenCount }} {{ $t('notifications.others') }}</span>
                            </template>
                        </span>
                        {{ message }}
                    </p>
                </div>

                <p
                    v-if="postText"
                    class="text-muted text-sm mt-3"
                    :class="isRtl ? 'text-right' : 'text-left'"
                    :dir="isRtl ? 'rtl' : 'ltr'">
                    {{ postText }}
                </p>
            </div>
            <span class="text-muted text-xs whitespace-nowrap ml-3">{{ createdAt }}</span>

        </div>
    </NuxtLink>
</template>


<script setup lang="ts">
import type { Component } from 'vue'
import type { User } from '~/modules/notifications/types/notificationsSocketEvents'
import CustomToolTip from '~/modules/Common/components/Tooltip/CustomToolTip.vue'
import UserCard from '~/modules/tweets/components/Tweet/subComponents/Publisher/UserCard.vue'

const props = defineProps<{
    icon: Component | null
    iconColor: string
    message: string
    postText: string
    users: User[]
    createdAt: string
    link: string
    fillColor?: string
}>()

const MAX_VISIBLE_USERS = 2
const displayedUsers = computed(() => props.users.slice(0, MAX_VISIBLE_USERS))
const hiddenCount = computed(() => Math.max(0, props.users.length - MAX_VISIBLE_USERS))
const isRtl = computed(() => {
    if (!props.postText) return false
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(props.postText)
})
</script>
