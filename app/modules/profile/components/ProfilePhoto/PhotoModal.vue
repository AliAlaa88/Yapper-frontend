<template>
    <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" @click.self="closeModal">
        <div class="relative w-full h-full">
            <!-- Header with close button -->
            <div class="absolute top-0 left-0 right-0 p-4 flex items-center z-10">
                <button
                    aria-label="Close photo"
                    class="text-white hover:bg-white/10 p-2 rounded-full transition-colors duration-200"
                    @click="closeModal"
                >
                    <X />
                </button>
            </div>

            <!-- Image container -->
            <div
                class="w-full h-full flex items-center justify-center p-[15px]"
                @click.self="closeModal"
            >
                <img
                    v-if="photoUrl"
                    :src="photoUrl"
                    :alt="`${route.params.username}'s profile photo`"
                    class="h-100 w-100 object-contain rounded-full"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'nuxt/app'
import { storeToRefs } from 'pinia'
import { useProfilePhotoStore } from '../../stores/photo'
import { X } from 'lucide-vue-next'
import { onMounted, onUnmounted } from 'vue'

const route = useRoute()
const router = useRouter()
const photoStore = useProfilePhotoStore()
const { photoUrl } = storeToRefs(photoStore)

const closeModal = () => {
    router.back()
}

// Handle ESC key to close modal
const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        closeModal()
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    photoStore.clearPhotoUrl()
})
</script>
