<template>
    <DetailedPanel :title="$t('settings.accountInformation')">
        <DetailedRow :category="categories[0] ?? { label: '', content: '', href: '' }" />
        <DetailedRow :category="categories[1] ?? { label: '', content: '', href: '' }" />
        <div
            class="block relative px-5 py-3 rounded transition-colors text-primary
            border-t border-b border-primary">
            <div class="flex justify-between items-center">
                <div>
                    <span class="block text-[15px] text-primary">
                        {{ $t('settings.accountInfo.accountCreation') }}
                    </span>
                    <p class="text-muted text-[13px]">
                        {{ categories[6]?.content }}
                    </p>
                </div>
                <ChevronRight class="opacity-40 group-hover:text-white absolute right-3" />
            </div>
        </div>
        <DetailedRow :category="categories[2] ?? { label: '', content: '', href: '' }" />
        <DetailedRow :category="categories[3] ?? { label: '', content: '', href: '' }" />
        <DetailedRow :category="categories[4] ?? { label: '', content: '', href: '' }">
            <p class="text-muted text-[13px]">
                {{ t('settings.accountInfo.birthDate_desc') }}
            </p>
        </DetailedRow>
        <DetailedRow :category="categories[5] ?? { label: '', content: '', href: '' }" />
    </DetailedPanel>
</template>

<script lang="ts" setup>
import DetailedPanel from './DetailedPanel.vue'
import DetailedRow from './DetailedRow.vue'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { formatFullDateTime, formatDate, calculateAge } from '../utils/calculations'
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const { t } = useI18n()
const categories = computed(() => [
    { label: t('settings.accountInfo.username'), content: user.value?.username, href: '/settings/screen_name' },
    { label: t('settings.accountInfo.email'), content: user.value?.email, href:'/settings/email' },
    { label: t('settings.accountInfo.country'), content: user.value?.country, href: '/settings/country' },
    { label: t('settings.accountInfo.languages'), content: 'English, Arabic', href: '/settings/languages' },
    { label: t('settings.accountInfo.birthDate'), content: formatDate(user.value?.birth_date ?? ''), href: `/${user.value?.username}/settings/profile` },
    { label: t('settings.accountInfo.age'), content: calculateAge(user.value?.birth_date ?? '').toString(), href: '/settings/your_yapper_data/age' },
    { label: t('settings.accountInfo.accountCreation'), content: formatFullDateTime(user.value?.created_at ?? ''), href: '/settings/your_twitter_data/account_creation' },
])
</script>
