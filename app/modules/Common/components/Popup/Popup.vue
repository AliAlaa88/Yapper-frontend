<template>
    <Teleport to="body">
        <div
            v-if="isOpen"
            class="fixed inset-0 bg-popup flex flex-col z-50 backdrop-blur-sm md:py-10"
            :class="containerPositionClasses"
            @click="handleClose"
        >
            <div
                class="bg-primary md:rounded-2xl p-0 overflow-hidden z-50 h-full md:h-auto"
                :class="contentClass"
                @click.stop
            >
                <div
                    v-if="title || hasCloseButton"
                    class="flex justify-between items-center px-4 py-3"
                    :class="headerClass"
                >
                    <button
                        v-if="hasCloseButton"
                        class="cursor-pointer hover:bg-hover border-none rounded-full p-1 transition"
                        @click="handleClose"
                        id="close-popup-btn"
                    >
                        <X class="w-5 h-5 text-primary hover:text-primary/80" />
                    </button>
                    <h1 v-if="title" class="text-xl font-bold text-primary flex-1 text-center mr-5">
                        {{ title }}
                    </h1>
                    <div v-if="hasCloseButton" class="w-5"></div>
                </div>

                <div class="overflow-y-auto" :class="slotClass">
                    <slot />
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X } from 'lucide-vue-next'

type Position = 'start' | 'center' | 'end'

interface Props {
    isOpen: boolean
    title?: string
    hasCloseButton?: boolean
    xPosition?: Position
    yPosition?: Position
    containerClass?: string
    contentClass?: string
    headerClass?: string
    slotClass?: string
}

const {
    isOpen,
    title,
    hasCloseButton = true,
    xPosition = 'center',
    yPosition = 'center',
    containerClass = '',
    contentClass = 'max-w-[600px] w-full', // Added w-full here so it fills its max-width
    headerClass = 'border-b border-gray-700',
    slotClass = 'max-h-[calc(90vh-60px)]',
} = defineProps<Props>()

const emit = defineEmits(['close'])

const containerPositionClasses = computed(() => {
    // FIX 2: Corrected Logic for flex-col
    // In flex-col: Cross Axis (Horizontal) = items-*, Main Axis (Vertical) = justify-*

    const xClasses = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
    }

    const yClasses = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
    }

    // xPosition should control Horizontal (items), yPosition should control Vertical (justify)
    const classes = [xClasses[xPosition], yClasses[yPosition], containerClass].filter(Boolean)

    return classes.join(' ')
})

const handleClose = () => {
    emit('close')
}
</script>
