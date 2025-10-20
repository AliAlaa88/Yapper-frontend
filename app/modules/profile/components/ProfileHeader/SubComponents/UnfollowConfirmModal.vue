<template>
    <div
        v-if="showConfirm"
        class="fixed inset-0 flex items-center justify-center z-50
        bg-gray-700/50 shadow-lg"
    >
        <div class="bg-black text-white rounded-2xl p-7.5 w-[320px] h-[310px] shadow-lg space-y-4">
            <div class="space-y-2">
                <h2 class="text-xl font-bold">
                    Unfollow <span class="font-normal">@</span>{{ username }}?
                </h2>
                <p class="text-gray-200/50 text-[15px] leading-snug">
                    Their posts will no longer show up in your Following timeline.
                    You can still view their profile, unless their posts are protected.
                </p>
            </div>

            <div class="space-y-3 mt-6">
                <button
                    class="cursor-pointer w-full bg-[#ebf1f1]
                    text-black font-bold py-2.5 rounded-full
                    hover:bg-gray-200/90 transition"
                    @click="$emit('unfollow')">
                    Unfollow
                </button>
                <button
                    class="cursor-pointer w-full border
                    border-gray-600 font-bold py-2.5 rounded-full
                    hover:bg-gray-200/10 transition"
                    @click="$emit('cancel')">
                    Cancel
                </button>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">

defineProps<{
    showConfirm: boolean
    username: string
}>()

defineEmits(['unfollow', 'cancel'])
</script>
