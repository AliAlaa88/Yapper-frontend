<template>
    <DetailedPanel :title="t('settings.accountInfo.age')">
        <div class="w-full text-primary">
            <div class="relative w-full pb-2 px-5 pt-2">
                <p class="text-muted text-[13px] mt-0.5">
                    {{ t('settings.accountInfo.age_desc_long') }}
                </p>
            </div>
            <div class="border-t border-b border-primary px-5 py-3">
                <p v-if="user.birth_date">{{ age }}</p>
                <p v-else>Age not provided</p>
            </div>
            <div class="relative w-full pb-2 px-5 pt-2">
                <p class="text-muted text-[14px] mt-0.5">
                    Not right? You can add your date of birth to your
                    <NuxtLink to="/settings/profile" class="text-accent hover:underline">
                        profile
                    </NuxtLink>
                    without sharing it publicly.
                </p>
            </div>
        </div>
    </DetailedPanel>
</template>

<script setup lang="ts">
import DetailedPanel from './DetailedPanel.vue'
import type { User } from '~/modules/Common/types/user'
import { getUser } from '~/utils/helpers'
import { calculateAge } from '../utils/calculations'
import { useI18n } from 'vue-i18n'
const user = getUser() as User
const age = computed(() => calculateAge(user.birth_date ?? ''))
const { t } = useI18n()
</script>
