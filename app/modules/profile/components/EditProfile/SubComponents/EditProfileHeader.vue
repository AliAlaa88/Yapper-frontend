<template>
    <div
        class="sticky top-0 z-10 bg-primary backdrop-blur-sm flex items-center justify-between px-4 py-3 border-b border-primary"
    >
        <div class="flex items-center gap-8">
            <button
                id="edit-profile-close-button"
                aria-label="Close"
                class="text-primary hover:bg-hover p-2 rounded-full transition-colors duration-200"
                @click="$emit('close')"
            >
                <X :size="20" />
            </button>
            <h2 class="text-primary text-xl font-bold">Edit profile</h2>
        </div>
        <button
            id="edit-profile-save-button"
            class="bg-primary text-primary font-bold text-[15px] px-4 py-1.5 rounded-full hover:bg-hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
