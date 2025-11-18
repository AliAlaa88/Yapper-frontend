<template>
    <div
        class="fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm p-4"
    >
        <div
            class="bg-primary text-primary rounded-2xl w-full max-w-lg sm:max-w-xl p-8 sm:p-10 md:p-14 lg:p-20 relative flex flex-col justify-center"
        >
            <!-- Close Button -->
            <closeButton @close="$emit('close')" />

            <!-- Logo -->
            <Logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

            <!-- Title -->
            <h2 class="text-3xl font-bold text-left mb-6">{{ $t('auth.profilePicture.title') }}</h2>
            <p class="text-muted mb-6">{{ $t('auth.profilePicture.info') }}</p>

            <!-- Profile Picture Preview -->
            <div class="flex justify-center mb-6">
                <div
                    class="relative w-32 h-32 rounded-full bg-hover border-2 border-primary overflow-hidden shadow-md"
                >
                    <img
                        v-if="previewImage"
                        :src="previewImage"
                        alt="Profile Preview"
                        class="w-full h-full object-cover"
                    />
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
                />
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
            <button
                id="button-next-profile-picture"
                v-if="previewImage"
                class="w-full bg-alternate hover:bg-hover-alternate text-alternate cursor-pointer font-semibold rounded-full py-2 transition duration-200 mb-3"
                @click="onNext"
            >
                {{ $t('auth.common.next') }}
            </button>

            <!-- Skip Button -->
            <button
                id="button-skip-profile-picture"
                class="w-full text-primary cursor-pointer hover:text-blue transition duration-200"
                @click="onSkip"
            >
                {{ $t('auth.common.skip') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import closeButton from '../closeButton.vue'
import backButton from '../backButton.vue'
import Logo from '~/modules/Common/components/Logo'

// Use v-model for profile picture
const profilePicture = defineModel<string | null>('profilePicture', { default: null })

const previewImage = ref<string | null>(profilePicture.value)
const selectedFile = ref<File | null>(null)
const errorMessage = ref('')

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

const onNext = () => {
    if (previewImage.value) {
        // In a real app, you would upload the image here and get a URL
        // For now, we'll just pass the data URL
        emit('next', previewImage.value)
    }
}

const onSkip = () => {
    emit('skip')
}
</script>
