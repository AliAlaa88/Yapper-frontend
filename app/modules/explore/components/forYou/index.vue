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
                @click="refetch" 
                class="mt-2 text-accent hover:underline"
            >
                {{ t('explore.tryAgain') }}
            </Button>
        </div>

        <!-- Empty state -->
        <div v-else-if="!exploreData.value" class="flex items-center justify-center min-h-[calc(100vh-60px)] border-t border-primary">
            <p class="text-muted text-lg">{{ t('explore.noTrends') }}</p>
        </div>

        <!-- Content -->
        <div v-else>
            <!-- Trending Section -->
            <TrendsList 
                v-if="exploreData.trending?.length" 
                :trends="exploreData.trending" 
            />

            <!-- Who to Follow Section -->
            <div v-if="exploreData.who_to_follow?.length" class="border-t border-primary">
                <h2 class="px-4 py-3 text-xl font-bold text-primary">
                    {{ t('timeline.banner.whoToFollow') }}
                </h2>
                <div 
                    v-for="user in exploreData.who_to_follow" 
                    :key="user.id"
                    class="px-4 py-3 flex items-center justify-between hover:bg-hover transition-colors cursor-pointer"
                >
                    <div class="flex items-center gap-3">
                        <img 
                            :src="user.avatar_url" 
                            :alt="user.name"
                            class="w-10 h-10 rounded-full object-cover"
                            @error="(e) => handleImageError(user.name, e)"
                        />
                        <div class="min-w-0">
                            <div class="flex items-center gap-1">
                                <p class="text-primary font-bold truncate">{{ user.name }}</p>
                                <BadgeCheck v-if="user.verified" class="w-4 h-4 text-accent shrink-0" />
                            </div>
                            <p class="text-muted text-sm truncate">@{{ user.username }}</p>
                            <p v-if="user.bio" class="text-muted text-sm line-clamp-1 mt-0.5">{{ user.bio }}</p>
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                        class="shrink-0"
                    >
                        {{ t('timeline.banner.follow') }}
                    </Button>
                </div>
                <button
                    class="w-full px-4 py-3 text-left text-sm text-accent hover:bg-hover transition-colors"
                >
                    {{ t('timeline.banner.showMore') }}
                </button>
            </div>

            <!-- For You Posts by Category -->
            <div v-if="exploreData.for_you_posts?.length">
                <div 
                    v-for="categoryGroup in exploreData.for_you_posts" 
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
                        v-for="post in categoryGroup.posts" 
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
import { BadgeCheck, ChevronRight } from 'lucide-vue-next';
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue';
import Button from '~/modules/Common/components/Button/Button.vue';
import Tweet from '~/modules/tweets/components/Tweet/Tweet.vue';
import TrendsList from '../common/TrendsList.vue';
import { handleImageError } from '~/utils/helpers';

const { t } = useI18n();

const exploreData = ref<any>(null);
console.log("Explore Data:", exploreData.value);
const { isLoading, isError, refetch } = useGetExploreQuery(
    true,
    (response: any) => {
        exploreData.value = toRaw(response.data) || toRaw(response);
        console.log("Fetched Explore Data:", toRaw(exploreData.value));
    },
    (error: any) => {
        console.error('Error fetching explore data:', error);
    }
);


</script>