<template>
    <div class="flex flex-col items-center justify-center px-10 py-[60px] text-center">
        <!-- <div class="mb-4 text-5xl opacity-50">{{ icon }}</div> -->
        <!-- <div class="mb-4 text-5xl opacity-50">{{ icon }}</div> -->
        <Logo
            :img-class="'w-8 h-8'"
            :div-class="'w-16 h-16 bg-primary rounded-full flex items-center justify-center'"
        />
        <h3 class="text-lg font-bold text-primary mb-2">{{ title }}</h3>
        <p class="text-sm text-secondary leading-relaxed">{{ description }}</p>
    </div>
</template>

<script setup lang="ts">
import Logo from '~/modules/Common/components/Logo/Logo.vue'

defineProps<{
    icon: string
    title: string
    description: string
}>()
</script>
