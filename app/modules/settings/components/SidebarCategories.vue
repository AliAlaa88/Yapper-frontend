<template>
    <div class="space-y-4">
        <h1 class="text-xl px-4 pt-4 font-bold">{{ $t('navigation.settings') }}</h1>
        <div class="relative w-full px-2">
            <Search class="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
            <input
                type="text"
                placeholder="Search Settings"
                class="w-full text-[15px] border border-primary py-2.5 pl-9 pr-3 rounded-full
                transition text-primary bg-transparent focus:outline-none
                focus:ring-2 focus:ring-accent" />
        </div>
        <div>
            <NuxtLink
                v-for="category in settingsCategories"
                :key="category.href"
                :to="category.href"
                class="block relative px-5 py-3 rounded hover:bg-hover
                transition-colors text-primary"
                :class="{
                    'bg-hover text-primary': selectedCategory(category.href)
                }">
                <div
                    v-if="selectedCategory(category.href)"
                    class="absolute right-0 top-0 h-full w-[3px] bg-accent rounded-l"
                />
                <div class="flex justify-between items-center">
                    <span>
                        {{ t(category.label) }}
                    </span>
                    <ChevronRight class="opacity-40 group-hover:text-white" />
                </div>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ChevronRight, Search } from 'lucide-vue-next'
import { useRoute } from 'nuxt/app'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const route = useRoute()
console.log(route.path)
const selectedCategory = (path: string) => {
    return route.path === path
}
const settingsCategories = computed(() => [
    { label: t('settings.yourAccount'), href: '/settings/account' },
    { label: t('settings.privacyAndSafety'), href: '/settings/privacy_and_safety' },
    { label: t('settings.displayAndLanguages'), href: '/settings/display_and_languages' },
])
</script>
