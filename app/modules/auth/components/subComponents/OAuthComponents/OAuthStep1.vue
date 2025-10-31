<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm p-4">
    <div class="bg-black text-white rounded-2xl w-full max-w-lg sm:max-w-xl p-8 sm:p-10 md:p-14 relative flex flex-col justify-center">
      <!-- Close Button -->
      <closeButton @close="$emit('close')" />

      <!-- Logo -->
      <logo imgClass="relative z-10 w-8 lg:w-10 mb-6" divClass="flex justify-center mb-6" />

      <!-- Title -->
      <h2 class="text-3xl font-bold text-left mb-6">What's your birth date?</h2>
      <!-- Description -->
      <p class="text-gray-400 mb-6">
            This won't be public.
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

      <!-- Error Message -->
      <p v-if="errorMessage" class="text-red-500 text-sm mb-4">{{ errorMessage }}</p>

      <p class="text-gray-400 text-xs mb-4">
        By signing up, you agree to our Terms, Data Policy and Cookies Policy.
      </p>


      <!-- Next Button -->
      <button
        class="w-full bg-white text-black font-semibold rounded-full py-2 hover:bg-gray-200 transition mb-3"
        @click="onNext"
      >
        Sign Up
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import closeButton from '../closeButton.vue';
import logo from '../logo.vue';
import { ref } from 'vue';
import { useOAuthCompleteStep1Query } from '~/modules/auth/queries/useOAuthQuery';
import { useOAuthCompleteStep2Query } from '~/modules/auth/queries/useOAuthQuery';
import OAuth from '../OAuth.vue';
import { data, r } from 'happy-dom/lib/PropertySymbol.js';

const month = ref("");
const day = ref("");
const year = ref("");
const errorMessage = ref("");
const recommendations = ref<string[]>([]);
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

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'finish', Recommendations: string[]): void;
}>();

const props = defineProps<{
  OAuth_session_token: string;
}>();

const oauthCompleteStep1Mutation = useOAuthCompleteStep1Query(
  (data: any) => {
    console.log("OAuth Step 1 Complete Success:", data);
    errorMessage.value = "";
    console.log("Recommended usernames:", data?.data?.usernames);
    recommendations.value = data?.data?.usernames || [];
    console.log("Recommendations value:", recommendations.value);
    
    oauthCompleteStep2Mutation.mutate({
      OAuth_session_token: props.OAuth_session_token,
      Username: recommendations.value[0] || '',
    });
  },
  (error: any) => {
    console.error("OAuth Step 1 Complete Error:", error);
    errorMessage.value = error?.response?.data?.message 
      || error?.response?.data?.error 
      || error?.message 
      || "An unexpected error occurred. Please try again.";
  }
);

const oauthCompleteStep2Mutation = useOAuthCompleteStep2Query(
  (data: any) => {
    console.log("OAuth Step 2 Complete Success:", data);
    errorMessage.value = "";
    emit('finish', recommendations.value);
  },
  (error: any) => {
    console.error("OAuth Step 2 Complete Error:", error);
    errorMessage.value = error?.response?.data?.message 
      || error?.response?.data?.error 
      || error?.message 
      || "An unexpected error occurred. Please try again.";
  } )


const onNext = async () => {
    errorMessage.value = "";
    const dateOfBirth = month.value && day.value && year.value 
    ? `${year.value}-${month.value.padStart(2, '0')}-${day.value.toString().padStart(2, '0')}`
    : '';

    if (!month.value || !day.value || !year.value) {
      errorMessage.value = "Please select your complete birth date.";
      return;
    }

    oauthCompleteStep1Mutation.mutate({
      OAuth_session_token: props.OAuth_session_token,
      Birth_date: dateOfBirth
    });
};

</script>