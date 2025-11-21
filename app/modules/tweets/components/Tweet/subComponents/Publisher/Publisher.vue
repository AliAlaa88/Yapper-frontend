<template>
    <!-- Tweet Details View - Name above username -->
    <div v-if="isDetail" class="mb-4">
        <div class="flex items-center gap-3 mb-4">
            <CustomToolTip :delay-duration="300" content-class="rounded-2xl shadow-xl border border-primary">
                <template #trigger>
                    <NuxtLink :id="`publisher-avatar-link-${id}`" :to="linkComputed">
                        <img
                            :id="`publisher-avatar-${id}`"
                            :src="avatar_url"
                            :alt="name"
                            class="w-12 h-12 rounded-full hover:opacity-90 transition-opacity"
                            :onerror="`this.src='https://ui-avatars.com/api/?name=${name}'`"
                        />
                    </NuxtLink>
                </template>
                <template #content>
                    <UserCard
                        :id="id"
                        :name="name"
                        :username="username"
                        :avatar="avatar_url"
                        :bio="publisher.bio"
                        :followers-count="publisher.followers"
                        :following-count="publisher.following"
                    />
                </template>
            </CustomToolTip>
            <div class="flex flex-col">
                <CustomToolTip :delay-duration="300" content-class="rounded-2xl shadow-xl border border-primary">
                    <template #trigger>
                        <NuxtLink
                            :id="`publisher-name-link-${id}`"
                            :to="linkComputed"
                            class="font-bold text-primary hover:underline text-lg leading-6"
                        >
                            {{ name }}
                        </NuxtLink>
                    </template>
                    <template #content>
                        <UserCard
                            :id="id"
                            :name="name"
                            :username="username"
                            :avatar="avatar_url"
                            :bio="publisher.bio"
                            :followers-count="publisher.followers"
                            :following-count="publisher.following"
                        />
                    </template>
                </CustomToolTip>
                <span class="text-secondary text-sm">@{{ username }}</span>
            </div>
        </div>
    </div>

    <!-- Timeline View - Name and username inline -->
    <div v-else class="flex items-center gap-1 mb-0.5">
        <CustomToolTip :delay-duration="300" content-class="rounded-2xl shadow-xl border border-primary">
            <template #trigger>
                <NuxtLink
                    :id="`publisher-name-link-timeline-${id}`"
                    :to="linkComputed"
                    class="font-bold text-primary hover:underline text-sm"
                >
                    {{ name }}
                </NuxtLink>
            </template>
            <template #content>
                <UserCard
                    :id="id"
                    :name="name"
                    :username="username"
                    :avatar="avatar_url"
                    :bio="publisher.bio"
                    :followers-count="publisher.followers"
                    :following-count="publisher.following"
                />
            </template>
        </CustomToolTip>
        <span class="text-secondary text-sm">@{{ username }}</span>
        <span class="text-secondary text-sm">·</span>
        <span class="text-secondary text-sm hover:underline cursor-pointer">
            {{ formatDate(createdAt, locale) }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import type { User as UserType } from '../../../../../Common/types/user'
import { formatDate } from '../../../../utils/lib'
import { getProfileUrl } from '../../../../utils/navigation'
import { CustomToolTip } from '~/modules/Common/components/Tooltip'
import UserCard from './UserCard.vue'

const props = defineProps<{
    publisher: UserType
    createdAt: string
    isDetail?: boolean
}>()

const { id, name, username, avatar_url, link } = toRefs(props.publisher)
const { locale } = useI18n()

// Use the utility function for consistent profile URLs
const linkComputed = computed(() => getProfileUrl(props.publisher))
</script>
