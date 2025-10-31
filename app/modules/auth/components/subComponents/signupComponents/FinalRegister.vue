<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm p-4">
    <div class="bg-black text-white rounded-2xl w-full max-w-lg sm:max-w-xl p-8 sm:p-10 md:p-14 lg:p-20 relative flex flex-col justify-center">
      <!-- Back Button -->
      <backButton @close="$emit('close')" />

      <!-- Logo -->
       <logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

      <!-- Title -->
      <h2 class="text-3xl font-bold text-left mb-6">Enter a password</h2>
        <p class="text-gray-400 mb-6">
            Please enter a strong password.
        </p>

        <!-- Error Message -->
        <p v-if="errorMessage" class="text-red-500 text-sm mb-4">
          {{ errorMessage }}
        </p>



        <!-- Password Input -->
        <input
            type="password"
            placeholder="Enter password"
            v-model="password"
            class="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-gray-300 mb-4"
        />

        <p class="text-gray-400 mb-6">
            Make sure your password is strong and secure.
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

import { ref } from "vue";
import { useRegisterS3Query } from "../../../queries/useRegisterQuery";
import backButton from "../backButton.vue";

const password = ref("");
const language = ref("en");
const errorMessage = ref("");
const props=defineProps<{
  Email: string;
  username: string;
}>();


const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'next'): void;
  (e: 'finish'): void;
}>();

const registerMutation = useRegisterS3Query(
  (data) => {
    console.log("Registration Step 3 Success:", data);
    errorMessage.value = "";
    emit('finish');
  },
  (error: any) => {
    console.error("Registration Step 3 Error:", error);
    
    const errorMsg = error?.response?.data?.message 
      || error?.response?.data?.error 
      || error?.message 
      || "Registration failed. Please try again.";
    
    errorMessage.value = errorMsg;
  }
);

const onNext = () => {
  errorMessage.value = ""; // Clear previous errors

  console.log("Next clicked:", props.username, password.value);
  registerMutation.mutate({
    Email: props.Email,
    Username: props.username,
    Password: password.value,
    Language: 'en'
  });
};

</script>