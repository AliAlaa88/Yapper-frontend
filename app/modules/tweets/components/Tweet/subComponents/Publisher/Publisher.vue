<template>
    <div class="flex items-center gap-1 mb-0.5">
        <a :href="link" class="font-bold text-[var(--color-x-black)] hover:underline text-[15px]">
            {{ name }}
        </a>
        <span class="text-[var(--color-x-gray-dark)] text-[15px]"> @{{ username }} </span>
        <span class="text-[var(--color-x-gray-dark)] text-[15px]">·</span>
        <span class="text-[var(--color-x-gray-dark)] text-[15px] hover:underline">
            {{ formatDate(createdAt) }}
        </span>
    </div>
</template>

<script setup lang="ts">
import type { User as UserType } from '~/modules/tweets/types'
import { formatDate } from '~/modules/tweets/utils/lib'

const props = defineProps<{
    publisher: UserType
    createdAt: string
}>()

const { id, name, username, avatar, link } = toRefs(props.publisher)
</script>
