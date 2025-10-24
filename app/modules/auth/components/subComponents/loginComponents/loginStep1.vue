<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm">
    <div class="bg-black text-white rounded-2xl w-full max-w-lg sm:max-w-xl p-25 relative flex flex-col justify-center">
      <button
        class="absolute top-4 right-4 text-gray-400 hover:text-white"
        @click="$emit('close')"
      >
        ✕
      </button>

      <!-- Logo -->
       <logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

      <!-- Title -->
      <h2 class="text-3xl font-bold text-left mb-6">Sign in to X</h2>

      <!--OAuth Buttons-->
      <OAuth />

      <!-- OR Divider -->
      <div class="flex items-center my-4">
        <div class="flex-1 h-px bg-gray-600"></div>
        <span class="px-3 text-gray-400 text-sm">or</span>
        <div class="flex-1 h-px bg-gray-600"></div>
      </div>

      <!-- Input -->
      <input
        type="text"
        placeholder="Phone, email, or username"
        v-model="identifier"
        class="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-gray-300 mb-4"
      />
      <p v-if="errorMessage" class="text-red-500 text-sm mb-4">{{ errorMessage }}</p>
      <!-- Next Button -->
      <button
        class="w-full bg-white text-black font-semibold rounded-full py-2 hover:bg-gray-200 transition mb-3"
        @click="onNext"
      >
        Next
      </button>

      <!-- Forgot password -->
      <button
        class="w-full border border-gray-600 text-white rounded-full py-2 hover:bg-gray-800 transition mb-6"
        @click="onForgotPassword"
      >
        Forgot password?
      </button>

      <p class="text-center text-gray-400 text-sm">
        Don’t have an account?
        <button class="text-blue-400 hover:underline" @click="$emit('switch')">Sign up</button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import logo from "../logo.vue";
import OAuth from "../OAuth.vue";
import { getIdentifierType } from "../../../utils/identifierType";
import { useCheckIdentifierAvailabilityQuery } from "~/modules/auth/queries/useLoginQuery";
//import { useLoginQuery } from "../../../queries/useLoginQuery";

const identifier = ref("");
const errorMessage = ref("");
// Computed property to determine the type of identifier
const identifierType = computed(() => getIdentifierType(identifier.value));

const emit = defineEmits<{
  (e: 'next', identifier: string, identifierType: string): void;
  (e: 'close'): void;
  (e: 'switch'): void;
}>();

const checkMutation = useCheckIdentifierAvailabilityQuery();

const onNext = () => {
  const type = identifierType.value;
  console.log("Next clicked:", {
    value: identifier.value,
    type: type,
    isEmail: type === 'email',
    isPhone: type === 'phone',
    isUsername: type === 'username'
  });
  errorMessage.value = ""; // Clear previous errors
  
  checkMutation.mutate(identifier.value, {
    onSuccess: (data) => {
        console.log("Identifier exists. Proceeding to next step.");
        const Type = (data as any)?.data?.type ?? type;
        emit('next', identifier.value, Type);
    },
    onError: (error: any) => {
        console.log("Identifier does not exist or error occurred:", error);
        
        // Extract error message from response
        const errorMsg = error?.response?.data?.message 
          || error?.response?.data?.error 
          || error?.message 
          || "Identifier does not exist or error occurred. Please try again.";
        
        errorMessage.value = errorMsg;
    }
  });
};


const onForgotPassword = () => {
  console.log("Forgot password clicked");
  window.location.href = "/auth/forgot-password";
};
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
</style>
