<template>
    <div class="flex border-b border-[#2f3336] bg-black">
        <NuxtLink
            v-for="tab in tabs"
            :key="tab.id"
            :to="`/profile/${username}/${tab.to}`"
            class="relative flex-1 cursor-pointer border-none bg-transparent p-4 font-medium text-[#71767b] transition-colors hover:bg-white/[0.03] [&.active]:font-bold [&.active]:text-white [&.active]:after:absolute [&.active]:after:bottom-0 [&.active]:after:left-0 [&.active]:after:right-0 [&.active]:after:h-1 [&.active]:after:rounded-t [&.active]:after:bg-[#1d9bf0] [&.active]:after:content-['']"
            exact-active-class="active"
        >
            {{ tab.label }}
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

interface Tab {
    id: string
    label: string
    to: string
}

defineProps<{
    tabs: Tab[]
}>()

const route = useRoute()
const username = route.params.username as string
</script>
