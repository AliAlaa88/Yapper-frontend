<template>
    <loginStep1 
        v-if="showStep1" 
        v-model:identifier="loginData.identifier"
        @next="onNext" 
        @close="$emit('close')" 
        @switch="$emit('switch')" 
    />
    <loginStep2
        v-if="showStep2"
        v-model:password="loginData.password"
        :identifier="loginData.identifier"
        :type="loginData.type"
        @finish="onFinish"
        @back="onBack"
        @close="$emit('close')"
        @switch="$emit('switch')"
    />
</template>

<script setup lang="ts">
import loginStep1 from './subComponents/loginComponents/loginStep1.vue'
import loginStep2 from './subComponents/loginComponents/loginStep2.vue'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const showStep2 = ref(false)
const showStep1 = ref(true)
const router = useRouter()

// Centralized login state
const loginData = reactive({
    identifier: '',
    type: '',
    password: ''
})

const onNext = (Identifier: string, Type: string) => {
    showStep2.value = true
    showStep1.value = false
    loginData.identifier = Identifier
    loginData.type = Type
}

const onBack = () => {
    showStep2.value = false
    showStep1.value = true
}

const onFinish = () => {
    // Reset state after successful login
    showStep2.value = false
    showStep1.value = true
    loginData.identifier = ''
    loginData.type = ''
    loginData.password = ''
    router.push('/')
}
</script>
