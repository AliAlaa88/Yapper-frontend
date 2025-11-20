<template>
    <DetailedPanel title="Languages">
        <div class="w-full text-primary">
            <div class="relative w-full pb-4  px-5 py-2">
                <p class="text-muted text-[13px] mt-0.5">
                    Manage which languages are used to personalize your Yapper experience.
                </p>
            </div>
        </div>
        <button
            id="language-button"
            class="w-full block relative px-5 py-3 rounded hover:bg-hover
            transition-colors text-primary"
            @click="isOpen = true">
            <div class="flex justify-between items-center">
                <div class="flex flex-col items-start">
                    <span class="block text-[15px] text-primary"> App and post languages </span>
                    <p class="text-muted text-[13px]">
                        English and Arabic
                    </p>
                </div>
                <ChevronRight class="opacity-40 group-hover:text-white absolute right-3" />
            </div>
        </button>
    </DetailedPanel>
    <LanguageSelector :is-open="isOpen" :handle-close="handleClose" />
</template>

<script setup lang="ts">
import DetailedPanel from './DetailedPanel.vue'
import { ChevronRight } from 'lucide-vue-next'
import { ref } from 'vue'
import LanguageSelector from './LanguageSelector.vue'

const isOpen = ref(false)
const handleClose = () => {
    isOpen.value = false
}
</script>
