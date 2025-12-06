<template>
    <div class="w-full min-h-screen z-1 bg-primary flex flex-col gap-4 p-4">
        <!-- Search Bar -->
        <SearchBar v-if="!isSearch" />

        <!-- Trending Section -->
        <div class="bg-primary rounded-2xl border border-primary overflow-hidden">
            <h2 class="px-4 py-3 text-xl font-bold text-primary">{{ t('timeline.banner.trending') }}</h2>
            <div class="px-4 py-3 hover:bg-hover transition-colors cursor-pointer">
                <p class="text-muted text-sm">{{ t('timeline.banner.trendingIn', { location: 'Egypt' }) }}</p>
                <p class="text-primary font-bold mt-1">#YapperTrending</p>
                <p class="text-muted text-sm">1,234 {{ t('timeline.banner.posts') }}</p>
            </div>
            <div class="px-4 py-3 hover:bg-hover transition-colors cursor-pointer">
                <p class="text-muted text-sm">{{ t('timeline.banner.sportsTrending') }}</p>
                <p class="text-primary font-bold mt-1">Football News</p>
                <p class="text-muted text-sm">10.2K {{ t('timeline.banner.posts') }}</p>
            </div>
            <div class="px-4 py-3 hover:bg-hover transition-colors cursor-pointer">
                <p class="text-muted text-sm">{{ t('timeline.banner.technology') }}</p>
                <p class="text-primary font-bold mt-1">AI Updates</p>
                <p class="text-muted text-sm">8.7K {{ t('timeline.banner.posts') }}</p>
            </div>
            <button
                class="w-full px-4 py-3 text-left text-sm text-accent hover:bg-hover transition-colors"
            >
                {{ t('timeline.banner.showMore') }}
            </button>
        </div>

        <!-- Who to Follow Section -->
        <div class="bg-primary rounded-2xl border border-primary overflow-hidden">
            <h2 class="px-4 py-3 text-xl font-bold text-primary">{{ t('timeline.banner.whoToFollow') }}</h2>
            <div
                class="px-4 py-3 flex items-center justify-between hover:bg-hover transition-colors cursor-pointer"
            >
                <div class="flex items-center gap-3">
                    <div
                        class="w-12 h-12 bg-gray rounded-full flex items-center justify-center text-white font-bold"
                    >
                        A
                    </div>
                    <div>
                        <p class="text-primary font-bold">User Name</p>
                        <p class="text-muted text-sm">@username</p>
                    </div>
                </div>
                <button
                    class="px-4 py-2 bg-blue text-white rounded-full font-bold hover:bg-blue-dark transition-colors"
                >
                    {{ t('timeline.banner.follow') }}
                </button>
            </div>
            <div
                class="px-4 py-3 flex items-center justify-between hover:bg-hover transition-colors cursor-pointer"
            >
                <div class="flex items-center gap-3">
                    <div
                        class="w-12 h-12 bg-gray rounded-full flex items-center justify-center text-white font-bold"
                    >
                        B
                    </div>
                    <div>
                        <p class="text-primary font-bold">Another User</p>
                        <p class="text-muted text-sm">@anotheruser</p>
                    </div>
                </div>
                <button
                    class="px-4 py-2 bg-blue text-white rounded-full font-bold hover:bg-blue-dark transition-colors"
                >
                    {{ t('timeline.banner.follow') }}
                </button>
            </div>
            <button
                class="w-full px-4 py-3 text-left text-sm text-accent hover:bg-hover transition-colors"
            >
                {{ t('timeline.banner.showMore') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import SearchBar from '~/modules/search/components/SearchBar.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isSearch = computed(() => route.path.startsWith('/explore') || route.path.startsWith('/search'))
const { t } = useI18n()
</script>
