<template>
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-10"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-10"
    >
        <div
            v-if="showSnackbar"
            class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-accent text-primary px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-[100]"
        >
            <span>
                {{ snackbar.username !== '' ? `@${snackbar.username}` : '' }}{{ snackbar.message }}
            </span>
            <button
                v-if="snackbar.action"
                id="snackbar-button"
                class="font-semibold hover:underline cursor-pointer ml-3"
                @click="handleActionClick"
            >
                {{ snackbar.action }}
            </button>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { inject } from 'vue'

interface SnackbarState {
    username?: string
    message: string
    action?: string
    handleClick?: (() => void) | null
}

type InjectedSnackbar = {
    showSnackbar: Ref<boolean>
    snackbar: Ref<SnackbarState>
}

const { showSnackbar, snackbar } = inject<InjectedSnackbar>('snackbar')!

function handleActionClick() {
    snackbar.value.handleClick?.()
    showSnackbar.value = false
}
</script>
