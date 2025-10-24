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

      <!-- Email -->
      <input
        type="text"
        placeholder= "{{ props.identifier }}"
        :value="props.identifier"
        readonly
        class="w-full bg-gray-800 border border-gray-600 rounded-md px-4 py-2 focus:outline-none mb-4"
      />

      <!-- Password -->
      <input
        type="text"
        placeholder="Password"
        v-model="password"
        class="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-gray-300 mb-4"
      />
      
      <!-- Error Message -->
      <p v-if="errorMessage" class="text-red-500 text-sm mb-4">{{ errorMessage }}</p>

    <!-- Forgot password -->
      <div
        class="text-blue-400 hover:underline mb-6 cursor-pointer text-left"
        @click="onForgotPassword"
      >
        Forgot password?
      </div>

      <!-- Login Button -->
      <button
        class="w-full bg-white text-black font-semibold rounded-full py-2 hover:bg-gray-200 transition mb-3"
        @click="onNext"
      >
        Login
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
import { useLoginQuery } from "../../../queries/useLoginQuery";

const password = ref("");
const errorMessage = ref("");

const props = defineProps<{
  identifier: string;
  type:string;
}>();

const emit = defineEmits<{
  (e: 'finish'): void;
  (e: 'close'): void;
  (e: 'switch'): void;
}>();

const loginMutation = useLoginQuery();

const onNext = () => {
  errorMessage.value = ""; // Clear previous errors
  const type = props.type;
  
  console.log("Login clicked:", {
    Email: props.identifier,
    Password: password.value,
    Type: type
  });
  
  loginMutation.mutate({ identifier: props.identifier, Password: password.value, Type: type }, {
    onSuccess: (data) => {
      console.log("Login Success:", data);
      emit('finish');
    },
    onError: (error: any) => {
      console.error("Login Error:", error);
      
      // Extract error message from backend response
      const errorMsg = error?.response?.data?.message 
        || error?.response?.data?.error 
        || error?.message 
        || "Invalid credentials. Please try again.";
      
      errorMessage.value = errorMsg;
    }
  });
}

const onForgotPassword = () => {
  console.log("Forgot password clicked");
  window.location.href = "/auth/forgot-password";
};
</script>