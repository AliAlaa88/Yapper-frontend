<template>
    <NuxtLink
        :key="category.href"
        :to="category.href"
        class="block relative px-5 py-3 rounded hover:bg-hover
        transition-colors text-primary"
    >
        <div class="flex justify-between items-center">
            <div>
                <span class="block text-[15px] text-primary"> {{ category.label }} </span>
                <p v-if="category.content" class="text-muted text-[13px]">
                    {{ category.content }}
                </p>
                <slot />
            </div>
            <ChevronRight class="opacity-40 group-hover:text-white absolute right-3" />
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
interface Category {
    label: string,
    content?: string,
    href: string
}
defineProps<{
    category: Category
}>()
</script>
