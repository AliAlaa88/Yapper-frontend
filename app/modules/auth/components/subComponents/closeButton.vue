<template>
      <button
        id="button-close"
        :class="[
          'absolute top-4 text-primary hover:bg-hover rounded-full p-2 transition duration-200',
          isArabic ? 'left-4' : 'right-4'
        ]"
        @click="$emit('close')"
      >
        <X name="x" class="w-5 h-5" />
      </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { X } from 'lucide-vue-next'

const { locale } = useI18n()
const isArabic = computed(() => locale.value === 'ar')
</script>