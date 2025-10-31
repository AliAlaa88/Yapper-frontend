<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm p-4">
    <div class="bg-black text-white rounded-2xl w-full max-w-lg sm:max-w-xl p-8 sm:p-10 md:p-14 lg:p-20 relative flex flex-col justify-center">
      <!-- Close Button -->
      <closeButton @close="$emit('close')" />

      <!-- Logo -->
      <logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

      <!-- Back Button -->
      <button
        class="absolute top-8 left-8 text-gray-400 hover:text-white transition"
        @click="$emit('back')"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Title -->
      <h2 class="text-3xl font-bold text-left mb-6">What should we call you?</h2>
      <p class="text-gray-400 mb-6">
        Your @username is unique. You can always change it later.
      </p>

      <!-- Username Input -->
      <div class="mb-6">
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
          <input
            v-model="username"
            type="text"
            placeholder="username"
            class="w-full bg-gray-900 text-white rounded-full px-4 pl-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxlength="15"
            @input="validateUsername"
          />
        </div>
        <div class="flex justify-between mt-2 px-4">
          <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>
          <p v-else-if="username.length > 0" class="text-green-500 text-sm">Available!</p>
          <p v-else class="text-transparent text-sm">.</p>
          <p class="text-gray-500 text-sm">{{ username.length }}/15</p>
        </div>
      </div>

      <!-- Recommendations -->
    <div v-if="props.Recommendations && props.Recommendations.length" class="my-2 text-sm text-gray-400">
      <p>Recommended usernames:</p>
      <ul class="mt-1 flex flex-wrap gap-2">
        <li
          v-for="(suggestion, index) in props.Recommendations"
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
        :disabled="!isValid"
        :class="[
          'w-full font-semibold rounded-full py-2 transition mb-3',
          isValid 
            ? 'bg-white text-black hover:bg-gray-200' 
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        ]"
        @click="onNext"
      >
        Next
      </button>

      <!-- Skip Button -->
      <button
        class="w-full text-gray-400 hover:text-white transition"
        @click="onSkip"
      >
        Skip for now
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import closeButton from "../closeButton.vue";
import logo from "../logo.vue";

const username = ref("");
const errorMessage = ref("");

const emit = defineEmits<{
  (e: 'next', username: string): void;
  (e: 'skip'): void;
  (e: 'back'): void;
  (e: 'close'): void;
}>();

const props = defineProps<{
  Recommendations: string[];
}>();

const validateUsername = () => {
  const value = username.value;
  
  if (value.length === 0) {
    errorMessage.value = "";
    return;
  }

  // Username validation rules
  if (value.length < 3) {
    errorMessage.value = "Username must be at least 3 characters";
    return;
  }

  // Only alphanumeric and underscores
  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    errorMessage.value = "Only letters, numbers, and underscores allowed";
    return;
  }

  // Cannot start with a number
  if (/^[0-9]/.test(value)) {
    errorMessage.value = "Username cannot start with a number";
    return;
  }

  errorMessage.value = "";
};

const isValid = computed(() => {
  return username.value.length >= 3 && !errorMessage.value;
});

const onNext = () => {
  if (isValid.value) {
    emit('next', username.value);
  }
};

const onSkip = () => {
  emit('skip');
};
</script>
