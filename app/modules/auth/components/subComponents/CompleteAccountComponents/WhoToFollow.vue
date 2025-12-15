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
            
            <!-- Users List using WhoToFollowList component -->
            <WhoToFollowList
                v-else
                :users="suggestedUsers"
                :hide-bio="false"
            />
        </div>

        <!-- Fixed Next Button at bottom -->
        <div class="sticky bottom-0 bg-primary pt-4 pb-8 -mx-8 px-8 sm:-mx-10 sm:px-10 z-10">
            <Button
                id="button-next-follow"
                buttonClass="w-full font-semibold rounded-full py-3 transition"
                class='bg-alternate hover:bg-hover-alternate text-alternate'                
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
import { ref, computed, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import Logo from '~/modules/Common/components/Logo'
import Button from '~/modules/Common/components/Button/Button.vue'
import WhoToFollowList from '~/modules/explore/components/common/WhoToFollowList.vue'
import { useGetWhoToFollowQuery } from '~/modules/explore/queries/useGetExploreQuery'
import { useSnackbar } from '~/modules/profile/composables/useSnackbar'
import { useConfirmation } from '~/modules/profile/composables/useConfirmation'

const { locale } = useI18n()
const isArabic = computed(() => locale.value === 'ar')

// Provide snackbar and confirmation for ProfileFollowAction
const snackbar = useSnackbar()
const confirmation = useConfirmation()
provide('snackbar', snackbar)
provide('confirmation', confirmation)

const loading = ref(false)

// Use the whoToFollow query from explore
const whoToFollowQuery = useGetWhoToFollowQuery(true)
const isLoading = computed(() => whoToFollowQuery.isLoading.value)
const isError = computed(() => whoToFollowQuery.isError.value)
const suggestedUsers = computed(() => whoToFollowQuery.data.value?.data || [])
const emit = defineEmits<{
    (e: 'next'): void
    (e: 'skip'): void
    (e: 'back'): void
    (e: 'close'): void
    (e: 'finish'): void
}>()

const onNext = () => {
    loading.value = true
    // Follow actions are handled by ProfileFollowAction in UserCard
    // Just emit finish to proceed to next step
    emit('finish')
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
