<template>
    <div
        v-if="isOpen"
        class="fixed inset-0 bg-white/10 flex flex-col z-40 backdrop-blur-sm items-center py-10"
        @click="handleClose"
    >
        <div class="bg-primary rounded-lg p-4 max-h-[90vh] w-[600px] mx-auto" @click.stop>
            <div class="flex justify-between items-center">
                <h1 v-if="title" class="text-2xl font-bold text-primary">{{ title }}</h1>
                <button class="cursor-pointer" @click="handleClose" id="close-popup-btn">
                    <X class="w-5 h-5 text-primary hover:text-primary/80" />
                </button>
            </div>
            <div class="mt-4">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

interface Props {
    isOpen: boolean
    title?: string
}

const { isOpen, title } = defineProps<Props>()

const emit = defineEmits(['close'])

const handleClose = () => {
    emit('close')
}
</script>
