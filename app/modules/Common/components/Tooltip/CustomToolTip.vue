<template>
    <TooltipProvider :delay-duration="delayDuration">
        <Tooltip v-model:open="isOpen">
            <TooltipTrigger :as-child="asChild">
                <slot name="trigger" />
            </TooltipTrigger>
            <TooltipContent :side="side" :align="align" :class="contentClass">
                <slot name="content" :is-open="isOpen" />
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
</template>

<script setup lang="ts">
import Tooltip from './Tooltip.vue'
import TooltipProvider from './TooltipProvider.vue'
import TooltipTrigger from './TooltipTrigger.vue'
import TooltipContent from './TooltipContent.vue'
import type { HTMLAttributes } from 'vue'

withDefaults(
    defineProps<{
        delayDuration?: number
        side?: 'top' | 'bottom' | 'left' | 'right'
        align?: 'start' | 'center' | 'end'
        asChild?: boolean
        contentClass?: HTMLAttributes['class']
    }>(),
    {
        delayDuration: 300,
        side: 'top',
        align: 'center',
        asChild: true,
        contentClass: undefined,
    },
)

const isOpen = defineModel<boolean>('open', { default: false })
</script>
