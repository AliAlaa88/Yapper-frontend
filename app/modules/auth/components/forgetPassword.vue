<template>
  <forgetPasswordStep1
    v-if="showStep1"
    @next="onNextS1"
    @close="onClose"
  />
  <forgetPasswordStep2
    v-if="showStep2"
    :identifier="identifier"
    @next="onNextS2"
    @close="onClose"
  />
  <forgetPasswordStep3
    v-if="showStep3"
    :identifier="identifier"
    :reset_token="resetToken"
    @close="onClose"
    @finish="$emit('finish')"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import forgetPasswordStep1 from "./subComponents/forgetPasswordComponents/forgetPasswordStep1.vue";
import forgetPasswordStep2 from "./subComponents/forgetPasswordComponents/forgetPasswordStep2.vue";
import forgetPasswordStep3 from "./subComponents/forgetPasswordComponents/forgetPasswordStep3.vue";
const showStep1 = ref(true);
const showStep2 = ref(false);
const showStep3 = ref(false);
const identifier = ref('');
const resetToken = ref('');
const onNextS1 = (Identifier: string) => {
  showStep1.value = false;
  showStep2.value = true;
  identifier.value = Identifier;
};

const onNextS2 = (reset_token: string) => {
  showStep2.value = false;
  showStep3.value = true;
  resetToken.value = reset_token;
  console.log("Reset token received:", reset_token);
};

const onClose = () => {
  console.log("Closing forget password flow");
  navigateTo('/auth'); // Redirect to home or desired page
};

</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
</style>
