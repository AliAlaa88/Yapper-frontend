<template>
    <Popup
        :isOpen="true"
        @close="$emit('close')"
        :hasCloseButton="false"
        @back="$emit('back')"
        :hasBackButton="true"
        contentClass="max-w-lg sm:max-w-xl w-full"
        headerClass=""
        slotClass="pt-4 px-8 pb-8 sm:pt-6 sm:px-10 sm:pb-10"
    >
        <!-- Logo at top -->
        <div class="flex justify-center mb-6">
            <Logo imgClass="w-8 lg:w-10" />
        </div>

            <!-- Title -->
            <h2 class="text-2xl font-bold mb-2" :class="isArabic ? 'text-right' : 'text-left'">{{ $t('auth.username.title') }}</h2>
            <p class="text-muted text-sm mb-6" :class="isArabic ? 'text-right' : 'text-left'">{{ $t('auth.username.info') }}</p>

            <!-- Username Input -->
            <div class="mb-6">
                <label class="block text-blue text-sm font-medium mb-2">{{ $t('auth.username.label') || 'Username' }}</label>
                <div class="relative">
                    <input
                        id="input-username-complete"
                        v-model="username"
                        type="text"
                        :placeholder="'@' + $t('auth.username.placeholder')"
                        class="w-full bg-primary text-primary border-2 border-primary focus:border-blue rounded-lg py-3 px-4 focus:outline-none transition-colors placeholder-muted"
                        :class="isArabic ? 'text-right' : 'text-left'"
                        maxlength="20"
                    />
                    <!-- Checkmark for valid username -->
                    <svg
                        v-if="isValid && !errorMessage"
                        class="absolute top-1/2 -translate-y-1/2 w-6 h-6 text-green"
                        :class="isArabic ? 'left-4' : 'right-4'"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
                <div class="flex justify-end mt-2 px-1">
                    <p class="text-muted text-sm">{{ username?.length || 0 }}/20</p>
                </div>
                <div v-if="errorMessage" class="px-1 mt-1">
                    <p id="error-message-username" class="text-red text-sm">
                        {{ errorMessage }}
                    </p>
                </div>
            </div>

            <!-- Recommendations -->
            <div
                v-if="props.Recommendations && props.Recommendations.length"
                class="mb-6 text-sm"
            >
                <p class="text-muted mb-3">{{ $t('auth.username.recommendations') }}</p>
                <ul class="flex flex-wrap gap-2">
                    <li
                        v-for="(suggestion, index) in displayedRecommendations"
                        :key="index"
                        :id="`recommendation-${index}-username`"
                        class="text-blue hover:text-blue-light cursor-pointer transition duration-200"
                        @click="username = suggestion"
                    >
                        @{{ suggestion }}
                    </li>
                </ul>
                <!-- Show More button -->
                <button
                    v-if="!showAllRecommendations && props.Recommendations.length > recommendationsToShow"
                    @click="showAllRecommendations = true"
                    class="mt-3 text-blue hover:text-blue-light transition duration-200 text-sm"
                >
                    {{ $t('auth.username.showMore') || 'Show more' }}
                </button>
                <button
                    v-else-if="showAllRecommendations && props.Recommendations.length > recommendationsToShow"
                    @click="showAllRecommendations = false"
                    class="mt-3 text-blue hover:text-blue-light transition duration-200 text-sm"
                >
                    {{ $t('auth.username.showLess') || 'Show less' }}
                </button>
            </div>

            <!-- Next Button -->
            <Button
                id="button-next-username"
                :disabled="!isValid"
                buttonClass="w-full font-semibold rounded-full py-2 transition my-3 duration-200"
                :class="[
                    isValid
                        ? 'bg-alternate hover:bg-hover-alternate text-alternate'
                        : 'bg-alternate text-alternate opacity-50',
                ]"
                :loading-text="$t('auth.common.loading')"
                :is-loading="loading"
                @click="onNext"
            >
                {{ $t('auth.common.next') }}
            </Button>

            <!-- Skip Button -->
            <Button
                id="button-skip-username"
                class="w-full text-primary hover:text-blue transition duration-200"
                @click="onSkip"
            >
                {{ $t('auth.common.skip') }}
            </Button>
    </Popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import Logo from '~/modules/Common/components/Logo'
