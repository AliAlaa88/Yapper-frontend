<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm p-4">
    <div class="bg-black text-white rounded-2xl w-full max-w-lg sm:max-w-xl p-8 sm:p-10 md:p-14 lg:p-20 relative flex flex-col justify-center">
      <!-- Close Button -->
      <closeButton @close="$emit('close')" />

      <!-- Logo -->
      <logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

      <!-- Title -->
      <h2 class="text-3xl font-bold text-left mb-6">Pick a profile picture</h2>
      <p class="text-gray-400 mb-6">
        Have a favorite selfie? Upload it now.
      </p>

      <!-- Profile Picture Preview -->
      <div class="flex justify-center mb-6">
        <div class="relative w-32 h-32 rounded-full bg-gray-800 border-2 border-gray-600 overflow-hidden">
          <img 
            v-if="previewImage" 
            :src="previewImage" 
            alt="Profile Preview" 
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
            <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Upload Button -->
      <label class="w-full bg-white text-black font-semibold rounded-full py-2 hover:bg-gray-200 transition mb-3 cursor-pointer text-center">
        <input 
          id="input-profile-picture-complete"
          type="file" 
          accept="image/*" 
          class="hidden" 
          @change="onFileChange"
        />
        Choose Image
      </label>

      <!-- Error Message -->
      <p v-if="errorMessage" id="error-message-profile-picture" class="text-red-500 text-sm mb-4 text-center">{{ errorMessage }}</p>

      <!-- Next Button -->
      <button
        id="button-next-profile-picture"
        v-if="previewImage"
        class="w-full bg-blue-500 text-white font-semibold rounded-full py-2 hover:bg-blue-600 transition mb-3"
        @click="onNext"
      >
        Next
      </button>

      <!-- Skip Button -->
      <button
        id="button-skip-profile-picture"
        class="w-full text-gray-400 hover:text-white transition"
        @click="onSkip"
      >
        Skip for now
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import closeButton from "../closeButton.vue";
import backButton from "../backButton.vue";
import logo from "../logo.vue";

const previewImage = ref<string | null>(null);
const selectedFile = ref<File | null>(null);
const errorMessage = ref("");

const emit = defineEmits<{
  (e: 'next', imageUrl: string): void;
  (e: 'skip'): void;
  (e: 'close'): void;
}>();

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = "Image size must be less than 5MB";
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      errorMessage.value = "Please select a valid image file";
      return;
    }

    errorMessage.value = "";
    selectedFile.value = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const onNext = () => {
  if (previewImage.value) {
    // In a real app, you would upload the image here and get a URL
    // For now, we'll just pass the data URL
    emit('next', previewImage.value);
  }
};

const onSkip = () => {
  emit('skip');
};
</script>
