<template>
    <div
        v-if="showConfirm"
        class="fixed inset-0 flex items-center justify-center z-50
        bg-gray-700/50 shadow-lg"
    >
        <div class="bg-black text-white rounded-2xl p-7.5 w-[320px] shadow-lg space-y-4">
            <div class="space-y-2">
                <h2 class="text-xl font-bold">
                    {{ headerText }}
                    <span v-if="username !== ''" class="font-normal mr-[-3px]">@</span>
                    {{ username }}
                    <span v-if="username !== ''" class="ml-[-3px]">?</span>
                </h2>
                <slot />
            </div>

            <div class="space-y-3 mt-6">
                <button
                    class="cursor-pointer w-full font-bold py-2.5 rounded-full transition"
                    :class="[
                        backgroundColor,
                        hoverColor,
                        textColor,
                    ]"
                    @click="$emit('click')">
                    {{ action }}
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
    showConfirm: boolean,
    username: string,
    headerText: string,
    action: string,
    backgroundColor: string,
    hoverColor: string,
    textColor: string,
}>()

defineEmits(['click', 'cancel'])
</script>
