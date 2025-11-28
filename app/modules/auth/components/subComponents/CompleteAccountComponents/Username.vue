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
            <h2 class="text-3xl font-bold mb-6" :class="isArabic ? 'text-right' : 'text-left'">{{ $t('auth.username.title') }}</h2>
            <p class="text-muted mb-6">{{ $t('auth.username.info') }}</p>

            <!-- Username Input -->
            <div class="mb-6">
                <div class="relative">
                    <span 
                        class="absolute top-1/2 -translate-y-1/2 text-muted"
                        :class="isArabic ? 'right-4' : 'left-4'"
                    >@</span>
                    <input
                        id="input-username-complete"
                        v-model="username"
                        type="text"
                        :placeholder="$t('auth.username.placeholder')"
                        class="w-full bg-primary text-primary border-2 border-primary rounded-full py-2.5 focus:outline-none focus:border-blue transition-colors shadow-sm"
                        :class="isArabic ? 'pr-8 pl-4' : 'pl-8 pr-4'"
                        maxlength="15"
                        @input="validateUsername"
                    />
                </div>
                <div class="flex justify-between mt-2 px-4">
                    <p v-if="errorMessage" id="error-message-username" class="text-red text-sm">
                        {{ errorMessage }}
                    </p>
                    <p
                        v-else-if="username && username.length > 0"
                        id="success-message-username"
                        class="text-green text-sm"
                    >
                        {{ $t('auth.username.available') }}
                    </p>
                    <p v-else class="text-transparent text-sm">.</p>
                    <p class="text-muted text-sm">{{ username?.length || 0 }}/15</p>
                </div>
            </div>

            <!-- Recommendations -->
            <div
                v-if="props.Recommendations && props.Recommendations.length"
                class="my-2 text-sm text-muted"
            >
                <p>{{ $t('auth.username.recommendations') }}</p>
                <ul class="mt-1 flex flex-wrap gap-2">
                    <li
                        v-for="(suggestion, index) in props.Recommendations"
                        :key="index"
                        :id="`recommendation-${index}-username`"
                        class="px-2 py-1 border-2 border-primary text-primary rounded-md cursor-pointer hover:bg-hover transition duration-200 shadow-sm"
                        @click="username = suggestion"
                    >
                        {{ suggestion }}
                    </li>
                </ul>
            </div>

            <!-- Next Button -->
            <button
                id="button-next-username"
                :disabled="!isValid"
                :class="[
                    'w-full font-semibold rounded-full py-2 transition my-3 duration-200',
                    isValid
                        ? 'bg-alternate hover:bg-hover-alternate text-alternate cursor-pointer'
                        : 'bg-alternate text-alternate opacity-50 cursor-not-allowed',
                ]"
                @click="onNext"
            >
                {{ $t('auth.common.next') }}
            </button>

            <!-- Skip Button -->
            <button
                id="button-skip-username"
                class="w-full text-primary hover:text-blue transition duration-200"
                @click="onSkip"
            >
                {{ $t('auth.common.skip') }}
            </button>
    </Popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import backButton from '../backButton.vue'
import Logo from '~/modules/Common/components/Logo'
import { useUpdateUsernameMutation } from '../../../queries/useCompleteProfileQuery'

const { locale } = useI18n()
const isArabic = computed(() => locale.value === 'ar')

// Use v-model for username
const username = defineModel<string | null>('username', { default: null })

const errorMessage = ref('')
const isSubmitting = ref(false)

const emit = defineEmits<{
    (e: 'next', username: string): void
    (e: 'skip'): void
    (e: 'back'): void
    (e: 'close'): void
}>()

const props = defineProps<{
    Recommendations: string[]
}>()

const validateUsername = () => {
    const value = username.value

    if (!value || value.length === 0) {
        errorMessage.value = ''
        return
    }

    if (value.length < 3) {
        errorMessage.value = 'Username must be at least 3 characters'
        return
    }

    if (value.length > 25){
        errorMessage.value = 'Username must be shorter than 25 characters'
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
}

const isValid = computed(() => {
    return username.value && username.value.length >= 3 && !errorMessage.value
})

const usernameMutation = useUpdateUsernameMutation(
    (data) => {
        isSubmitting.value = false
        errorMessage.value = ''
        emit('next', username.value!)
    },
    (error) => {
        console.error('Username update error:', error)
        isSubmitting.value = false
        const errorMsg = error?.response?.data?.message || error?.message || 'Failed to update username'
        errorMessage.value = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg
    }
)

const onNext = () => {
    if (isValid.value && username.value && !isSubmitting.value) {
        isSubmitting.value = true
        usernameMutation.mutate({ username: username.value })
    }
}

const onSkip = () => {
    emit('skip')
}
</script>
