<template>
    <Popup
        :isOpen="true"
        @close="$emit('close')"
        :hasCloseButton="false"
        contentClass="sm:max-w-xl w-full"
        :headerClass="isArabic ? 'absolute top-4 right-4 z-10 bg-transparent p-0' : 'absolute top-4 left-4 z-10 bg-transparent p-0'"
        slotClass="pt-4 px-8 pb-0 sm:pt-6 sm:px-10 sm:pb-0 flex flex-col"
        @back="$emit('back')"
        :hasBackButton="true"
    >
        <!-- Logo at top -->
        <div class="flex justify-center mb-6">
            <Logo imgClass="w-8 lg:w-10" />
        </div>

        <!-- Title -->
        <h2 class="text-2xl font-bold mb-2" :class="isArabic ? 'text-right' : 'text-left'">{{ $t('auth.whoToFollow.title') }}</h2>
        <p class="text-muted text-sm mb-6" :class="isArabic ? 'text-right' : 'text-left'">{{ $t('auth.whoToFollow.info') }}</p>

        <!-- Follow requirement -->
        <p class="font-semibold mb-4" :class="isArabic ? 'text-right' : 'text-left'">{{ $t('auth.whoToFollow.requirement') }}</p>

        <!-- Users List -->
        <div class="flex-1 overflow-y-auto custom-scrollbar max-h-64 mb-4">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex justify-center items-center py-10">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
            </div>
            
            <!-- Error State -->
            <div v-else-if="isError" class="text-center py-10">
                <p class="text-muted">{{ $t('common.error') }}</p>
            </div>
            
            <!-- Users List -->
            <div
                v-else
                v-for="user in suggestedUsers"
                :key="user.id || user._id"
                class="flex items-start gap-3 py-3"
            >
                <!-- Avatar with error handling -->
                <UserImage
                    :image-url="user.avatar_url || user.avatar"
                    :name="user.name"
                    :size="10"
                />
                
                <!-- User Info -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1">
                        <span class="font-semibold text-primary truncate">{{ user.name }}</span>
                        <svg v-if="user.verified || user.is_verified" class="w-4 h-4 text-blue flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.06 4.72l-3.75-3.75 1.41-1.41 2.34 2.34 4.59-4.59 1.41 1.41-6 5.99z"/>
                        </svg>
                    </div>
                    <p class="text-muted text-sm truncate">@{{ user.username }}</p>
                    <p v-if="user.bio" class="text-primary text-sm mt-1 line-clamp-2">{{ user.bio }}</p>
                </div>
                
                <!-- Follow Button -->
                <button
                    @click="toggleFollow(user.id || user._id)"
                    :class="[
                        'px-4 py-1.5 rounded-full text-sm font-semibold transition flex-shrink-0',
                        followedUsers.includes(user.id || user._id)
                            ? 'bg-transparent border border-primary text-primary hover:border-red hover:text-red'
                            : 'bg-primary text-secondary hover:bg-hover'
                    ]"
                >
                    {{ followedUsers.includes(user.id || user._id) ? $t('auth.whoToFollow.following') : $t('auth.whoToFollow.follow') }}
                </button>
            </div>
        </div>

        <!-- Fixed Next Button at bottom -->
        <div class="sticky bottom-0 bg-primary pt-4 pb-8 -mx-8 px-8 sm:-mx-10 sm:px-10 z-10">
            <Button
                id="button-next-follow"
                :disabled="followedUsers.length < 1"
                buttonClass="w-full font-semibold rounded-full py-3 transition"
                :class="[
                    followedUsers.length >= 1
                        ? 'bg-alternate hover:bg-hover-alternate text-alternate'
                        : 'bg-gray text-primary opacity-50 cursor-not-allowed',
                ]"
                :loading-text="$t('auth.common.loading')"
                :is-loading="loading"
                @click="onNext"
            >
                {{ $t('auth.common.next') }}
            </Button>
        </div>
    </Popup>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import Logo from '~/modules/Common/components/Logo'
import Button from '~/modules/Common/components/Button/Button.vue'
import UserImage from '~/modules/Common/components/UserImage/UserImage.vue'
import { useGetWhoToFollowQuery } from '~/modules/explore/queries/useGetExploreQuery'

const { locale } = useI18n()
const isArabic = computed(() => locale.value === 'ar')

const loading = ref(false)
const followedUsers = ref<string[]>([])

// Use the whoToFollow query from explore
const whoToFollowQuery = useGetWhoToFollowQuery(true)
const isLoading = computed(() => whoToFollowQuery.isLoading.value)
const isError = computed(() => whoToFollowQuery.isError.value)
const suggestedUsers = computed(() => whoToFollowQuery.data.value?.data || [])

const emit = defineEmits<{
    (e: 'next', followedUsers: string[]): void
    (e: 'skip'): void
    (e: 'back'): void
    (e: 'close'): void
    (e: 'finish', followedUsers: string[]): void
}>()

const toggleFollow = (userId: string) => {
    const index = followedUsers.value.indexOf(userId)
    if (index === -1) {
        followedUsers.value.push(userId)
    } else {
        followedUsers.value.splice(index, 1)
    }
}

const onNext = () => {
    if (followedUsers.value.length >= 1) {
        loading.value = true
        // Emit finish with followed users
        emit('finish', followedUsers.value)
    }
}

const onSkip = () => {
    emit('skip')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(55, 65, 81, 0.3);
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(107, 114, 128, 0.5);
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(107, 114, 128, 0.7);
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
