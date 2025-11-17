<template>
    <div class="h-[133px] sm:h-[200px] overflow-hidden bg-[#333639]">
        <NuxtLink
            v-if="coverUrl"
            :to="`/profile/${username}/cover`"
            class="group relative block h-full w-full hover:brightness-90 transition-all duration-200"
            @click="handleCoverClick"
        >
            <img :src="coverUrl" alt="Cover" class="h-full w-full object-cover" />
        </NuxtLink>
        <div v-else class="h-full w-full bg-[#333639]" />
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
