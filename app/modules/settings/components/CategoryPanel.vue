<template>
    <div class="space-y-1">
        <div class="md:hidden w-full sticky top-0 z-20">
            <DetailedHeader :title="item.title" />
        </div>
        <h1 class="hidden md:block text-xl px-4 py-4 font-bold">{{ item.title }}</h1>
        <div class="relative w-full px-4">
            <p v-if="item.description" class="text-muted text-[13px] mt-0.5">
                {{ item.description }}
            </p>
        </div>
        <div class="pt-2">
            <NuxtLink
                v-for="category in item.categories"
                id="category-link"
                :key="category.href"
                :to="category.href"
                class="block relative px-5 py-3 rounded hover:bg-hover
                transition-colors text-primary"
            >
                <div class="flex items-center">
                    <component
                        :is="category.icon"
                        class="shrink-0 opacity-50 w-4.5 h-4.5 mr-8 ml-2"
                    />
                    <div>
                        <span class="block text-[15px] text-primary"> {{ category.label }} </span>
                        <p v-if="category.description" class="text-muted max-w-[450px] text-[13px]">
                            {{ category.description }}
                        </p>
                    </div>
                    <ChevronRight class="w-6 h-6 opacity-40 absolute right-3" />
                </div>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import DetailedHeader from './DetailedHeader.vue'

interface Category {
    label: string,
    description?: string,
    icon?: Component,
    href: string
}

interface Item {
    title: string,
    description?: string,
    categories: Category[]
}

defineProps<{ item: Item }>()
</script>
