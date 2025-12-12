<template>
    <div v-if="isTest">
        Test Mode: reCAPTCHA skipped.    
    </div>
    <RecaptchaV2
        v-else
        size="visible"
        @widgetId="onWidgetId"
        @loadCallback="onVerify"
        @errorCallback="onError"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRecaptcha } from 'vue3-recaptcha-v2'

const emit = defineEmits<{
    (e: 'verified', token: string): void
    (e: 'error', error: Error): void
}>()

const config = useRuntimeConfig()
const isTest = config.public.etest?.toString() === 'true'
if (config.public.env === 'development') console.log(config.public.etest)
if (config.public.env === 'development') console.log('reCAPTCHA Test Mode:', isTest)
if (isTest) {
    emit('verified', 'test-captcha-token')
}

const widgetId = ref<number | null>(null)
const { handleExecute } = useRecaptcha()

const onWidgetId = (id: number) => {
    widgetId.value = id
}

const onVerify = (token: string) => {
    emit('verified', token)
}

const onError = (err: any) => {
    emit('error', new Error('reCAPTCHA failed to load/execute'))
}

const run = async () => {
    if (widgetId.value == null) return
    handleExecute(widgetId.value)
}

defineExpose({ run })
</script>
