<template>
    <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" @click.self="closeModal">
        <div class="relative w-full h-full">
            <div class="absolute top-0 left-0 right-0 p-4 flex items-center z-10">
                <button
                    aria-label="Close cover photo"
                    class="text-white hover:bg-white/10 p-2 rounded-full transition-colors duration-200"
                    @click="closeModal"
                >
                    <X />
                </button>
            </div>

            <div
                class="w-full h-full flex items-center justify-center"
                @click.self="closeModal"
            >
                <img
                    v-if="coverUrl"
                    :src="coverUrl"
                    :alt="`${route.params.username}'s cover photo`"
                    class="max-h-180 w-full object-cover"
                />
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

const coverUrl = computed(() => profile.value?.cover_url)

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
