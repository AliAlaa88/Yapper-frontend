<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm p-4">
    <div class="bg-black text-white rounded-2xl w-full max-w-lg sm:max-w-xl p-8 sm:p-10 md:p-14 lg:p-20 relative flex flex-col justify-center">
      <!-- Close Button -->
      <closeButton @close="$emit('close')" />

      <!-- Logo -->
       <logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

      <!-- Title -->
      <h2 class="text-3xl font-bold text-left mb-6">Sign in to X</h2>

      <!--OAuth Buttons-->
      <OAuth />

      <!-- OR Divider -->
      <div class="flex items-center my-4 w-full">
        <div class="flex-1 h-px bg-gray-600"></div>
        <span class="px-3 text-gray-400 text-sm">or</span>
        <div class="flex-1 h-px bg-gray-600"></div>
      </div>

      <!-- Input -->
      <input
        id="input-identifier-login"
        type="text"
        placeholder="Phone, email, or username"
        v-model="identifier"
        class="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-gray-300 mb-4"
      />
      <p v-if="errorMessage" id="error-message-login-s1" class="text-red-500 text-sm mb-4">{{ errorMessage }}</p>
      <!-- Next Button -->
      <button
        id="button-next-login-s1"
        class="w-full bg-white text-black font-semibold rounded-full py-2 hover:bg-gray-200 transition mb-3"
        @click="onNext"
      >
        Next
      </button>

      <!-- Forgot password -->
      <button
        id="button-forgot-password-login"
        class="w-full border border-gray-600 text-white rounded-full py-2 hover:bg-gray-800 transition mb-6"
        @click="onForgotPassword"
      >
        Forgot password?
      </button>

      <p class="text-center text-gray-400 text-sm">
        Don't have an account?
        <button id="button-switch-to-signup" class="text-blue-400 hover:underline" @click="$emit('switch')">Sign up</button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import logo from "../logo.vue";
import OAuth from "../OAuth.vue";
import { useCheckIdentifierAvailabilityQuery } from "~/modules/auth/queries/useLoginQuery";
import closeButton from "../closeButton.vue";

const identifier = ref("");
const errorMessage = ref("");

const emit = defineEmits<{
  (e: 'next', identifier: string, identifierType: string): void;
  (e: 'close'): void;
  (e: 'switch'): void;
}>();

const checkMutation = useCheckIdentifierAvailabilityQuery(
  (data: any) => {
    console.log("Identifier exists. Proceeding to next step.");
    const Type = data?.data?.identifier_type;
    errorMessage.value = "";
    emit('next', identifier.value, Type);
  },
  (error: any) => {
    console.log("Identifier does not exist or error occurred:", error);
    
    // Extract error message from response
    const errorMsg = error?.response?.data?.message 
      || error?.response?.data?.error 
      || error?.message 
      || "Identifier does not exist or error occurred. Please try again.";
    
    errorMessage.value = errorMsg;
  }
);

const onNext = () => {
  errorMessage.value = ""; // Clear previous errors
  checkMutation.mutate(identifier.value);
};

const onForgotPassword = () => {
  console.log("Forgot password clicked");
  window.location.href = "/auth/forgot-password";
};
</script>
