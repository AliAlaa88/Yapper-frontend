<template>
    <RecaptchaV2
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

const widgetId = ref<number | null>(null)
const { handleExecute } = useRecaptcha()

const onWidgetId = (id: number) => {
    widgetId.value = id
}

const onVerify = (token: string) => {
    emit('verified', token)
}

const onError = () => {
    emit('error', new Error('reCAPTCHA failed to load/execute'))
}

const run = async () => {
    if (widgetId.value == null) return
    handleExecute(widgetId.value)
}

defineExpose({ run })
</script>
