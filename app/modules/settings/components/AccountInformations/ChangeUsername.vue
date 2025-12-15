<template>
    <DetailedPanel :title="t('settings.accountInfo.change_username')">
        <form @submit.prevent="handleSubmit">
            <div class="relative w-full space-y-4">
                <div class="px-4 py-3">
                    <input
                        id="username-input"
                        v-model="newUsername"
                        type="text"
                        :placeholder="t('settings.accountInfo.username')"
                        :disabled="updateUsernameMutation.isPending.value"
                        class="w-full border py-3 px-3 transition text-muted bg-transparent focus:outline-none rounded-md focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="{
                            'border-red-500 focus:ring-red-500':
                                updateUsernameMutation.isError.value,
                            'border-primary': !updateUsernameMutation.isError.value,
                        }"
                        required
                        minlength="3"
                        maxlength="30"
                        pattern="[a-zA-Z0-9_]+"
                        @input="validateUsername"
                    />

                    <div
                        v-if="updateUsernameMutation.isError.value"
                        class="mb-4 bg-red/10 rounded-lg pt-1"
                    >
                        <p class="text-red text-sm">
                            {{ updateUsernameMutation.error.value?.message }}
                        </p>
                    </div>
                </div>
                <div class="w-full border-t border-b border-primary px-4 py-3 mb-2 space-y-4">
                    <h1 class="font-bold text-xl pb-2">
                        {{ t('settings.accountInfo.suggestions') }}
                    </h1>
                    <div
                        v-if="usernameRecommendation.isLoading.value"
                        class="flex w-full justify-center items-center py-4"
                    >
                        <LoadingSpinner />
                    </div>
                    <div
                        v-for="suggestion in usernameRecommendation.data.value.data.recommendations"
                        v-else-if="usernameRecommendation.data.value"
                        :key="suggestion"
                        class="text-accent cursor-pointer hover:underline"
                        @click="selectFromSuggestions(suggestion)"
                    >
                        {{ suggestion }}
                    </div>
                </div>
            </div>
            <div class="px-4 py-4 flex justify-end">
                <Button
                    id="save-username-button"
                    type="submit"
                    :disabled="!canSubmit"
                    :is-loading="updateUsernameMutation.isPending.value"
                    :button-text="t('settings.accountInfo.save')"
                    button-class="bg-accent text-primary font-medium py-2 px-6 rounded-3xl
                    hover:bg-accent-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>
        </form>
    </DetailedPanel>
</template>

<script setup lang="ts">
import DetailedPanel from '../DetailedPanel.vue'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { storeToRefs } from 'pinia'
import Button from '~/modules/Common/components/Button/Button.vue'
import { userSettingsQueries } from '../../queries/userSettingsQueries'
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const username = computed(() => user.value?.username)

const { updateUsernameMutation, usernameRecommendation } = userSettingsQueries()
const newUsername = ref(username.value)
const usernameRegex = /^[a-zA-Z0-9_]+$/

const isValidFormat = computed(() => {
    if (!newUsername.value) return false

    const length = newUsername.value.length
    const validLength = length >= 3 && length <= 30
    const validChars = usernameRegex.test(newUsername.value)

    return validLength && validChars
})

const selectFromSuggestions = (selected: string) => {
    newUsername.value = selected
}

const canSubmit = computed(() => {
    return (
        newUsername.value &&
        newUsername.value !== user.value?.username &&
        isValidFormat.value &&
        !updateUsernameMutation.isPaused.value
    )
})

const validateUsername = (event: Event) => {
    const input = event.target as HTMLInputElement
    newUsername.value = input.value.replace(/[^a-zA-Z0-9_]/g, '')
}

const handleSubmit = async () => {
    if (!canSubmit.value) return
    try {
        await updateUsernameMutation.mutateAsync({ username: newUsername.value ?? '' })
        setTimeout(() => {
            updateUsernameMutation.reset()
        }, 2000)
    } catch (error) {
        console.error('Failed to update username:', error)
    }
}

watch(newUsername, () => {
    if (updateUsernameMutation.isSuccess.value || updateUsernameMutation.isError.value) {
        updateUsernameMutation.reset()
    }
})
</script>
