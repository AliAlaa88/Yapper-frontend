<template>
    <div
        class="sticky top-0 z-10 bg-black/95 backdrop-blur-sm flex items-center justify-between px-4 py-3 border-b border-white/10"
    >
        <div class="flex items-center gap-8">
            <button
                id="edit-profile-close-button"
                aria-label="Close"
                class="text-white hover:bg-white/10 p-2 rounded-full transition-colors duration-200"
                @click="$emit('close')"
            >
                <X :size="20" />
            </button>
            <h2 class="text-white text-xl font-bold">Edit profile</h2>
        </div>
        <button
            id="edit-profile-save-button"
            class="bg-white text-black font-bold text-[15px] px-4 py-1.5 rounded-full hover:bg-white/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!isValid || isSaving"
            @click="$emit('save')"
        >
            {{ isSaving ? 'Saving...' : 'Save' }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{
    isValid: boolean
    isSaving: boolean
}>()

defineEmits<{
    close: []
    save: []
}>()
</script>
