<template>
    <div class="sticky top-0 z-10 bg-primary/80 backdrop-blur-md transition-all duration-200">
        <div class="flex items-center gap-8 px-4 py-3">
            <button
                id="btn-back-bookmarks"
                type="button"
                class="flex h-8 w-8 items-center justify-center rounded-full hover:bg-hover transition-colors cursor-pointer"
                :aria-label="$t('navigation.back')"
                @click="router.back()"
            >
                <ArrowLeft :size="20" class="text-primary" />
            </button>
            <div class="flex flex-col">
                <h2 class="text-xl font-bold text-primary">{{ $t('bookmarks.title') }}</h2>
            </div>
        </div>
    </div>
    <TweetsList :fetching-source="`tweets/bookmarks`" class="min-h-[650px] w-full" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TweetsList from '~/modules/tweets/components/TweetsList/TweetsList.vue'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const router = useRouter()
const userStore = useUserStore()
const { user: currentUser } = storeToRefs(userStore)
const userId = computed(() => currentUser.value?.user_id || null)
</script>
