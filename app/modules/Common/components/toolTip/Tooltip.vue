<template>
    <div ref="reference" class="inline-block">
        <slot name="trigger" />
    </div>

    <Teleport to="body">
        <Transition name="tooltip">
            <div
                v-if="isOpen"
                ref="floating"
                :style="floatingStyles"
                :id="`tooltip-${text}`"
                class="px-3 py-2 text-sm font-medium text-alternate bg-tooltip rounded-lg shadow-lg whitespace-nowrap pointer-events-none z-50"
            >
                {{ text }}
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/vue'

interface Props {
    text: string
    position?: 'top' | 'bottom' | 'left' | 'right'
    delay?: number
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    position: 'bottom',
    delay: 200,
    disabled: false,
})

const isOpen = ref(false)
const reference = ref<HTMLElement | null>(null)
const floating = ref<HTMLElement | null>(null)
let hideTimeout: NodeJS.Timeout | null = null

const { floatingStyles } = useFloating(reference, floating, {
    placement: props.position,
    middleware: [offset(8), flip(), shift()],
})

const showTooltip = () => {
    if (props.disabled) return
    hideTimeout = setTimeout(() => {
        isOpen.value = true
    }, props.delay)
}

const hideTooltip = () => {
    if (hideTimeout) {
        clearTimeout(hideTimeout)
        hideTimeout = null
    }
    isOpen.value = false
}

onMounted(() => {
    if (reference.value) {
        reference.value.addEventListener('mouseenter', showTooltip)
        reference.value.addEventListener('mouseleave', hideTooltip)
        reference.value.addEventListener('focus', showTooltip)
        reference.value.addEventListener('blur', hideTooltip)
    }
})

onUnmounted(() => {
    if (reference.value) {
        reference.value.removeEventListener('mouseenter', showTooltip)
        reference.value.removeEventListener('mouseleave', hideTooltip)
        reference.value.removeEventListener('focus', showTooltip)
        reference.value.removeEventListener('blur', hideTooltip)
    }
    if (hideTimeout) {
        clearTimeout(hideTimeout)
    }
})
</script>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
    transition: opacity 0.15s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
    opacity: 0;
}
</style>
