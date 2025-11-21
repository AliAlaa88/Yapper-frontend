<template>
    <Popup
        :isOpen="true"
        @close="$emit('close')"
        :hasCloseButton="false"
        contentClass="max-w-lg sm:max-w-xl w-full"
        headerClass=""
        slotClass="p-8 sm:p-10 md:p-14 lg:p-20"
    >
        <!-- Back Button -->
        <backButton @close="$emit('back')" />
        
        <!-- Logo -->
        <Logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

            <!-- Title -->
            <h2 class="text-3xl font-bold mb-6" :class="isArabic ? 'text-right' : 'text-left'">{{ $t('auth.interests.title') }}</h2>
            <p class="text-muted mb-6">{{ $t('auth.interests.info') }}</p>

            <!-- Interests Grid -->
            <div class="max-h-64 overflow-y-auto mb-6 custom-scrollbar">
                <div class="grid grid-cols-2 gap-3">
                    <button
                        v-for="interest in interests"
                        :key="interest.id"
                        :id="`button-interest-${interest.id}`"
                        :class="[
                            'px-4 py-3 rounded-full text-sm font-medium transition shadow-sm',
                            selectedInterests.includes(interest.id)
                                ? 'bg-alternate text-alternate border-2 border-transparent'
                                : 'border-2 border-primary text-primary hover:bg-hover',
                        ]"
                        @click="toggleInterest(interest.id)"
                    >
                        {{ interest.icon }} {{ interest.name }}
                    </button>
                </div>
            </div>

            <!-- Selection Counter -->
            <p class="text-center text-muted text-sm mb-6">
                {{ selectedInterests.length }} {{ $t('auth.common.selectedSuffix') }}
                <span v-if="selectedInterests.length < 3" class="text-red-400">
                    ({{ 3 - selectedInterests.length }} {{ $t('auth.common.neededMoreSuffix') }})
                </span>
            </p>

            <!-- Next Button -->
            <button
                id="button-next-interests"
                :disabled="selectedInterests.length < 3"
                :class="[
                    'w-full font-semibold rounded-full py-2 transition mb-3',
                    selectedInterests.length >= 3
                        ? 'bg-alternate hover:bg-hover-alternate text-alternate  cursor-pointer'
                        : 'bg-alternate text-alternate cursor-not-allowed',
                ]"
                @click="onNext"
            >
                {{ $t('auth.common.next') }}
            </button>

            <!-- Skip Button -->
            <button
                id="button-skip-interests"
                class="w-full text-primary hover:text-blue transition duration-200"
                @click="onSkip"
            >
                {{ $t('auth.common.skip') }}
            </button>
    </Popup>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import backButton from '../backButton.vue'
import Logo from '~/modules/Common/components/Logo'
import { useUpdateInterestsMutation } from '../../../queries/useCompleteProfileQuery'

const { locale } = useI18n()
const isArabic = computed(() => locale.value === 'ar')

const errorMessage = ref('')
const isSubmitting = ref(false)

interface Interest {
    id: string
    name: string
    icon: string
}

const interests: Interest[] = [
    { id: 'tech', name: 'Technology', icon: '💻' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'art', name: 'Art', icon: '🎨' },
    { id: 'food', name: 'Food', icon: '🍔' },
    { id: 'travel', name: 'Travel', icon: '✈️' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'fashion', name: 'Fashion', icon: '👗' },
    { id: 'fitness', name: 'Fitness', icon: '💪' },
    { id: 'movies', name: 'Movies', icon: '🎬' },
    { id: 'books', name: 'Books', icon: '📚' },
    { id: 'photography', name: 'Photography', icon: '📸' },
    { id: 'nature', name: 'Nature', icon: '🌿' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'politics', name: 'Politics', icon: '🏛️' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'health', name: 'Health', icon: '🏥' },
    { id: 'pets', name: 'Pets', icon: '🐾' },
    { id: 'comedy', name: 'Comedy', icon: '😂' },
]

// Use v-model for selected interests
const selectedInterests = defineModel<string[]>('selectedInterests', { default: [] })

const emit = defineEmits<{
    (e: 'next', interests: string[]): void
    (e: 'skip'): void
    (e: 'back'): void
    (e: 'close'): void
    (e: 'finish', interests: string[]): void
}>()

const toggleInterest = (id: string) => {
    const index = selectedInterests.value.indexOf(id)
    if (index === -1) {
        selectedInterests.value.push(id)
    } else {
        selectedInterests.value.splice(index, 1)
    }
}

const interestsMutation = useUpdateInterestsMutation(
    (data) => {
        console.log('Interests updated:', data)
        isSubmitting.value = false
        errorMessage.value = ''
        emit('finish', selectedInterests.value)
    },
    (error) => {
        console.error('Interests update error:', error)
        isSubmitting.value = false
        const errorMsg = error?.response?.data?.message || error?.message || 'Failed to update interests'
        errorMessage.value = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg
    }
)

const onNext = () => {
    if (selectedInterests.value.length >= 3 && !isSubmitting.value) {
        isSubmitting.value = true
        // Convert string IDs to numbers (assuming interests have numeric IDs from backend)
        const categoryIds = interests
            .filter(interest => selectedInterests.value.includes(interest.id))
            .map((_, index) => index + 1) // You may need to adjust this based on actual backend IDs
        interestsMutation.mutate({ categoryIds })
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
</style>
