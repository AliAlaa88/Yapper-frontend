<template>
    <button
        :id="id"
        :class="[buttonClass, {
            'cursor-not-allowed': isLoading || disabled,
            'cursor-pointer': !isLoading && !disabled
        }]"
        :disabled="isLoading || disabled"
        @click="handleClick"
        @mouseover="handleMouseOver"
        @mouseout="handleMouseOut"
    >
        <slot name="icon-left" />

        <span v-if="isLoading && loadingText">{{ loadingText }}</span>
        <slot v-else>{{ buttonText }}</slot>

        <slot name="icon-right" />
    </button>
</template>

<script setup lang="ts">
const props = defineProps<{
    id?: string;
    buttonText?: string;
    isLoading?: boolean;
    disabled?: boolean;
    buttonClass?: string;
    loadingText?: string;
}>()


const emit = defineEmits<{
    click: []
    mouseover: []
    mouseout: []
}>()

function handleClick() {
    if (props.disabled || props.isLoading) return
    emit('click')
}

function handleMouseOver() {
    emit('mouseover')
}

function handleMouseOut() {
    emit('mouseout')
}

</script>
