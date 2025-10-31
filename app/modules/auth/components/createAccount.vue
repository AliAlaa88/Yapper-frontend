<template>
  <createAccount v-if="showSignupStep1" @next="onNext" @close="goBack()" />
  <verifyOtp v-if="showVerifyOtp" @close="onCloseVerify" :Email="Email" @next="onFinal" />
  <FinalRegister v-if="showFinalStep" @close="goBack()" :username="username" :Email="Email" @finish="onSignupFinish" />
  <CompleteAccount v-if="showCompleteAccount" @close="onCompleteAccountClose" @finish="onCompleteAccountFinish" :Recommendations="Recommendations" />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import verifyOtp from "./subComponents/signupComponents/verifyOtp.vue";
import createAccount from "./subComponents/signupComponents/createAccount.vue";
import FinalRegister from "./subComponents/signupComponents/FinalRegister.vue";
import CompleteAccount from "./CompleteAccount.vue";
import { useRouter } from "vue-router";
const showSignupStep1 = ref(true);
const showVerifyOtp = ref(false);
const showFinalStep = ref(false);
const showCompleteAccount = ref(false);
const Email = ref('');
const Recommendations = ref<string[]>([]);
const username = ref('');
const router = useRouter();

const onNext = async (email: string) => {
   showSignupStep1.value = false;
   showVerifyOtp.value = true;
   Email.value = email;
   console.log("Email for OTP verification:", email);
};

const onFinal = async (recommendations: string[]) => {
   showVerifyOtp.value = false;
   showFinalStep.value = true;
   Recommendations.value = recommendations;
   username.value = recommendations[0] ?? '';
};

const onCloseVerify = () => {
   showVerifyOtp.value = false;
   showSignupStep1.value = true;
};

const onSignupFinish = () => {
   showFinalStep.value = false;
   showCompleteAccount.value = true;
};

const onCompleteAccountClose = () => {
   showCompleteAccount.value = false;
   onFinish();
};

const onCompleteAccountFinish = (data: any) => {
   console.log("Profile completion data:", data);
   showCompleteAccount.value = false;
   onFinish();
};



const goBack = () => {
  router.push("/auth");
};

const onFinish = () => {
  // Signup complete, redirect back to auth or home
  router.push("/auth");
};

</script>