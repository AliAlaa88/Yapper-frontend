<template>
    <div class="flex justify-center items-center bg-black min-h-[650px]">
        <div class="flex flex-col items-start justify-start text-left px-10 py-[60px]">
            <h1 class="m-0 mb-2 text-4xl font-extrabold text-white">
                {{ `@${username} is blocked` }}
            </h1>
            <p class="m-0 max-w-[350px] text-[15px] leading-6 text-[#71767b]">
                {{ `Are you sure you want to view these posts? Viewing
                    posts won’t unblock @${username}.` }}
            </p>
            <button
                class="bg-blue-400 text-white cursor-pointer
                rounded-full font-bold text-[17px] w-[150px] h-[50px]
                whitespace-nowrap flex items-center justify-center
                transition-colors hover:bg-blue-400/85 mt-5">View posts</button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    username: string
}>()
</script>

