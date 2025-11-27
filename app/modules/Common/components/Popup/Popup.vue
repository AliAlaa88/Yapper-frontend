<template>
    <Teleport to="body">
        <div
            v-if="isOpen"
            class="fixed inset-0 bg-popup flex flex-col z-50 backdrop-blur-sm md:py-10 md:px-0 px-0"
            :class="containerPositionClasses"
            @click="handleClose"
        >
            <div
                class="bg-primary md:rounded-2xl p-0 overflow-hidden z-50 h-full md:h-auto w-full md:w-auto"
                :class="contentClass"
                @click.stop
            >
                <div
                    v-if="title || hasCloseButton || hasBackButton"
                    class="flex justify-between relative p-1 items-center px-4 py-3"
                    :class="headerClass"
                >
                <!-- The close button, with larger size -->
                    <button
                        v-if="hasCloseButton"
                        class="cursor-pointer hover:bg-hover mx-4 mt-2 flex items-center justify-center border-none w-7 h-7 rounded-full transition"
                        @click="handleClose"
                        id="close-popup-btn"
                    >
                        <X class="w-5 h-5 text-primary hover:text-primary/80" />
                    </button>
                    <button
                        v-if="hasBackButton"
                        class="cursor-pointer hover:bg-hover mx-4 mt-2 flex items-center justify-center border-none w-7 h-7 rounded-full transition"
                        @click="$emit('back')"
                        id="back-popup-btn"
                    >
                        <ArrowLeft class="w-5 h-5 text-primary hover:text-primary/80" />
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
import { X, ArrowLeft } from 'lucide-vue-next'
import {useI18n} from "vue-i18n";
const { locale } = useI18n();
const isArabic = computed(() => locale.value === 'ar');
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
    hasBackButton?: boolean
}

const {
    isOpen,
    title,
    hasCloseButton = true,
    hasBackButton = false,
    xPosition = 'center',
    yPosition = 'center',
    containerClass = '',
    contentClass = 'md:max-w-[600px] w-full md:w-auto',
    headerClass = 'border-b border-gray-700',
    slotClass = 'max-h-[calc(90vh-60px)]',
} = defineProps<Props>()

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

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'back'): void
}>()

const handleClose = () => {
    emit('close')
}
</script>
