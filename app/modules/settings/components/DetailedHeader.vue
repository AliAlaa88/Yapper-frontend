<template>
    <div class="sticky top-0 px-4 py-3 flex items-center gap-4">
        <button class="p-2 rounded-full hover:bg-hover transition" @click="$router.back()">
            <ArrowLeft class="w-5 h-5 mr-2" />
        </button>

        <h1 class="text-xl font-bold text-primary">
            {{ title }}
        </h1>
    </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

defineProps<{ title: string }>()
</script>
