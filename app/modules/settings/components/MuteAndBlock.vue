<template>
    <DetailedPanel title="Mute and block">
        <div class="relative w-full px-5 py-2">
            <p class="text-muted text-[13px] mt-0.5">
                Manage the accounts and notifications that you have muted or blocked.
            </p>
        </div>
        <DetailedRow :category="categories[0] ?? { label: '', content: '', href: '' }" />
        <DetailedRow :category="categories[1] ?? { label: '', content: '', href: '' }" />
    </DetailedPanel>
</template>

<script lang="ts" setup>
import DetailedPanel from './DetailedPanel.vue'
import DetailedRow from './DetailedRow.vue'

const categories = [
    { label: 'Blocked accounts', href: '/settings/blocked/all' },
    { label: 'Muted accounts', href: '/settings/muted/all' },
]
</script>
