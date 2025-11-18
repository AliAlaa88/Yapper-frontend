<template>
      <button
        id="button-back"
        :class="[
          'absolute top-4 text-primary hover:bg-hover rounded-full p-2 transition duration-200',
          isArabic ? 'right-4' : 'left-4'
        ]"
        @click="$emit('close')"
      >
        <ArrowLeft class="w-5 h-5" />
      </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft } from 'lucide-vue-next'

const { locale } = useI18n()
const isArabic = computed(() => locale.value === 'ar')
</script>
