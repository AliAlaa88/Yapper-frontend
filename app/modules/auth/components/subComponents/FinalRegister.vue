<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm">
    <div class="bg-black text-white rounded-2xl w-full max-w-lg sm:max-w-xl p-30 relative flex flex-col justify-center">
      <button
        class="absolute top-4 left-4 w-10 h-10 text-gray-400 hover:text-white"
        @click="$emit('close')"
      >
        <i class="fas fa-arrow-left"></i>
      </button>

      <!-- Logo -->
       <logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

      <!-- Title -->
      <h2 class="text-3xl font-bold text-left mb-6">Choose username and a password</h2>
        <p class="text-gray-400 mb-6">
            Please enter your desired username and a strong password.
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

        <!-- Choose Language -->
        <select v-model="language" class="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-gray-300 mb-4">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
            <option value="ar">العربية</option>
        </select>

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
import { useRegisterS3Query } from "../../queries/useRegisterQuery";

const username = ref("");
const password = ref("");
const registerMutation = useRegisterS3Query();
const language = ref("en");
const props=defineProps<{
  Email: string;
  recommendations: string[];
}>();
const onNext = () => {
  console.log("Next clicked:", username.value, password.value);
  registerMutation.mutate({ Email: props.Email, Username: username.value, Password: password.value, Language: language.value }, {
    onSuccess: (data) => {
      console.log("Registration Step 3 Success:", data);
    },
    onError: (error) => {
      console.error("Registration Step 3 Error:", error);
    }
  });
};

</script>