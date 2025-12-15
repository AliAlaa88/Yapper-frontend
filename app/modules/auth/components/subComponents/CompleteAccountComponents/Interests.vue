<template>
    <Popup
        :is-open="true"
        :has-close-button="false"
        content-class="sm:max-w-xl w-full"
        :header-class="
            isArabic
                ? 'absolute top-4 right-4 z-10 bg-transparent p-0'
                : 'absolute top-4 left-4 z-10 bg-transparent p-0'
        "
        slot-class="py-2 px-10 sm:px-10 md:px-12 lg:px-14"
        :has-back-button="true"
        @close="$emit('close')"
        @back="$emit('back')"
    >
        <!-- Back Button -->

        <!-- Logo -->
        <Logo img-class="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

        <!-- Title -->
        <h2 class="text-3xl font-bold mb-6" :class="isArabic ? 'text-right' : 'text-left'">
            {{ $t('auth.interests.title') }}
        </h2>
        <p class="text-muted mb-6">{{ $t('auth.interests.info') }}</p>

        <!-- Interests Grid -->
        <div class="max-h-64 overflow-y-auto mb-6 custom-scrollbar">
            <div class="grid grid-cols-2 gap-3">
                <button
                    v-for="interest in interests"
                    :id="`button-interest-${interest.id}`"
                    :key="interest.id"
                    :class="[
                        'px-4 py-3 rounded-full text-sm font-medium transition shadow-sm',
                        selectedInterests.includes(interest.id)
                            ? 'bg-alternate text-alternate border border-transparent'
                            : 'border border-primary text-primary hover:bg-hover',
                    ]"
                    @click="toggleInterest(interest.id)"
                >
                    {{ interest.name }}
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
        <Button
            id="button-next-interests"
            :disabled="selectedInterests.length < 3"
            button-class="w-full font-semibold rounded-full py-2 transition mb-3"
            :class="[
                selectedInterests.length >= 3
                    ? 'bg-alternate hover:bg-hover-alternate text-alternate'
                    : 'bg-alternate text-alternate',
            ]"
            :loading-text="$t('auth.common.loading')"
            :is-loading="loading"
            @click="onNext"
        >
            {{ $t('auth.common.next') }}
        </Button>

        <!-- Skip Button -->
        <Button
            id="button-skip-interests"
            class="w-full text-primary hover:text-blue transition duration-200"
            @click="onSkip"
        >
            {{ $t('auth.common.skip') }}
        </Button>
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

const fetchInterests = useFetchInterests(
    (data: any) => {
        interests.value = data.data.map((item: any, index: number) => ({
            // id is index + 1
            id: (index + 1).toString(),
            name: item,
        }))
        //
    },
    (error: any) => {
        console.error('Error fetching interests:', error)
        errorMessage.value = 'Failed to load interests'
    },
)

fetchInterests.mutate()
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
        isSubmitting.value = false
        loading.value = false
        errorMessage.value = ''
        emit('finish', selectedInterests.value)
    },
    (error) => {
        console.error('Interests update error:', error)
        isSubmitting.value = false
        loading.value = false
        const errorMsg =
            error?.response?.data?.message || error?.message || 'Failed to update interests'
        errorMessage.value = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg
    },
)

const onNext = () => {
    if (selectedInterests.value.length >= 3 && !isSubmitting.value) {
        isSubmitting.value = true
        loading.value = true
        // categoryIds are the selected interest ids
        const categoryIds = selectedInterests.value.map((id) => parseInt(id))
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
