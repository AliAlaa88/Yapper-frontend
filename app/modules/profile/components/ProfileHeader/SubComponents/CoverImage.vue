<template>
    <div class="h-[200px] overflow-hidden">
        <NuxtLink
            v-if="coverUrl"
            :to="`/profile/${username}/cover`"
            class="group relative block h-full w-full hover:brightness-75 transition-all duration-200"
            @click="handleCoverClick"
        >
            <img :src="coverUrl" alt="Cover" class="h-full w-full object-cover" />
        </NuxtLink>
        <div v-else class="h-full w-full bg-gradient-to-br from-[#1d9bf0] to-[#0c7abf]" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'nuxt/app'
import { useProfilePhotoStore } from '../../../stores/photo'

const props = defineProps<{
    coverUrl?: string
}>()

const route = useRoute()
const photoStore = useProfilePhotoStore()
const username = computed(() => route.params.username as string)

const handleCoverClick = () => {
    if (props.coverUrl) {
        photoStore.setCoverUrl(props.coverUrl)
    }
}
</script>
