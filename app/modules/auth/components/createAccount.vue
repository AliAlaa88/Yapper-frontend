<template>
  <createAccount v-if="showSignupStep1" @next="onNext" @close="$emit('close')" />
  <verifyOtp v-if="showVerifyOtp" @close="onCloseVerify" :Email="Email" @next="onFinal" />
  <FinalRegister v-if="showFinalStep" @close="$emit('close')" :recommendations="Recommendations" :Email="Email" @finish="$emit('finish')" />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import verifyOtp from "./subComponents/signupComponents/verifyOtp.vue";
import createAccount from "./subComponents/signupComponents/createAccount.vue";
import FinalRegister from "./subComponents/signupComponents/FinalRegister.vue";
const showSignupStep1 = ref(true);
const showVerifyOtp = ref(false);
const showFinalStep = ref(false);
const Email = ref('');
const Recommendations = ref<string[]>([]);
const onNext = async (email: string) => {
   showSignupStep1.value = false;
   showVerifyOtp.value = true;
   Email.value = email;
};

const onFinal = async (recommendations: string[]) => {
   showVerifyOtp.value = false;
   showFinalStep.value = true;
   Recommendations.value = recommendations;
};

const onCloseVerify = () => {
   showVerifyOtp.value = false;
   showSignupStep1.value = true;
};

</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
</style>
