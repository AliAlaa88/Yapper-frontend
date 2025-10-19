<template>
    <div class="relative">
        <NuxtLink
            v-if="avatarUrl"
            :to="`/profile/${username}/photo`"
            class="group relative block h-[140px] w-[140px] rounded-full border-4 border-black bg-black hover:brightness-75 transition-all duration-200"
            @click="handlePhotoClick"
        >
            <img
                :src="avatarUrl"
                :alt="displayName"
                class="h-full w-full rounded-full object-cover"
            />
        </NuxtLink>
        <div
            v-else
            class="flex h-[140px] w-[140px] items-center justify-center rounded-full border-4 border-black bg-gradient-to-br from-[#1d9bf0] to-[#0c7abf] text-5xl font-bold text-white"
        >
            {{ displayName.charAt(0).toUpperCase() }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#app'
import { useProfilePhotoStore } from '~/modules/profile/stores/photo'

const props = defineProps<{
    avatarUrl?: string
    displayName: string
}>()
const photoStore = useProfilePhotoStore()

const route = useRoute()
const username = computed(() => route.params.username as string)

const handlePhotoClick = () => {
    if (props.avatarUrl) {
        photoStore.setPhotoUrl(props.avatarUrl)
    }
}
</script>
