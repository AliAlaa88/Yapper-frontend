<template>
    <div class="mb-3">
        <div class="flex items-center gap-1">
            <h1 class="m-0 text-xl font-bold text-white">{{ displayName }}</h1>
            <svg
                v-if="verified"
                class="h-5 w-5 text-[#1d9bf0]"
                viewBox="0 0 24 24"
                aria-label="Verified"
            >
                <path
                    fill="currentColor"
                    d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"
                />
            </svg>
        </div>
        <p class="m-0 text-[15px] text-[#71767b]">@{{ username }}</p>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    displayName: string
    username: string
    verified?: boolean
}>()
</script>
