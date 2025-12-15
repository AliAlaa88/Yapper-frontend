<template>
    <div class="sticky top-0 z-20 px-4 py-3 mb-1 flex items-center gap-4 bg-primary">
        <button
            id="back-button"
            class="p-2 flex items-center justify-center cursor-pointer rounded-full hover:bg-hover transition"
            @click="$router.back()"
        >
            <component :is="locale === 'ar' ? ArrowRight : ArrowLeft" class="w-5 h-5 mr-2" />
        </button>

        <h1 class="text-xl font-bold text-primary">
            {{ title }}
        </h1>
    </div>
</template>

<script setup lang="ts">
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
defineProps<{ title: string }>()
</script>
