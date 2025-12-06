<template>
    <Teleport to="body">
        <div 
            class="fixed inset-0 bg-primary flex flex-col items-center justify-center z-100"
        >
            <!-- Animated Logo -->
            <div class="animate-pulse">
                <Logo imgClass="w-16 h-16 md:w-20 md:h-20" />
            </div>
            
            <!-- Loading text -->
            <p class="text-primary mt-6 text-lg font-medium">
                {{ message || $t('auth.common.redirecting') }}
            </p>
            
            <!-- Loading spinner -->
            <div class="mt-4">
                <svg 
                    class="animate-spin h-6 w-6 text-accent" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                >
                    <circle 
                        class="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        stroke-width="4"
                    />
                    <path 
                        class="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import Logo from '~/modules/Common/components/Logo'

defineProps<{
    message?: string
}>()
</script>
