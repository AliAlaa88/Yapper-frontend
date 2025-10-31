<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm p-4">
    <div class="bg-black text-white rounded-2xl w-full max-w-lg sm:max-w-xl p-8 sm:p-10 md:p-14 lg:p-20 relative flex flex-col justify-center">
      <!-- Back Button -->
      <backButton @close="$emit('back')" />

      <!-- Logo -->
       <logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

      <!-- Title -->
      <h2 class="text-3xl font-bold text-left mb-6">Choose a username</h2>
        <p class="text-gray-400 mb-6">
            Please enter your desired username.
        </p>

        <!-- Error Message -->
        <p v-if="errorMessage" class="text-red-500 text-sm mb-4">
          {{ errorMessage }}
        </p>

        <!-- Success Message -->
        <p v-if="successMessage" class="text-green-500 text-sm mb-4">
          {{ successMessage }}
        </p>

        <!-- Username Input -->
        <input
            type="text"
            placeholder="Enter username"
            v-model="username"
            class="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-gray-300 mb-4"
        />

        <!-- Username recommendations -->
    <div v-if="props.recommendations && props.recommendations.length" class="my-2 text-sm text-gray-400">
      <p>Recommended usernames:</p>
      <ul class="mt-1 flex flex-wrap gap-2">
        <li
          v-for="(suggestion, index) in props.recommendations"
          :key="index"
          class="px-2 py-1 border border-gray-500 rounded-md cursor-pointer hover:bg-gray-700"
          @click="username = suggestion"
        >
          {{ suggestion }}
        </li>
      </ul>
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

import { ref } from "vue";
import backButton from "../backButton.vue";
import { useOAuthCompleteStep2Query } from "~/modules/auth/queries/useOAuthQuery";
import logo from "../logo.vue";
import { useUserStore } from "~/modules/auth/stores/userStore";
const username = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const props=defineProps<{
  OAuth_session_token: string;
  recommendations: string[];
}>();

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'next'): void;
  (e: 'finish'): void;
}>();

const registerMutation = useOAuthCompleteStep2Query(
  (data) => {
    console.log("Registration Step 3 Success:", data);
    successMessage.value = "Account created successfully!";
    errorMessage.value = "";
    const userStore = useUserStore();
    userStore.setAuth(data.data);
    setTimeout(() => {
      emit('finish');
    }, 1500);
  },
  (error: any) => {
    console.error("Registration Step 3 Error:", error);
    
    const errorMsg = error?.response?.data?.message 
      || error?.response?.data?.error 
      || error?.message 
      || "Registration failed. Please try again.";
    
    errorMessage.value = errorMsg;
    successMessage.value = "";
  }
);

const onNext = () => {
  errorMessage.value = ""; // Clear previous errors
  successMessage.value = ""; // Clear previous success messages

    registerMutation.mutate({ 
        OAuth_session_token: props.OAuth_session_token, 
        Username: username.value 
    });

  console.log("Next clicked:", username.value);
};

</script>