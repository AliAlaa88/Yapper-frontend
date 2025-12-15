<template>
    <DetailedPanel :title="t('settings.accountInfo.change_email')">
        <div class="relative w-full border-b border-primary">
            <div class="px-4 py-3 mb-2">
                <div class="relative w-full">
                    <input
                        id="current-email-input"
                        type="text"
                        :value="user?.email"
                        readonly
                        class="w-full outline-none bg-gray-500/30 px-4 pt-7 pb-2 rounded-md opacity-50
                            text-muted text-base focus:outline-none cursor-default">
                    <label
                        for="current-email"
                        class="absolute start-3 top-1 text-xs text-muted opacity-50
                        pointer-events-none px-1 py-1">
                        {{ t('settings.accountInfo.current') }}
                    </label>
                </div>
            </div>
        </div>
        <NuxtLink
            id="update-email-address-link"
            to="/settings/add_email"
            class="w-full flex justify-center items-center hover:bg-accent/10 h-13 mt-2 text-accent bg-primary">
            {{ t('settings.accountInfo.update_email_address') }}
        </NuxtLink>
    </DetailedPanel>
</template>

<script setup lang="ts">
import DetailedPanel from '../DetailedPanel.vue'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
</script>
