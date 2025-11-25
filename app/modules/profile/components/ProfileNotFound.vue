<template>
    <div class="flex flex-col items-center justify-center py-16 px-4 h-[100vh]">
        <div class="text-center max-w-md">
            <h1 class="text-3xl font-bold text-primary mb-4">
                {{ $t('profile.notFound.title') }}
            </h1>
            <p class="text-muted text-base mb-6">
                {{ $t('profile.notFound.description') }}
            </p>
            <NuxtLink
                to="/"
                class="inline-block bg-accent hover:bg-accent/90 text-primary font-bold py-2.5 px-6 rounded-full transition-colors duration-200"
            >
                {{ $t('profile.notFound.goHome') }}
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>
