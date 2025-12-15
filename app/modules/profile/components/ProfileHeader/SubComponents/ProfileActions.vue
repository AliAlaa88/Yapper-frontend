<template>
    <div class="relative inline-block text-left">
        <button
            class="w-9 h-9 flex items-center justify-center cursor-pointer rounded-full border border-[#536471] hover:bg-[#181818] transition"
            @click="showList = true"
        >
            <span
                id="menu-button"
                class="text-primary text-xl font-bold leading-none"
                @click.stop="toggleList"
            >⋯</span
            >
        </button>

        <div v-if="showList">
            <div class="fixed inset-0 bg-gray-700/50 z-40 sm:hidden" />
            <ProfileActionsMenu :is-tweet="isTweet" />
        </div>
    </div>
</template>

<script setup lang="ts">
import ProfileActionsMenu from './ProfileActionsMenu.vue'
import { ref, provide } from 'vue'
defineProps<{
    isTweet: boolean
}>()
const showList = ref(false)
provide('show-list', showList)

function toggleList() {
    showList.value = !showList.value
}
</script>
