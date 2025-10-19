<template>
  <div class="min-h-svh grid grid-cols-1 bg-[#5B7083] text-white">
    <ForgetPassword v-if="showModal" @close="closeModal" class="w-full h-full" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ForgetPassword from "../components/forgetPassword.vue";
const showModal = ref(true);
const closeModal = () => {
  showModal.value = false;
  // forward to home  rgba(91, 112, 131, 0.4);
  window.location.href = "/";
};
</script>
