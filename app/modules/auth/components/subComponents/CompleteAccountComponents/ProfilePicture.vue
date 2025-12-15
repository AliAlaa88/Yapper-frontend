<template>
    <Popup
        :is-open="true"
        :has-close-button="true"
        content-class="max-w-lg sm:max-w-xl w-full"
        :header-class="
            isArabic
                ? 'absolute top-4 right-4 z-10 bg-transparent p-0'
                : 'absolute top-4 left-4 z-10 bg-transparent p-0'
        "
        slot-class="p-8 sm:p-10 md:p-14 lg:p-20"
        @close="$emit('close')"
    >
        <!-- Logo -->
        <Logo img-class="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

        <!-- Title -->
        <h2 class="text-3xl font-bold mb-6" :class="isArabic ? 'text-right' : 'text-left'">
            {{ $t('auth.profilePicture.title') }}
        </h2>
        <p class="text-muted mb-6" :class="isArabic ? 'text-right' : 'text-left'">
            {{ $t('auth.profilePicture.info') }}
        </p>

        <!-- Profile Picture Preview -->
        <div class="flex justify-center mb-6">
            <div
                class="relative w-32 h-32 rounded-full bg-hover border border-primary overflow-hidden shadow-md"
            >
                <img
                    v-if="previewImage"
                    :src="previewImage"
                    alt="Profile Preview"
                    class="w-full h-full object-cover"
                >
                <div v-else class="w-full h-full flex items-center justify-center text-muted">
                    <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fill-rule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Upload Button -->
        <label
            class="w-full bg-alternate hover:bg-hover-alternate text-alternate font-semibold cursor-pointer rounded-full py-2 transition mb-3 duration-200 text-center block"
        >
            <input
                id="input-profile-picture-complete"
                type="file"
                accept="image/*"
                class="hidden"
                @change="onFileChange"
            >
            {{ $t('auth.profilePicture.chooseImage') }}
        </label>

        <!-- Error Message -->
        <p
            v-if="errorMessage"
            id="error-message-profile-picture"
            class="text-red text-sm mb-4 text-center"
        >
            {{ errorMessage }}
        </p>

        <!-- Next Button -->
        <Button
            v-if="previewImage"
            id="button-next-profile-picture"
            button-class="w-full bg-alternate hover:bg-hover-alternate text-alternate font-semibold rounded-full py-2 transition duration-200 mb-3"
            :loading-text="$t('auth.common.loading')"
            :is-loading="loading"
            @click="onNext"
        >
            {{ $t('auth.common.next') }}
        </Button>

        <!-- Skip Button -->
        <Button
            id="button-skip-profile-picture"
            class="w-full text-primary hover:text-blue transition duration-200"
            @click="onSkip"
        >
            {{ $t('auth.common.skip') }}
        </Button>
    </Popup>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import Logo from '~/modules/Common/components/Logo'
import {
    useUpdateProfilePictureMutation,
    useUpdateProfileMutation,
} from '../../../queries/useCompleteProfileQuery'
import Button from '~/modules/Common/components/Button/Button.vue'
const { locale } = useI18n()
const isArabic = computed(() => locale.value === 'ar')

// Use v-model for profile picture
const profilePicture = defineModel<string | null>('profilePicture', { default: null })

const previewImage = ref<string | null>(profilePicture.value)
const selectedFile = ref<File | null>(null)
const errorMessage = ref('')
const isUploading = ref(false)
const loading = ref(false)

// Sync preview with model
watch(profilePicture, (newVal) => {
    if (newVal && !previewImage.value) {
        previewImage.value = newVal
    }
})

const emit = defineEmits<{
    (e: 'next', imageUrl: string): void
    (e: 'skip'): void
    (e: 'close'): void
}>()

const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (file) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            errorMessage.value = 'Image size must be less than 5MB'
            return
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            errorMessage.value = 'Please select a valid image file'
            return
        }

        errorMessage.value = ''
        selectedFile.value = file

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
            const imageUrl = e.target?.result as string
            previewImage.value = imageUrl
            profilePicture.value = imageUrl
        }
        reader.readAsDataURL(file)
    }
}

const config = useRuntimeConfig()
const updateProfileMutation = useUpdateProfileMutation(
    (data) => {
        if (config.public.env === 'development') console.log('updating profile pic')
        isUploading.value = false
        errorMessage.value = ''
        emit('next', data.data?.avatar_url || previewImage.value)
    },
    (error) => {
        isUploading.value = false
        loading.value = false
        const errorMsg =
            error?.response?.data?.message || error?.message || 'Failed to update profile'
        errorMessage.value = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg
    },
)

const uploadMutation = useUpdateProfilePictureMutation(
    (data) => {
        const avatarUrl = data.data?.image_url || data.image_url
        if (config.public.env === 'development') console.log(avatarUrl)
        if (avatarUrl) {
            updateProfileMutation.mutate({
                image_url: avatarUrl,
            })
        } else {
            isUploading.value = false
            loading.value = false
            errorMessage.value = 'Failed to get avatar URL from upload response'
        }
    },
    (error) => {
        console.error('Profile picture upload error:', error)
        isUploading.value = false
        loading.value = false
        const errorMsg =
            error?.response?.data?.message || error?.message || 'Failed to upload profile picture'
        errorMessage.value = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg
    },
)

const onNext = () => {
    if (selectedFile.value && !isUploading.value) {
        isUploading.value = true
        loading.value = true
        uploadMutation.mutate({ profilePicture: selectedFile.value })
    } else if (previewImage.value && !selectedFile.value) {
        // Already uploaded or using existing image
        emit('next', previewImage.value)
    }
}

const onSkip = () => {
    emit('skip')
}
</script>
