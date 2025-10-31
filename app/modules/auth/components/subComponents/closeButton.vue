<template>
      <button
        id="button-close"
        class="absolute top-4 right-4 text-gray-400 hover:text-white"
        @click="$emit('close')"
      >
        <X name="x" class="w-4 h-4" />
      </button>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
</script>