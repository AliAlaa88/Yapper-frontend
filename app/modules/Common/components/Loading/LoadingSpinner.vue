<template>
    <div
        class="animate-spin rounded-full border-2"
        :class="[sizeClasses]"
        :style="{
            borderColor: 'var(--accent-color)',
            borderTopColor: 'transparent',
            borderRightColor: 'transparent'
        }"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(
    defineProps<{
        size?: Size
    }>(),
    {
        size: 'md',
    },
)

const sizeClasses = computed(() => {
    const sizes: Record<Size, string> = {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
        xl: 'h-8 w-8',
    }
    return sizes[props.size]
})

</script>
