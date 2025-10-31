<template>
    <OAuthStep1 v-if="showStep1" :OAuth_session_token="oauth_session_token" @finish="onFinish" @close="onClose" />
    <CompleteAccount v-if="showCompleteAccount" :skipImg="true" :Recommendations="recommendations" @close="onClose" @finish="navigateTo('/auth')" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import OAuthStep1 from './subComponents/OAuthComponents/OAuthStep1.vue';
import CompleteAccount from './CompleteAccount.vue';
const props = defineProps<{
    oauth_session_token: string;
}>();
const oauth_session_token = ref(props.oauth_session_token);
const showStep1 = ref(true);
const showCompleteAccount = ref(false);
const recommendations = ref<string[]>([]);
const onFinish = (Recommendations: string[]) => {
    showStep1.value = false;
    showCompleteAccount.value = true;
    recommendations.value = Recommendations;
};

const onBack = () => {
    console.log("Navigating back to Step 1");
    showCompleteAccount.value = false;
    showStep1.value = true;
};

const onClose = () => {
    console.log("Closing OAuth complete flow");
    navigateTo('/auth'); 
};
</script>