<template>
    <div class="relative inline-block text-left">
        <button
            class="w-9 h-9 flex items-center justify-center cursor-pointer
            rounded-full border border-white/40 hover:bg-gray-200/15 transition"
            @click="showList = true"
        >
            <span
                class="text-white text-xl font-bold leading-none">⋯</span>
        </button>
        <ProfileActionsMenu
            v-if="showList"
        />
    </div>
</template>

<script setup lang="ts">
import ProfileActionsMenu from './ProfileActionsMenu.vue'
const showList = ref(false)
provide('show-list', showList)

</script>
