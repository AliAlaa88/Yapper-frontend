<template>
    <NuxtLink
        id="detailed-link"
        :key="category.href"
        :to="category.href"
        class="block relative px-5 py-3 rounded hover:bg-hover transition-colors text-primary"
    >
        <div class="flex justify-between items-center">
            <div>
                <span class="block text-[15px] text-primary"> {{ category.label }} </span>
                <p v-if="category.content" class="text-muted text-[13px]">
                    {{ category.content }}
                </p>
                <slot />
            </div>
            <component
                :is="locale === 'ar' ? ChevronLeft : ChevronRight"
                class="opacity-40 group-hover:text-white absolute transition-colors"
                :class="locale === 'ar' ? 'left-3' : 'right-3'"
            />
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
import { ChevronRight, ChevronLeft } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
interface Category {
    label: string
    content?: string | null
    href: string
}
defineProps<{
    category: Category
}>()
</script>
