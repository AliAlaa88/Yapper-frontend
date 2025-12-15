<template>
    <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" @click.self="closeModal">
        <div class="relative w-full h-full">
            <div class="absolute top-0 left-0 right-0 p-4 flex items-center z-10">
                <button
                    id="btn-close-photo-modal"
                    aria-label="Close photo"
                    class="text-primary hover:bg-white/10 p-2 rounded-full transition-colors duration-200 cursor-pointer"
                    @click="closeModal"
                >
                    <X />
                </button>
            </div>

            <div
                class="w-full h-full flex items-center justify-center p-[15px]"
                @click.self="closeModal"
            >
                <img
                    v-if="photoUrl"
                    :src="photoUrl"
                    :alt="`${route.params.username}'s profile photo`"
                    class="h-100 w-100 object-contain rounded-full"
                >
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'nuxt/app'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '../../stores/profileStore'
import { X } from 'lucide-vue-next'
import { onMounted, onUnmounted, computed } from 'vue'

const route = useRoute()
const router = useRouter()
const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)

const photoUrl = computed(() => profile.value?.avatar_url)

const closeModal = () => {
    router.back()
}

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
})
</script>
