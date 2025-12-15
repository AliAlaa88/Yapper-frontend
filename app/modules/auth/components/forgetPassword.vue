<template>
    <forgetPasswordStep1
        v-if="showStep1"
        v-model:identifier="forgotPasswordData.identifier"
        @next="onNextS1"
        @close="onClose"
    />
    <forgetPasswordStep2
        v-if="showStep2"
        v-model:otp="forgotPasswordData.otp"
        :identifier="forgotPasswordData.identifier"
        @next="onNextS2"
        @back="onBackToS1"
        @close="onClose"
    />
    <forgetPasswordStep3
        v-if="showStep3"
        v-model:password="forgotPasswordData.password"
        v-model:confirm-password="forgotPasswordData.confirmPassword"
        :identifier="forgotPasswordData.identifier"
        :reset_token="forgotPasswordData.resetToken"
        @back="onBackToS2"
        @close="onClose"
        @finish="$emit('finish')"
    />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import forgetPasswordStep1 from './subComponents/forgetPasswordComponents/forgetPasswordStep1.vue'
import forgetPasswordStep2 from './subComponents/forgetPasswordComponents/forgetPasswordStep2.vue'
import forgetPasswordStep3 from './subComponents/forgetPasswordComponents/forgetPasswordStep3.vue'

const showStep1 = ref(true)
const showStep2 = ref(false)
const showStep3 = ref(false)

// Centralized forgot password state
const forgotPasswordData = reactive({
    identifier: '',
    otp: '',
    resetToken: '',
    password: '',
    confirmPassword: '',
})

const onNextS1 = (Identifier: string) => {
    showStep1.value = false
    showStep2.value = true
    forgotPasswordData.identifier = Identifier
}

const onNextS2 = (reset_token: string) => {
    showStep2.value = false
    showStep3.value = true
    forgotPasswordData.resetToken = reset_token
}

const onBackToS1 = () => {
    showStep2.value = false
    showStep1.value = true
}

const onBackToS2 = () => {
    showStep3.value = false
    showStep2.value = true
}

const onClose = () => {
    navigateTo('/auth') // Redirect to home or desired page
}
</script>
