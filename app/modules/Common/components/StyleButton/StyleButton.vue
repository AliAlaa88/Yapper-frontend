<template>
    <button
        class="bg-alternate text-alternate px-4 py-2 rounded-md absolute top-2 right-2 flex items-center gap-2 z-100"
        @click="handleOnClick"
    >
        <Sun v-if="isDark" class="w-4 h-4" />
        <Moon v-else class="w-4 h-4" />
        {{ isDark ? 'Light' : 'Dark' }}
    </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'

const THEME_STORAGE_KEY = 'yapper-theme'
const isDark = ref(false)

function applyTheme(dark: boolean) {
    if (typeof document === 'undefined') return
    document.documentElement.classList.toggle('dark', dark)
    if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light')
    }
}

onMounted(() => {
    if (typeof window === 'undefined') return
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    isDark.value = savedTheme === 'dark'
    applyTheme(isDark.value)
})

function handleOnClick() {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
}
</script>
