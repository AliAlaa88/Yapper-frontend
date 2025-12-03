<template>
    <div>
        <div v-if="!isProtectedContentVisible && !showPasswordConfirmation" class="flex justify-center py-12">
            <div
                class="animate-spin rounded-full h-8 w-8 border-2
                border-accent border-t-transparent" />
        </div>
        <ConfirmPassword :is-show="showPasswordConfirmation" :is-loading="isConfirmingPassword" :title="title" />
        <div v-if="isProtectedContentVisible">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import ConfirmPassword from './SubComponents/ConfirmPassword.vue'
import { usePasswordProtection } from '~/modules/settings/composables/usePasswordProtection'

defineProps<{
    title: string
}>()

const {
    showPasswordConfirmation,
    isProtectedContentVisible,
    checkPasswordConfirmation,
    isConfirmingPassword,
} = usePasswordProtection()

console.log('is protected content', isProtectedContentVisible)


onMounted(() => {
    checkPasswordConfirmation()
})
</script>
