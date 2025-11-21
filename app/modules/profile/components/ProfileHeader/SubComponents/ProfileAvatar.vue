<template>
    <div class="relative">
        <NuxtLink
            v-if="avatarUrl"
            :to="`${username}/photo`"
            class="group relative block h-[85px] w-[85px] sm:h-[133px] sm:w-[133px] rounded-full border-4 border-black bg-black hover:brightness-90 transition-all duration-200"
        >
            <img
                :src="avatarUrl"
                :alt="displayName"
                class="h-full w-full rounded-full object-cover"
            >
        </NuxtLink>
        <div
            v-else
            class="flex h-[85px] w-[85px] sm:h-[133px] sm:w-[133px] items-center justify-center rounded-full border-4 border-black bg-[#71767b] text-3xl sm:text-5xl font-bold text-white"
        >
            {{ displayName.charAt(0).toUpperCase() }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'nuxt/app'

defineProps<{
    avatarUrl?: string
    displayName: string
}>()

const route = useRoute()
const username = computed(() => route.params.username as string)
</script>