import { useUpdateUsernameMutation } from '../../../queries/useCompleteProfileQuery'
import Button from '~/modules/Common/components/Button/Button.vue'
import { checkIdentifier } from '~/modules/auth/queries/useRegisterQuery'
import { useDebounce } from '~/modules/Common/composables/useDebounce'

const { locale } = useI18n()
const isArabic = computed(() => locale.value === 'ar')

// Use v-model for username
const username = defineModel<string | null>('username', { default: null })

// Debounce username input for validation
const debouncedUsername = useDebounce(username, 500)

const errorMessage = ref('')
const isSubmitting = ref(false)
const loading = ref(false)
const showAllRecommendations = ref(false)
const recommendationsToShow = 2 // Show 2 recommendations initially

const emit = defineEmits<{
    (e: 'next', username: string): void
    (e: 'skip'): void
    (e: 'back'): void
    (e: 'close'): void
}>()

const props = defineProps<{
    Recommendations: string[]
}>()


const checkIdentifierMutation = checkIdentifier(
    (data) => {
        if(data.data.identifier_type === 'username'){
            if(errorMessage.value === '')
                errorMessage.value = 'this username is already in use.'
        }
        else
            if(errorMessage.value === '')
                errorMessage.value = 'invalid username format.'
    },
    (err: any) => {
        const errorMsg =
            err?.response?.data?.message || err?.message || 'Identifier check failed. Please try again.'
        if(errorMsg.includes('Username not found')){
            if(errorMessage.value === '')
                errorMessage.value = ''
        } else {
            if(errorMessage.value === '')
                errorMessage.value = 'invalid username format.'
        }
    },
)

const validateUsername = (value: string | null) => {
    if (!value || value.length === 0) {
        errorMessage.value = ''
        return
    }

    if (value.length < 3) {
        errorMessage.value = 'Username must be at least 3 characters'
        return
    }

    if (value.length > 20){
        errorMessage.value = 'Username must be shorter than 20 characters'
        return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        errorMessage.value = 'Only letters, numbers, and underscores allowed'
        return
    }

    if (/^[0-9]/.test(value)) {
        errorMessage.value = 'Username cannot start with a number'
        return
    }

    errorMessage.value = ''
    if(value === props.Recommendations[0])
        return
    checkIdentifierMutation.mutate(value)
}

// Watch debounced username for validation
watch(debouncedUsername, (newValue) => {
    validateUsername(newValue)
})

const isValid = computed(() => {
    return username.value && username.value.length >= 3 && !errorMessage.value
})

const displayedRecommendations = computed(() => {
    if (!props.Recommendations) return []
    if (showAllRecommendations.value) {
        return props.Recommendations
    }
    return props.Recommendations.slice(0, recommendationsToShow)
})

const usernameMutation = useUpdateUsernameMutation(
    props.Recommendations[0],
    (data) => {
        isSubmitting.value = false
        loading.value = false
        errorMessage.value = ''
        emit('next', username.value!)
    },
    (error) => {
        console.error('error');
        console.error('Username update error:', error)
        isSubmitting.value = false
        loading.value = false
        const errorMsg = error?.response?.data?.message || error?.message || 'Failed to update username'
        errorMessage.value = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg
    }
)

const onNext = () => {
    if (isValid.value && username.value && !isSubmitting.value) {
        isSubmitting.value = true
        loading.value = true
        if (username.value === props.Recommendations[0]){
            loading.value = false
            errorMessage.value = ''
            isSubmitting.value = false
            emit('next', username.value)
        }
        else
            usernameMutation.mutate({ username: username.value })
    }
}

const onSkip = () => {
    emit('skip')
}
</script>
