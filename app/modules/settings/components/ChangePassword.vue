<template>
    <DetailedPanel title="Change your password">
        <div class="relative w-full border-b border-primary space-y-4">
            <div class="px-4 py-3">
                <input
                    type="password"
                    placeholder="Current password"
                    class="w-full border border-primary py-3 px-3
                        transition text-muted bg-transparent focus:outline-none
                        focus:ring-2 focus:ring-primary"
                >
            </div>
            <div class="w-full border-t border-b border-primary px-4 py-3 mb-2 space-y-4">
                <input
                    type="password"
                    placeholder="New password"
                    class="w-full border border-primary py-3 px-3
                        transition text-muted bg-transparent focus:outline-none
                        focus:ring-2 focus:ring-primary"
                >
                <input
                    type="password"
                    placeholder="Confirm password"
                    class="w-full border border-primary py-3 px-3
                        transition text-muted bg-transparent focus:outline-none
                        focus:ring-2 focus:ring-primary"
                >
            </div>
        </div>
    </DetailedPanel>
</template>

<script setup lang="ts">
import DetailedPanel from './DetailedPanel.vue'

</script>
