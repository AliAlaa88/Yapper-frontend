<template>
    <Popup
        :isOpen="true"
        @close="$emit('close')"
        :hasCloseButton="false"
        contentClass="sm:max-w-2xl w-full"
        :headerClass="isArabic ? 'absolute top-4 right-4 z-10 bg-transparent p-0' : 'absolute top-4 left-4 z-10 bg-transparent p-0'"
        slotClass="pt-4 px-8 pb-8 sm:pt-6 sm:px-10 sm:pb-10"
        @back="$emit('back')"
        :hasBackButton="true"
    >
        <!-- Logo at top -->
        <div class="flex justify-center mb-6">
            <Logo imgClass="w-8 lg:w-10" />
        </div>

            <!-- Title -->
            <h2 class="text-2xl font-bold mb-2" :class="isArabic ? 'text-right' : 'text-left'">{{ $t('auth.interests.title') }}</h2>
            <p class="text-muted text-sm mb-6" :class="isArabic ? 'text-right' : 'text-left'">{{ $t('auth.interests.info') }}</p>

            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
                {{ errorMessage }}
            </div>

            <!-- Interests Grid -->
            <div class="max-h-80 overflow-y-auto mb-4 custom-scrollbar">
                <div class="grid grid-cols-3 gap-3">
                    <button
                        v-for="interest in interests"
                        :key="interest.id"
                        :id="`button-interest-${interest.id}`"
                        :class="[
                            'aspect-square rounded-xl text-sm font-medium transition border flex items-end p-4',
                            selectedInterests.includes(interest.id)
                                ? 'bg-alternate text-alternate border-alternate'
                                : 'border-primary text-primary hover:border-blue hover:text-blue',
                            isArabic ? 'justify-end text-right' : 'justify-start text-left'
                        ]"
                        @click="toggleInterest(interest.id)"
                    >
                      {{ interest.name }}
                    </button>
                </div>
            </div>

            <!-- Footer with selection counter and next button -->
            <div class="flex items-center justify-between mt-6 pt-4 border-t border-primary">
                <!-- Selection Counter -->
                <p class="text-muted text-sm">
                    {{ selectedInterests.length }} {{ $t('auth.interests.selected')}}
                </p>
                
                <!-- Next Button -->
                <Button
                    id="button-next-interests"
                    :disabled="selectedInterests.length < 1"
                    buttonClass="px-8 py-2 font-semibold rounded-full transition"
                    :class="[
                        selectedInterests.length >= 1
                            ? 'bg-alternate hover:bg-hover-alternate text-alternate'
                            : 'bg-muted text-muted opacity-50 cursor-not-allowed',
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
import { useUpdateInterestsMutation } from '../../../queries/useCompleteProfileQuery'
import Button from '~/modules/Common/components/Button/Button.vue'
import { useFetchInterests } from '~/modules/auth/queries/useCompleteProfileQuery'
const { locale } = useI18n()
const isArabic = computed(() => locale.value === 'ar')

const errorMessage = ref('')
const isSubmitting = ref(false)
const loading = ref(false)

interface Interest {
    id: string
    name: string
}

const interests = ref<Interest[]>([])

const fetchInterests = useFetchInterests((data: any) => {

    interests.value = data.data.map((item: any, index: number) => ({
        // id is index + 1
        id: (index + 1).toString(),
        name: item,
    }))
    //
}, (error: any) => {
    console.error('Error fetching interests:', error)
    errorMessage.value = 'Failed to load interests'
})

fetchInterests.mutate();
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
        console.log('Interests update success:', data)
        isSubmitting.value = false
        loading.value = false
        errorMessage.value = ''
        emit('next', selectedInterests.value)
    },
    (error) => {
        console.error('Interests update error:', error)
        isSubmitting.value = false
        loading.value = false
        const errorMsg = error?.response?.data?.message || error?.message || 'Failed to update interests'
        errorMessage.value = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg
    }
)

const onNext = () => {
    if (selectedInterests.value.length >= 1 && !isSubmitting.value) {
        console.log('Submitting interests:', selectedInterests.value)
        isSubmitting.value = true
        loading.value = true
        errorMessage.value = '' // Clear previous errors
        // categoryIds are the selected interest ids
        const categoryIds = selectedInterests.value.map(id => parseInt(id))
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
