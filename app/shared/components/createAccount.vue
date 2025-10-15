<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
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
      <div class="flex justify-center mb-6">
        <img
        src="../../assets/logo-white.png"
        alt="X Logo"
        class="relative z-10 w-8 lg:w-10"
      />
      </div>

      <!-- Title -->
      <h2 class="text-3xl font-bold text-left mb-6">Create Your account</h2>


      <!-- Name Input -->
      <input
        type="text"
        placeholder="name"
        v-model="name"
        class="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-gray-300 mb-4"
      />

      <!-- Email Input -->
      <input
        type="email"
        placeholder="email"
        v-model="email"
        class="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-gray-300 mb-4"
      />
      <h3 class="text-l font-bold text-left">Date of Birth</h3>
      <p class="text-gray-400 mb-6 text-sm">
       This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.
      </p>
      <!-- Date of Birth Input -->
      <input
        type="date"
        placeholder="Date of Birth"
        v-model="dateOfBirth"
        class="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-gray-300 mb-4"
      />

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

const name = ref("");
const email = ref("");
const dateOfBirth = ref("");
const onNext = () => {
  // call backend to check email existance
  console.log("Next clicked:", name.value);
};

</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
</style>
