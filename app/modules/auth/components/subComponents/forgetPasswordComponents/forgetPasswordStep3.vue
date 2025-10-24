<template>
      <div class="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
    <div class="bg-black text-white rounded-2xl w-full max-w-sm p-8 relative   
             sm:rounded-2xl sm:max-w-sm sm:h-auto 
             h-full sm:p-8 p-6 flex flex-col justify-center">
      <button
        class="absolute top-4 right-4 text-gray-400 hover:text-white"
        @click="$emit('close')"
      >
        ✕
      </button>

      <!-- Logo -->
      <logo imgClass="relative z-10 w-8 lg:w-10 mb-6" divClass="flex justify-center mb-6" />

      <!-- Title -->
      <h2 class="text-3xl font-bold text-left mb-6">Reset Your Password</h2>
      <!-- Description -->
      <p class="text-gray-400 mb-6">
         Enter your new password below to reset your account password.
      </p>

      <!-- Input -->
      <input
        type="password"
        placeholder="enter your new password"
        v-model="password"
        class="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-gray-300 mb-4"
      />

    <input
        type="password"
        placeholder="verify your new password"
        v-model="verifyPassword"
        class="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-gray-300 mb-4"
    />

      <!-- Error Message -->
      <p v-if="errorMessage" class="text-red-500 text-sm mb-4">{{ errorMessage }}</p>

      <!-- Next Button -->
      <button
        class="w-full bg-white text-black font-semibold rounded-full py-2 hover:bg-gray-200 transition mb-3"
        @click="onFinish"
      >
        Reset Password
      </button>
    </div>
  </div>
</template> 

<script setup lang="ts">

import { ref } from "vue";
import { useResetPasswordQuery } from "../../../queries/useForgetPasswordQuery";
const password = ref("");
const verifyPassword = ref("");
const errorMessage = ref("");

const props=defineProps<{
  reset_token: string;
  identifier: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'finish'): void;
}>();

const resetPasswordMutation = useResetPasswordQuery();

const onFinish = () => {
  errorMessage.value = ""; // Clear previous errors
    if (password.value !== verifyPassword.value) {
        errorMessage.value = "Passwords do not match.";
        return;
    }
    console.log("reset token:", props.reset_token);
    resetPasswordMutation.mutate({ identifier: props.identifier, reset_token: props.reset_token, newPassword: password.value }, {
        onSuccess: (data: any) => {
        emit('finish');
        },
        onError: (error: any) => {
            errorMessage.value = error.response?.data?.message || "An error occurred. Please try again.";
        }
    });

};

</script>