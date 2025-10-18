<template>
    <!-- Tweet Details View - Name above username -->
    <div v-if="isDetail" class="mb-4">
        <div class="flex items-center gap-3 mb-4">
            <img :src="avatar" :alt="name" class="w-12 h-12 rounded-full" />
            <div class="flex flex-col">
                <a :href="link" class="font-bold text-[var(--color-x-black)] hover:underline text-[20px] leading-6">
                    {{ name }}
                </a>
                <span class="text-[var(--color-x-gray-dark)] text-[15px]">@{{ username }}</span>
            </div>
        </div>
    </div>
    
    <!-- Timeline View - Name and username inline -->
    <div v-else class="flex items-center gap-1 mb-0.5">
        <a :href="link" class="font-bold text-[var(--color-x-black)] hover:underline text-[15px]">
            {{ name }}
        </a>
        <span class="text-[var(--color-x-gray-dark)] text-[15px]">@{{ username }}</span>
        <span class="text-[var(--color-x-gray-dark)] text-[15px]">·</span>
        <span class="text-[var(--color-x-gray-dark)] text-[15px] hover:underline cursor-pointer">
            {{ formatDate(createdAt) }}
        </span>
    </div>
</template>

<script setup lang="ts">
import type { User as UserType } from '~/modules/tweets/types'
import { formatDate } from '~/modules/tweets/utils/lib'
import { toRefs } from 'vue'

const props = defineProps<{
    publisher: UserType
    createdAt: string
    isDetail?: boolean
}>()

const { id, name, username, avatar, link } = toRefs(props.publisher)
</script>
