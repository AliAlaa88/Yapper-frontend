<template>
    <div class="flex justify-center items-center bg-primary" style="height: calc(60vh - 64px);">
        <div class="flex flex-col items-start justify-start text-left px-10 py-[60px]">
            <h1 class="m-0 mb-2 text-4xl font-extrabold text-primary">
                {{ $t('profile.blocked.title', { username }) }}
            </h1>
            <p class="m-0 max-w-[350px] text-[15px] leading-6 text-muted">
                {{ $t('profile.blocked.description', { username }) }}
            </p>
            <Button
                id="btn-view-blocked-posts"
                class="bg-accent text-primary cursor-pointer
                rounded-full font-bold text-[17px] w-[150px] h-[50px]
                whitespace-nowrap flex items-center justify-center
                transition-colors hover:bg-accent/90 mt-5">View posts</Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import Button from '~/modules/Common/components/Button/Button.vue'

defineProps<{
    username: string
}>()
</script>
