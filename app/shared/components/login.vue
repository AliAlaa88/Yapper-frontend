<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
    <div class="bg-black text-white rounded-2xl w-full max-w-sm p-8 relative">
      <button
        class="absolute top-4 right-4 text-gray-400 hover:text-white"
        @click="$emit('close')"
      >
        ✕
      </button>

      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <img
        src="../../assets/logo-white.png"
        alt="X Logo"
        class="relative z-10 w-8 lg:w-10"
      />
      </div>

      <!-- Title -->
      <h2 class="text-3xl font-bold text-left mb-6">Sign in to X</h2>

      <!-- Google Sign-in -->
      <button
        class="w-full bg-white text-black rounded-full py-2 flex items-center justify-center space-x-2 hover:bg-gray-100 transition mb-3"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          class="w-5 h-5"
        />
        <span>Sign in with Google</span>
      </button>

      <!-- Github Sign-in -->
      <button
        class="w-full bg-white text-black rounded-full py-2 flex items-center justify-center space-x-2 hover:bg-gray-100 transition mb-6"
      >
        <i class="fa-brands fa-github text-xl"></i>
        <span>Sign in with GitHub</span>
      </button>

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
        <button class="text-blue-400 hover:underline">Sign up</button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const identifier = ref("");

const onNext = () => {
  // call backend to check email existance
  console.log("Next clicked:", identifier.value);
};

const onForgotPassword = () => {
  console.log("Forgot password clicked");
};
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
</style>
