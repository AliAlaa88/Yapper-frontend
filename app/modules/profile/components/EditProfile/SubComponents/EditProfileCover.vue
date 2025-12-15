<template>
    <div class="relative h-[200px] bg-gray-800">
        <img v-if="coverUrl" :src="coverUrl" alt="Cover photo" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-black/40 flex items-center justify-center gap-4">
            <button
                id="cover-upload-button"
                class="bg-primary hover:bg-hover text-primary p-2 rounded-full transition-colors duration-200"
                @click="$emit('upload')"
            >
                <Camera :size="20" />
            </button>
            <button
                v-if="coverUrl"
                id="cover-remove-button"
                class="bg-primary hover:bg-hover text-primary p-2 rounded-full transition-colors duration-200"
                @click="$emit('remove')"
            >
                <X :size="20" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { X, Camera } from 'lucide-vue-next'

defineProps<{
    coverUrl: string | null
}>()

defineEmits<{
    upload: []
    remove: []
}>()
</script>
