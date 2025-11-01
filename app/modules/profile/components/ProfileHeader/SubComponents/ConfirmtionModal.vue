<template>
    <div
        v-if="showConfirmation"
        class="fixed inset-0 flex items-center justify-center z-50 bg-gray-700/50 shadow-lg"
        @click="handleBackdropClick"
    >
        <div
            class="bg-primary text-primary rounded-2xl p-7.5 w-[330px] shadow-lg space-y-4"
            @click.stop
        >
            <div class="space-y-2">
                <h2 class="text-primary text-xl font-bold">
                    {{ confirmData.header }}
                    <span
                        v-if="confirmData.username !== ''"
                        class="font-bold whitespace-nowrap"
                    >
                        <span class="font-normal">@</span>{{ confirmData.username }}?
                    </span>
                </h2>
                <p class="text-muted text-[15px] leading-snug">
                    {{ confirmData.message }}
                </p>
            </div>

            <div class="space-y-3 mt-6">
                <button
                    id="confirm-button"
                    class="cursor-pointer w-full font-bold py-2.5 rounded-full transition"
                    :class="[confirmData.bgColor, confirmData.hover, confirmData.text]"
                    @click="handleConfirmAction"
                >
                    {{ confirmData.action }}
                </button>
                <button
                    id="cancel-confirm-button"
                    class="cursor-pointer w-full border border-primary
                    font-bold py-2.5 rounded-full hover:bg-hover transition"
                    @click="handleCancel"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface ConfirmationState {
    username?: string
    header: string
    action: string
    bgColor: string
    hover: string
    text: string
    message: string
    handleClick: () => void
}

type InjectedConfirmation = {
    showConfirmation: Ref<boolean>
    confirmData: Ref<ConfirmationState>
}

const { showConfirmation, confirmData } = inject<InjectedConfirmation>('confirmation')!
function handleCancel() {
    showConfirmation.value = false
}
function handleConfirmAction() {
    confirmData.value?.handleClick?.()
    showConfirmation.value = false
}
function handleBackdropClick() {
    showConfirmation.value = false
}
</script>
