<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
        <div
            class="bg-black text-white rounded-2xl w-full max-w-sm p-8 relative sm:rounded-2xl sm:max-w-sm sm:h-auto h-full sm:p-8 p-6 flex flex-col justify-center"
        >
            <!-- Header with back button -->
            <div class="absolute top-0 left-0 right-0 p-4 flex items-center">
                <NuxtLink
                    :to="`/profile/${$route.params.username}`"
                    class="text-white hover:text-gray-300 p-2"
                >
                    X
                </NuxtLink>
            </div>

            <!-- Image container -->
            <div class="w-full h-full flex items-center justify-center p-8">
                <img
                    v-if="photoUrl"
                    :src="photoUrl"
                    :alt="`${route.params.username}'s profile photo`"
                    class="max-h-[90vh] max-w-[90vw] object-contain"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from '#app'
import { storeToRefs } from 'pinia'
import { useProfilePhotoStore } from '../../stores/photo'

const route = useRoute()
const photoStore = useProfilePhotoStore()
const { photoUrl } = storeToRefs(photoStore)

// Clear photo URL when component is unmounted
onUnmounted(() => {
    photoStore.clearPhotoUrl()
})
</script>
