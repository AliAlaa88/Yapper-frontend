<template>
    <!-- Auth Loading Page -->
    <AuthLoadingPage v-if="showLoadingPage" />
    
    <createAccount 
        v-if="showSignupStep1" 
        v-model:name="signupData.name"
        v-model:email="signupData.email"
        v-model:month="signupData.month"
        v-model:day="signupData.day"
        v-model:year="signupData.year"
        @next="onNext" 
        @close="goBack()" 
    />
    <verifyOtp 
        v-if="showVerifyOtp" 
        v-model:otp="signupData.otp"
        @close="onCloseVerify" 
        :Email="signupData.email" 
        @next="onFinal" 
    />
    <FinalRegister
        v-if="showFinalStep"
        v-model:password="signupData.password"
        v-model:language="signupData.language"
        @close="onCloseFinal"
        :username="username"
        :Email="signupData.email"
        @finish="onSignupFinish"
    />
    <CompleteAccount
        v-if="showCompleteAccount"
        @close="onCompleteAccountClose"
        @finish="onCompleteAccountFinish"
        :Recommendations="Recommendations"
    />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import verifyOtp from './subComponents/signupComponents/verifyOtp.vue'
import createAccount from './subComponents/signupComponents/createAccount.vue'
import FinalRegister from './subComponents/signupComponents/FinalRegister.vue'
import CompleteAccount from './CompleteAccount.vue'
import AuthLoadingPage from './AuthLoadingPage.vue'
import { useRouter } from 'vue-router'

const showSignupStep1 = ref(true)
const showVerifyOtp = ref(false)
const showFinalStep = ref(false)
const showCompleteAccount = ref(false)
const showLoadingPage = ref(false)
const Recommendations = ref<string[]>([])
const username = ref('')
const router = useRouter()

// Centralized state for all signup steps
const signupData = reactive({
    name: '',
    email: '',
    month: '',
    day: '',
    year: '',
    otp: '',
    password: '',
    language: 'en'
})

const onNext = async (email: string) => {
    showSignupStep1.value = false
    showVerifyOtp.value = true
    signupData.email = email
}

const onFinal = async (recommendations: string[]) => {
    showVerifyOtp.value = false
    showFinalStep.value = true
    Recommendations.value = recommendations
    username.value = recommendations[0] ?? ''
}

const onCloseVerify = () => {
    showVerifyOtp.value = false
    showSignupStep1.value = true
}

const onCloseFinal = () => {
    showFinalStep.value = false
    showVerifyOtp.value = true
}

const onSignupFinish = () => {
    showFinalStep.value = false
    showCompleteAccount.value = true
    Recommendations.value = Recommendations.value.splice(1)
}

const onCompleteAccountClose = () => {
    showCompleteAccount.value = false
    onFinish()
}

const onCompleteAccountFinish = (data: any) => {
    showCompleteAccount.value = false
    onFinish()
}

const goBack = () => {
    router.push('/auth')
}

const onFinish = () => {
    // Show loading page during navigation
    showLoadingPage.value = true
    router.push('/')
}
</script>
