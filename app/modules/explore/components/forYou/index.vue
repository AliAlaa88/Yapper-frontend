<template>
    <div class="w-full">
        <!-- Loading state -->
        <div v-if="isLoading" class="flex justify-center py-8 min-h-[calc(100vh-60px)]">
            <LoadingSpinner size="xl" />
        </div>

        <!-- Error state -->
        <div v-else-if="isError" class="flex items-center justify-center min-h-[calc(100vh-60px)] border-t border-primary">
            <p class="text-muted">{{ t('explore.errorLoading') }}</p>
            <Button 
                @click="exploreQuery.refetch()" 
                class="text-accent hover:underline"
            >
                {{ t('explore.tryAgain') }}
            </Button>
        </div>

        <!-- Empty state -->
        <div v-else-if="!exploreData || (!exploreData.trending?.data?.length && !exploreData.who_to_follow?.length && !exploreData.for_you?.length)" class="flex items-center justify-center min-h-[calc(100vh-60px)] border-t border-primary">
            <p class="text-muted text-lg">{{ t('explore.noTrends') }}</p>
        </div>

        <!-- Content -->
        <div v-else >
            <!-- Trending Section -->
            <TrendsList 
                v-if="exploreData.trending?.data?.length" 
                :trends="exploreData.trending.data" 
            />

            <!-- Who to Follow Section -->
            <div v-if="exploreData.who_to_follow?.length" class="border-t border-primary">
                <h2 class="px-4 py-3 text-xl font-bold text-primary">
                    {{ t('timeline.banner.whoToFollow') }}
                </h2>
                <WhoToFollowList :users="exploreData.who_to_follow.slice(0, 3)" />
                <button
                    @click="router.push('/explore/who-to-follow')"
                    class="w-full px-4 py-3 text-start text-sm text-accent hover:bg-hover transition-colors"
                >
                    {{ t('timeline.banner.showMore') }}
                </button>
            </div>

            <!-- For You Posts by Category -->
            <div v-if="exploreData.for_you?.length">
                <div 
                    v-for="categoryGroup in exploreData.for_you" 
                    :key="categoryGroup.category.id"
                    class="border-t border-primary"
                >
                    <!-- Category Header -->
                    <div class="px-4 py-3 flex items-center justify-between hover:bg-hover transition-colors cursor-pointer">
                        <h2 class="text-xl font-bold text-primary">{{ categoryGroup.category.name }}</h2>
                        <ChevronRight class="w-5 h-5 text-muted" />
                    </div>
                    
                    <!-- Posts in this category -->
                    <Tweet 
                        v-for="post in categoryGroup.tweets" 
                        :key="post.tweet_id"
                        :tweet="post"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGetExploreQuery } from '../../queries/useGetExploreQuery';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ChevronRight } from 'lucide-vue-next';
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue';
import Tweet from '~/modules/tweets/components/Tweet/Tweet.vue';
import TrendsList from '../common/TrendsList.vue';
import WhoToFollowList from '../common/WhoToFollowList.vue';

const { t } = useI18n();
const router = useRouter();

const exploreQuery = useGetExploreQuery( true );
const isLoading = computed(() => exploreQuery.isLoading.value);
const isError = computed(() => exploreQuery.isError.value);
const exploreData = computed(() => {
    const rawData = exploreQuery.data.value;
    // API returns {data: {...}, count, message}, extract the nested data object
    return rawData?.data || {};
});
</script>