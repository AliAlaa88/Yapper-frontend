<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm p-4">
    <div class="bg-black text-white rounded-2xl w-full max-w-lg sm:max-w-xl p-8 sm:p-10 md:p-14 lg:p-20 relative flex flex-col justify-center">
      <!-- Close Button -->
      <closeButton @close="$emit('close')" />

      <!-- Logo -->
      <logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

      <!-- Back Button -->
      <backButton @close="$emit('back')" class="absolute top-6 left-6" />

      <!-- Title -->
      <h2 class="text-3xl font-bold text-left mb-6">Select your language</h2>
      <p class="text-gray-400 mb-6">
        This will help us personalize your Yapper experience.
      </p>

      <!-- Language Search -->
      <div class="mb-4">
        <input
          id="input-search-language"
          v-model="searchQuery"
          type="text"
          placeholder="Search languages..."
          class="w-full bg-gray-900 text-white rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Language List -->
      <div class="max-h-64 overflow-y-auto mb-6 custom-scrollbar">
        <button
          v-for="lang in filteredLanguages"
          :key="lang.code"
          :id="`button-language-${lang.code}`"
          :class="[
            'w-full text-left px-4 py-3 rounded-lg transition flex items-center justify-between',
            selectedLanguage === lang.code 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-gray-800'
          ]"
          @click="selectLanguage(lang.code)"
        >
          <span>{{ lang.name }} ({{ lang.nativeName }})</span>
          <svg 
            v-if="selectedLanguage === lang.code"
            class="w-5 h-5" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Next Button -->
      <button
        id="button-next-language"
        :disabled="!selectedLanguage"
        :class="[
          'w-full font-semibold rounded-full py-2 transition mb-3',
          selectedLanguage 
            ? 'bg-white text-black hover:bg-gray-200' 
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        ]"
        @click="onNext"
      >
        Next
      </button>

      <!-- Skip Button -->
      <button
        id="button-skip-language"
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
import backButton from "../backButton.vue";
import logo from "../logo.vue";

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
];

const selectedLanguage = ref<string>("");
const searchQuery = ref("");

const emit = defineEmits<{
  (e: 'next', language: string): void;
  (e: 'skip'): void;
  (e: 'back'): void;
  (e: 'close'): void;
}>();

const filteredLanguages = computed(() => {
  if (!searchQuery.value) return languages;
  
  const query = searchQuery.value.toLowerCase();
  return languages.filter(lang => 
    lang.name.toLowerCase().includes(query) || 
    lang.nativeName.toLowerCase().includes(query)
  );
});

const selectLanguage = (code: string) => {
  selectedLanguage.value = code;
};

const onNext = () => {
  if (selectedLanguage.value) {
    emit('next', selectedLanguage.value);
  }
};

const onSkip = () => {
  emit('skip');
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(55, 65, 81, 0.3);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.5);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.7);
}
</style>
