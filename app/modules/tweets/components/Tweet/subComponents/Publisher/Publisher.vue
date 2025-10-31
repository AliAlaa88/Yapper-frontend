<template>
    <!-- Tweet Details View - Name above username -->
    <TooltipProvider :delay-duration="400" :skip-delay-duration="0">
        <div v-if="isDetail" class="mb-4">
            <div class="flex items-center gap-3 mb-4">
                <Tooltip>
                    <TooltipTrigger as-child>
                        <NuxtLink :id="`publisher-avatar-link-${id}`" :to="linkComputed">
                            <img :id="`publisher-avatar-${id}`" :src="avatar" :alt="name" class="w-12 h-12 rounded-full hover:opacity-90 transition-opacity" />
                        </NuxtLink>
                    </TooltipTrigger>
                    <TooltipContent class="p-0">
                        <UserCard
                            :id="id"
                            :name="name"
                            :username="username"
                            :avatar="avatar"
                            :bio="publisher.bio"
                            :followers-count="publisher.followers_count"
                            :following-count="publisher.following_count"
                        />
                    </TooltipContent>
                </Tooltip>
                <div class="flex flex-col">
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <NuxtLink :id="`publisher-name-link-${id}`" :to="linkComputed" class="font-bold text-[var(--color-x-black)] hover:underline text-[20px] leading-6">
                                {{ name }}
                            </NuxtLink>
                        </TooltipTrigger>
                        <TooltipContent class="p-0">
                            <UserCard
                                :id="id"
                                :name="name"
                                :username="username"
                                :avatar="avatar"
                                :bio="publisher.bio"
                                :followers-count="publisher.followers_count"
                                :following-count="publisher.following_count"
                            />
                        </TooltipContent>
                    </Tooltip>
                    <span class="text-[var(--color-x-gray-dark)] text-[15px]">@{{ username }}</span>
                </div>
            </div>
        </div>
        
        <!-- Timeline View - Name and username inline -->
        <div v-else class="flex items-center gap-1 mb-0.5">
            <Tooltip>
                <TooltipTrigger as-child>
                    <NuxtLink :id="`publisher-name-link-timeline-${id}`" :to="linkComputed" class="font-bold text-[var(--color-x-black)] hover:underline text-[15px]">
                        {{ name }}
                    </NuxtLink>
                </TooltipTrigger>
                <TooltipContent class="p-0">
                    <UserCard
                        :id="id"
                        :name="name"
                        :username="username"
                        :avatar="avatar"
                        :bio="publisher.bio"
                        :followers-count="publisher.followers_count"
                        :following-count="publisher.following_count"
                    />
                </TooltipContent>
            </Tooltip>
            <span class="text-[var(--color-x-gray-dark)] text-[15px]">@{{ username }}</span>
            <span class="text-[var(--color-x-gray-dark)] text-[15px]">·</span>
            <span class="text-[var(--color-x-gray-dark)] text-[15px] hover:underline cursor-pointer">
                {{ formatDate(createdAt) }}
            </span>
        </div>
    </TooltipProvider>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import type { User as UserType } from '../../../../types'
import { formatDate } from '../../../../utils/lib'
import { getProfileUrl } from '../../../../utils/navigation'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import UserCard from './UserCard.vue'

const props = defineProps<{
    publisher: UserType
    createdAt: string
    isDetail?: boolean
}>()

const { id, name, username, avatar, link } = toRefs(props.publisher)

// Use the utility function for consistent profile URLs
const linkComputed = computed(() => getProfileUrl(props.publisher))
</script>
