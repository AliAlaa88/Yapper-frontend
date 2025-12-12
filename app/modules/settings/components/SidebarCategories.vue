<template>
    <div class="space-y-4">
        <div class="md:hidden w-full sticky top-0 z-20">
            <DetailedHeader :title="t('navigation.settings')" />
        </div>
        <h1 class="hidden md:block text-xl px-4 pt-4 font-bold">{{ t('navigation.settings') }}</h1>
        <div class="relative w-full px-2">
            <Search class="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
            <input
                id="input-search-settings"
                type="text"
                :placeholder="$t('settings.search_settings')"
                class="w-full text-[15px] border border-primary py-2.5 pl-9 pr-3 rounded-full
                transition text-primary bg-transparent focus:outline-none
                focus:ring-2 focus:ring-accent cursor-pointer" >
        </div>
        <div>
            <NuxtLink
                v-for="category in settingsCategories"
                :id="`link-settings-${category.href.split('/').pop()}`"
                :key="category.href"
                :to="category.href"
                class="block relative px-5 py-3 rounded hover:bg-hover
                transition-colors text-primary cursor-pointer"
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
                    <component
                        :is="locale === 'ar' ? ChevronLeft : ChevronRight"
                        class="opacity-40 group-hover:text-white transition-colors" />
                </div>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import DetailedHeader from './DetailedHeader.vue'
import { ChevronRight, Search, ChevronLeft } from 'lucide-vue-next'
import { useRoute } from 'nuxt/app'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
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
