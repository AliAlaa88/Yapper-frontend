<template>
    <DetailedPanel :title="t('settings.muteAndBlock')">
        <div class="relative w-full px-5 py-2">
            <p class="text-muted text-[13px] mt-0.5">
                {{ t('settings.muteAndBlock_desc') }}
            </p>
        </div>
        <DetailedRow :category="categories[0] ?? { label: '', content: '', href: '' }" />
        <DetailedRow :category="categories[1] ?? { label: '', content: '', href: '' }" />
    </DetailedPanel>
</template>

<script lang="ts" setup>
import DetailedPanel from '../DetailedPanel.vue'
import DetailedRow from '../DetailedRow.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const categories = computed(() => [
    { label: t('settings.blockedAccounts'), href: '' },
    { label: t('settings.mutedAccounts'), href: '' },
])
</script>
