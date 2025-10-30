<template>
    <div class="relative px-4">
        <div
            class="relative -mt-16 w-[132px] h-[132px] rounded-full border-4 border-black bg-gray-800"
        >
            <img
                v-if="avatarUrl"
                :src="avatarUrl"
                alt="Profile photo"
                class="w-full h-full rounded-full object-cover"
            />
            <div
                class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center gap-2"
            >
                <button
                    aria-label="Upload profile photo"
                    class="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors duration-200"
                    @click="$emit('upload')"
                >
                    <Camera :size="20" />
                </button>
                <button
                    v-if="avatarUrl"
                    aria-label="Remove profile photo"
                    class="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors duration-200"
                    @click="$emit('remove')"
                >
                    <X :size="20" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { X, Camera } from 'lucide-vue-next'

defineProps<{
    avatarUrl: string | null
}>()

defineEmits<{
    upload: []
    remove: []
}>()
</script>
