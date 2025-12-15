<template>
    <div class="font-size-slider px-4 py-5 border-b border-primary">
        <h2 class="text-lg font-bold text-primary mb-5">{{ t('settings.fontSize') }}</h2>

        <div class="flex items-center gap-4">
            <span class="text-xs text-secondary font-normal">Aa</span>

            <div class="flex-1 relative">
                <div
                    class="absolute inset-0 top-1/2 -translate-y-1/2 h-1 bg-accent/60 rounded-full"
                />

                <div
                    class="absolute top-1/2 -translate-y-1/2 h-1 bg-accent rounded-full transition-all duration-150"
                    :style="{ width: `${progressPercentage}%` }"
                />

                <div class="relative h-10 flex items-center justify-between">
                    <button
                        v-for="size in fontSizes"
                        :key="size.value"
                        :id="`btn-font-size-${size.value}`"
                        :aria-label="`Font size ${size.label}`"
                        class="relative z-10 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                        @click="fontSize = size.value"
                    >
                        <div
                            :class="[
                                'w-4 h-4 rounded-full border-2 transition-all duration-150',
                                'shadow-[0_0_6px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.2)]',
                                fontSize === size.value
                                    ? 'border-accent bg-transparent scale-0'
                                    : fontSize <= size.value
                                      ? 'border-none bg-accent/80'
                                      : 'border-none bg-accent',
                            ]"
                        />

                        <div
                            :class="[
                                'absolute w-5 h-5 rounded-full transition-all duration-150',
                                fontSize === size.value
                                    ? 'bg-accent scale-100'
                                    : 'bg-transparent scale-0',
                            ]"
                        />
                    </button>
                </div>

                <input
                    id="input-font-size-range"
                    v-model.number="fontSize"
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    aria-label="Font size"
                />
            </div>

            <span class="text-xl text-secondary font-normal">Aa</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDisplaySettings } from '../../../composables/useDisplaySettings'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { fontSize } = useDisplaySettings()

const fontSizes = [
    { value: 1, label: 'Extra Small' },
    { value: 2, label: 'Small' },
    { value: 3, label: 'Medium' },
    { value: 4, label: 'Large' },
    { value: 5, label: 'Extra Large' },
]

const progressPercentage = computed(() => {
    return ((fontSize.value - 1) / (5 - 1)) * 100
})
</script>

<style scoped>
/* Remove default slider styling */
input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
}

input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    cursor: pointer;
    opacity: 0;
}

input[type='range']::-moz-range-thumb {
    width: 20px;
    height: 20px;
    cursor: pointer;
    opacity: 0;
    border: none;
    background: transparent;
}

input[type='range']:focus {
    outline: none;
}

/* Focus visible for keyboard navigation */
input[type='range']:focus-visible + .dots-container button:nth-child(var(--focused-index)) {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
}
</style>
