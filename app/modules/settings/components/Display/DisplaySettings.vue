<template>
    <DetailedPanel title="Display">
        <div class="w-full">
            <div class="relative w-full pb-4  px-5 py-2">
                <p class="text-muted text-[13px] mt-0.5">
                    Manage your font size, color, and background. These settings
                    affect all the Yapper accounts on this browser.
                </p>
            </div>
            <SlideBar />

            <div class="px-4 py-5 border-b border-primary">
                <h2 class="text-lg font-bold text-primary mb-5">Color</h2>
                <div class="flex justify-between px-3 gap-3">
                    <button
                        v-for="y_color in colorOptions"
                        :key="y_color.value"
                        :class="[
                            'w-10 h-10 rounded-full transition-all relative',
                            y_color.class,
                        ]"
                        :aria-label="y_color.name"
                        @click="color = y_color.value"
                    >
                        <Check
                            v-if="color === y_color.value"
                            color="#f6f5f4"
                            :stroke-width="1.8"
                            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                    </button>
                </div>
            </div>

            <div class="px-4 py-5 border-b border-primary">
                <h2 class="text-lg font-bold text-primary mb-5">Background</h2>
                <div class="flex justify-center gap-15 mb-5">
                    <button
                        v-for="bg in backgroundOptions"
                        :key="bg.value"
                        :class="[
                            'relative px-4 py-3  w-[200px] h-[65px] rounded-xs border-2 transition-all text-center',
                            background === bg.value
                                ? 'border-accent'
                                : 'border-primary hover:border-secondary',
                            bg.value === 'default' ? 'bg-white' : '',
                            bg.value === 'dark' ? 'bg-black' : ''
                        ]"
                        @click="background = bg.value"
                    >
                        <div
                            :class="[
                                'absolute left-4 top-5 w-5 h-5 rounded-full flex items-center justify-center',
                                background === bg.value ? 'border-none bg-accent' : 'border border-primary'
                            ]">
                            <Check
                                v-if="background === bg.value"
                                color="#f6f5f4"
                                :stroke-width="2.5"
                                class="absolute w-3 h-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            />
                        </div>
                        <span
                            :class="[
                                'text-sm font-semibold',
                                background === bg.value ?
                                    bg.value === 'default' ? 'text-black' :
                                        bg.value === 'dark' ? 'text-primary' : 'text-primary' : 'text-white'
                            ]">
                            {{ bg.description }}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </DetailedPanel>
</template>

<script setup lang="ts">
import { useDisplaySettings } from '../../composables/useDisplaySettings'
import DetailedPanel from '../DetailedPanel.vue'
import { Check } from 'lucide-vue-next'
import SlideBar from './SlideBar.vue'

const {
    color,
    background,
    // useSystemTheme,
    colorOptions,
    backgroundOptions,
} = useDisplaySettings()
</script>

