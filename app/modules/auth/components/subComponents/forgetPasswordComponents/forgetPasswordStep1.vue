<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
    <div class="bg-black text-white rounded-2xl w-full max-w-sm p-8 relative   
             sm:rounded-2xl sm:max-w-sm sm:h-auto 
             h-full sm:p-8 p-6 flex flex-col justify-center">
      <button
        class="absolute top-4 right-4 text-gray-400 hover:text-white"
        @click="onClose"
      >
        ✕
      </button>

      <!-- Logo -->
      <logo imgClass="relative z-10 w-8 lg:w-10 mb-6" divClass="flex justify-center mb-6" />

      <!-- Title -->
      <h2 class="text-3xl font-bold text-left mb-6">Find your X account</h2>
      <!-- Description -->
      <p class="text-gray-400 mb-6">
       Enter the email, phone number, or username associated with your account to change your password.
      </p>

      <!-- Input -->
      <input
        type="text"
        placeholder="Phone, email, or username"
        v-model="identifier"
        class="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-gray-300 mb-4"
      />

      <!-- Error Message -->
      <p v-if="errorMessage" class="text-red-500 text-sm mb-4">{{ errorMessage }}</p>

      <!-- Next Button -->
      <button
        class="w-full bg-white text-black font-semibold rounded-full py-2 hover:bg-gray-200 transition mb-3"
        @click="onNext"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import logo from "../logo.vue";
import { useForgotPasswordQuery } from "../../../queries/useForgetPasswordQuery";

const identifier = ref("");
const forgotPasswordMutation = useForgotPasswordQuery();
const errorMessage = ref("");

const emit = defineEmits<{
  (e: 'next', identifier: string): void;
}>();

const onNext = () => {
    forgotPasswordMutation.mutate({ identifier: identifier.value }, {
        onSuccess: (data: any) => {
        console.log("Forgot Password Step 1 Success:", data);
        emit('next', identifier.value);
        },
        onError: (error: any) => {
        console.error("Forgot Password Step 1 Error:", error);
        errorMessage.value = error?.response?.data?.message 
            || error?.response?.data?.error 
            || error?.message 
            || "An unexpected error occurred. Please try again.";
        }
    });
};

const onClose = () => {
  window.location.href = "/auth"; // Redirect to home or desired page
};

</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
</style>
