<template>
    <OAuthStep1 v-if="showStep1" :OAuth_session_token="oauth_session_token" @next="onNext" @close="onClose" />
    <OAuthStep2 v-if="showStep2" :OAuth_session_token="oauth_session_token" :recommendations="recommendations" @back="onBack" @finish="$emit('finish')" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import OAuthStep1 from './subComponents/OAuthComponents/OAuthStep1.vue';
import OAuthStep2 from './subComponents/OAuthComponents/OAuthStep2.vue';
const props = defineProps<{
    oauth_session_token: string;
}>();
const oauth_session_token = ref(props.oauth_session_token);
const showStep1 = ref(true);
const showStep2 = ref(false);
const recommendations = ref<string[]>([]);
const onNext = (Recommendations: string[]) => {
    showStep1.value = false;
    showStep2.value = true;
    recommendations.value = Recommendations;
};

const onBack = () => {
    console.log("Navigating back to Step 1");
    showStep2.value = false;
    showStep1.value = true;
};

const onClose = () => {
    console.log("Closing OAuth complete flow");
    navigateTo('/auth'); 
};
</script>