<template>
    <div class="relative inline-block text-left">
        <button
            class="w-9 h-9 flex items-center justify-center cursor-pointer rounded-full
            border border-primary hover:bg-hover transition"
            @click="showList = true"
        >
            <span
                id="menu-button"
                class="text-primary text-xl font-bold leading-none"
                @click.stop="toggleList"
            >⋯</span
            >
        </button>
        <ProfileActionsMenu />
    </div>
</template>

<script setup lang="ts">
import ProfileActionsMenu from './ProfileActionsMenu.vue'
const showList = ref(false)
provide('show-list', showList)

function toggleList() {
    showList.value = !showList.value
}
</script>
