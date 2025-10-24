<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
    <div class="bg-black text-white rounded-2xl w-full max-w-lg sm:max-w-xl p-30 relative flex flex-col justify-center">
      <button
        class="absolute top-4 left-4 w-10 h-10 text-gray-400 hover:text-white"
        @click="$emit('close')"
      >
        <i class="fas fa-arrow-left"></i>
      </button>

      <!-- Logo -->
       <logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

      <!-- Title -->
      <h2 class="text-3xl font-bold text-left mb-6">We sent you a code to reset your password</h2>
        <p class="text-gray-400 mb-6">
            Please enter the 6-digit code sent to your email address.
        </p>

        <!-- OTP Input -->
        <input
            type="text"
            placeholder="Enter OTP"
            v-model="otp"
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
import { useVerifyForgotPasswordOTPQuery } from "../../../queries/useForgetPasswordQuery";

const otp = ref("");
const errorMessage = ref("");
const verifyOTPMutation= useVerifyForgotPasswordOTPQuery();

const props=defineProps<{
  identifier: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'next', reset_token: string): void;
}>();

const onNext = () => {
  errorMessage.value = ""; // Clear previous errors
  verifyOTPMutation.mutate({ identifier: props.identifier, token: otp.value }, {
      onSuccess: (data: any) => {
      console.log("Verify OTP Success:", data);
      emit('next', data.data.resetToken);
      },
      onError: (error: any) => {
        console.error("Verify OTP Error:", error);
        errorMessage.value = error.response?.data?.message || "An error occurred. Please try again.";
      }
  });
 
};


</script>