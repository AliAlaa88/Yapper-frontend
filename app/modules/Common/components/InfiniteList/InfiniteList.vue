<template>
    <div :class="containerClass">
        <!-- Loading state -->
        <div v-if="isPending" class="p-6 text-center">
            <slot name="loading">
                <div class="inline-flex items-center space-x-2 text-secondary">
                    <LoadingSpinner size="md" />
                    <span class="text-sm font-medium text-primary">{{ loadingText }}</span>
                </div>
            </slot>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="p-6 text-center">
            <slot name="error" :error="error" :retry="onRetry">
                <div class="bg-primary rounded-xl p-4 border border-primary">
                    <div class="text-red text-sm font-medium mb-3">
                        {{ errorText }}
                    </div>
                    <button
                        class="inline-flex items-center px-4 py-2 bg-blue text-white text-sm font-bold rounded-full hover:bg-blue transition-colors duration-200"
                        @click="onRetry"
                    >
                        <RotateCw class="w-4 h-4 mr-2" />
                        {{ retryText }}
                    </button>
                </div>
            </slot>
        </div>

        <!-- Main content -->
        <div v-else-if="!isPending" :class="['flex flex-col items-center', contentClass]">
            <div :class="itemsContainerClass">
                <slot :items="items" />
            </div>

            <!-- Loading more indicator -->
            <div v-if="isFetchingNextPage" class="flex justify-center py-4 w-full">
                <slot name="loading-more">
                    <LoadingSpinner size="md" />
                </slot>
            </div>

            <!-- Intersection observer target -->
            <div ref="internalTriggerRef" class="h-1 w-full" />
        </div>

        <!-- Empty state -->
        <div v-if="!isFetching && items.length === 0" class="p-8 text-center">
            <slot name="empty">
                <div class="max-w-sm mx-auto">
                    <div
                        class="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center"
                    >
                        <slot name="empty-icon">
                            <Logo class="w-8 h-8 text-secondary" />
                        </slot>
                    </div>
                    <h3 class="text-lg font-bold text-primary mb-2">
                        {{ emptyTitle }}
                    </h3>
                    <p class="text-sm text-secondary leading-relaxed">
                        {{ emptyDescription }}
                    </p>
                </div>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T">
import { ref, watch } from 'vue'
import { RotateCw } from 'lucide-vue-next'
import LoadingSpinner from '~/modules/Common/components/Loading/LoadingSpinner.vue'
import Logo from '~/modules/Common/components/Logo/Logo.vue'

interface Props {
    items: T[]
    isPending: boolean
    isFetching: boolean
    isFetchingNextPage: boolean
    error: Error | null
    loadingText?: string
    errorText?: string
    retryText?: string
    emptyTitle?: string
    emptyDescription?: string
    containerClass?: string
    contentClass?: string
    itemsContainerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
    loadingText: 'Loading...',
    errorText: 'Failed to load',
    retryText: 'Try again',
    emptyTitle: 'Nothing here',
    emptyDescription: 'No items to display',
    containerClass: 'max-w-[600px] mx-auto bg-primary min-h-screen',
    contentClass: '',
    itemsContainerClass: 'w-full',
})

const emit = defineEmits<{
    retry: []
}>()
const loadMoreTrigger = defineModel<HTMLElement | null>('loadMoreTrigger', {
    default: null,
})

// Internal ref that binds to the DOM element
const internalTriggerRef = ref<HTMLElement | null>(null)

// Sync internal ref with the model when it changes
watch(
    internalTriggerRef,
    (el) => {
        loadMoreTrigger.value = el
    },
    { immediate: true },
)

const onRetry = () => {
    emit('retry')
}
</script>
