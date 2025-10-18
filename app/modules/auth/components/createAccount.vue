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
      <p class="text-gray-400 mb-4 text-sm">
       This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.
      </p>
      <!-- Date of Birth Dropdowns -->
      <div class="flex gap-3 mb-4">
        <!-- Month -->
        <div class="flex-1 relative">
          <select
            v-model="month"
            class="w-full bg-transparent border border-gray-600 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500 appearance-none text-gray-400"
          >
            <option value="" disabled selected>Month</option>
            <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
          </select>
          <span class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
        </div>
        
        <!-- Day -->
        <div class="flex-1 relative">
          <select
            v-model="day"
            class="w-full bg-transparent border border-gray-600 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500 appearance-none text-gray-400"
          >
            <option value="" disabled selected>Day</option>
            <option v-for="d in days" :key="d" :value="d">{{ d }}</option>
          </select>
          <span class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
        </div>
        
        <!-- Year -->
        <div class="flex-1 relative">
          <select
            v-model="year"
            class="w-full bg-transparent border border-gray-600 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500 appearance-none text-gray-400"
          >
            <option value="" disabled selected>Year</option>
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
          <span class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
        </div>
      </div>

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
import { ref, computed } from "vue";

const name = ref("");
const email = ref("");
const month = ref("");
const day = ref("");
const year = ref("");

// Month options
const months = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

// Day options (1-31)
const days = Array.from({ length: 31 }, (_, i) => i + 1);

// Year options (current year down to 120 years ago)
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 120 }, (_, i) => currentYear - i);

const onNext = () => {
  // Combine date values if needed
  const dateOfBirth = month.value && day.value && year.value 
    ? `${year.value}-${month.value.padStart(2, '0')}-${day.value.toString().padStart(2, '0')}`
    : '';
  
  console.log("Next clicked:", name.value, email.value, dateOfBirth);
};

</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
</style>
