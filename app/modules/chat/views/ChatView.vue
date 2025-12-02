<template>
    <div class="flex w-full border-x border-primary">
        <div class="w-full md:w-[380px] lg:w-[400px] shrink-0 h-full">
            <ChatList />
        </div>

        <div class="hidden md:flex flex-1 items-center justify-center border-r border-primary">
            <div class="text-center p-8 max-w-md">
                <h2 class="text-3xl font-bold text-primary mb-2">Select a message</h2>
                <p class="text-secondary mb-6">
                    Choose from your existing conversations, start a new one, or just keep swimming.
                </p>
                <button
                    class="bg-blue hover:bg-blue/90 text-white font-bold rounded-full py-3 px-8 transition-colors"
                >
                    New message
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ChatList } from '../components/ChatList'
</script>
