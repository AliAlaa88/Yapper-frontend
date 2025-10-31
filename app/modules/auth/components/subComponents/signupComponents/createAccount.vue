<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm p-4">
    <div class="bg-black text-white rounded-2xl w-full max-w-lg sm:max-w-xl p-8 sm:p-10 md:p-14 lg:p-20 relative flex flex-col justify-center">
      <!-- Close Button -->
      <closeButton @close="$emit('close')" />
      <!-- Logo -->
    <Logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

      <!-- Title -->
      <h2 class="text-3xl font-bold text-left mb-6">Create Your account</h2>


      <!-- Name Input -->
      <input
        id="input-name-signup-s1"
        type="text"
        placeholder="name"
        v-model="name"
        class="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-gray-300 mb-4"
      />

      <!-- Email Input -->
      <input
        id="input-email-signup-s1"
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
            id="select-month-signup-s1"
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
            id="select-day-signup-s1"
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
            id="select-year-signup-s1"
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
        id="button-next-signup-s1"
        class="w-full bg-white text-black font-semibold rounded-full py-2 hover:bg-gray-200 transition mb-3"
        @click="onNext"
      >
        Next
      </button>
      <!-- reCAPTCHA -->
      <Recaptcha class="w-full" ref="recaptchaRef" @verified="onRecaptchaVerified" />
      <h1 id="error-message-signup-s1" class="text-red-500 text-sm mt-2" v-if="error">{{ error }}</h1>
      <h1 class="text-green-500 text-sm mt-2" v-if="success">{{ success }}</h1>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import Logo from '~/modules/Common/components/Logo'
import Recaptcha from "../recaptcha.vue";
import { useRegisterS1Query } from "../../../queries/useRegisterQuery";
import closeButton from "../closeButton.vue";
const name = ref("");
const email = ref("");
const month = ref("");
const day = ref("");
const year = ref("");
const error = ref("");
const success = ref("");
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

// Recaptcha token
const recaptchaRef = ref<{ run: () => Promise<void> } | null>(null)
const recaptcha = ref("");
const onRecaptchaVerified = (token: string) => {
  recaptcha.value = token;
};
const registerMutation = useRegisterS1Query(
  (data) => {
    success.value = "Registration successful! Please verify your email.";
    error.value = "";
    emit('next', email.value);
  },
  (err: any) => {
    console.log(err);
    const errorMsg = err?.response?.data?.message 
      || err?.message 
      || "Registration failed. Please try again.";
    if(Array.isArray(errorMsg))
      error.value = errorMsg[0];
    else
      error.value = errorMsg;
    success.value = "";
  }
)
const emit = defineEmits<{
  (e: 'next', email: string): void
  (e: 'close'): void
}>()

const onNext = async () => {
  // Combine date values if needed
  const dateOfBirth = month.value && day.value && year.value 
    ? `${year.value}-${month.value.padStart(2, '0')}-${day.value.toString().padStart(2, '0')}`
    : '';
    
  if (!recaptcha.value) {
    error.value = "Please complete the reCAPTCHA.";
    await recaptchaRef.value?.run()
  } else {
    error.value = ""; // Clear previous errors
    success.value = "";
    
    console.log("Next clicked:", name.value, email.value, dateOfBirth, recaptcha.value);
    registerMutation.mutate({ Name: name.value, Email: email.value, Birth_date: dateOfBirth, Captcha_token: recaptcha.value });
  }
};

</script>
