<template>
      <button
        class="absolute top-4 left-4 text-gray-400 hover:text-white"
        @click="$emit('close')"
      >
        <ArrowLeft class="w-4 h-4" />
      </button>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
</script>
