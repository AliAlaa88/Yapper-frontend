<template>
    <DetailedPanel :title="$t('settings.display')">
        <div class="w-full">
            <div class="relative w-full pb-4  px-5 py-2">
                <p class="text-muted text-[13px] mt-0.5">
                    {{ $t('settings.display_desc2') }}
                </p>
            </div>
            <SlideBar />

            <div class="px-4 py-5 border-b border-primary">
                <h2 class="text-lg font-bold text-primary mb-5">{{ $t('settings.color') }}</h2>
                <div class="grid grid-cols-3 place-items-center justify-center sm:flex sm:justify-between px-3 gap-3">
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

            <div class="px-4 py-5">
                <h2 class="text-lg font-bold text-primary mb-5">{{ $t('settings.background') }}</h2>
                <div class="flex flex-col sm:flex-row  sm:justify-center gap-5 sm:gap-10 mb-5">
                    <button
                        v-for="bg in backgroundOptions"
                        :key="bg.value"
                        :class="[
                            'relative w-full px-4 py-3  sm:w-[200px] h-[65px] rounded-xs border-2 transition-all text-center',
                            background === bg.value
                                ? 'border-accent'
                                : 'border-primary hover:border-secondary',
                            bg.value === 'light' ? 'bg-white' : '',
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
                                    bg.value === 'light' ? 'text-black' :
                                    bg.value === 'dark' ? 'text-primary' : 'text-primary' : 'text-white'
                            ]">
                            {{ bg.description }}
                        </span>
                    </button>
                </div>
            </div>

            <div class="px-4 sm:px-8 mb-10 flex items-center justify-between">
                <div>
                    <h3 class="text-sm font-medium text-primary">{{ $t('settings.useSystemSetting') }}</h3>
                    <p v-if="!useSystemTheme" class="text-xs text-secondary mt-1.5">{{ $t('settings.choosePreferredTheme') }}</p>
                    <p v-else class="text-xs text-secondary mt-1.5">{{ $t('settings.useSystemSetting_desc') }}</p>
                </div>
                <button
                    :class="[
                        'relative w-10 h-4 rounded-full transition-colors',
                        useSystemTheme ? 'bg-accent/60' : 'bg-gray'
                    ]"
                    role="switch"
                    :aria-checked="useSystemTheme"
                    @click="useSystemTheme = !useSystemTheme"
                >
                    <span
                        class="
                            absolute top-[-2px]
                            w-5 h-5
                            shadow shadow-gray-400
                            rounded-full
                            transition-all
                        "
                        :class="[
                            'absolute top-[-2px] w-5 h-5 shadow shadow-gray-400 rounded-full transition-transform',
                            useSystemTheme ? 'end-0 bg-accent' : 'start-0 bg-white'
                        ]"
                    />
                </button>
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
    useSystemTheme,
    colorOptions,
    backgroundOptions,
} = useDisplaySettings()
</script>

