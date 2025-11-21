<template>
    <OAuthStep1 v-if="showStep1" :OAuth_session_token="oauth_session_token" @finish="onFinish" @close="onClose" />
    <CompleteAccount v-if="showCompleteAccount" :skipImg="true" :Recommendations="recommendations" @close="onClose" @finish="navigateTo('/auth')" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import OAuthStep1 from './subComponents/OAuthComponents/OAuthStep1.vue';
import CompleteAccount from './CompleteAccount.vue';
import { useExchangeTokenQuery } from '~/modules/auth/queries/useOAuthQuery';
const props = defineProps<{
    exchange_token: string;
}>();
const oauth_session_token = ref<string>('');
const exchangeTokenMutation = useExchangeTokenQuery(
    (data: any) => {
        console.log("Exchange Token Success:", data);
        oauth_session_token.value = data.session_token;
    },
    (error: any) => {
        console.error("Exchange Token Error:", error);
        window.location.href = '/auth';
    },
);

const exchange_token = ref(props.exchange_token);
onMounted(() => {
    exchangeTokenMutation.mutate({ exchange_token: exchange_token.value });
});

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