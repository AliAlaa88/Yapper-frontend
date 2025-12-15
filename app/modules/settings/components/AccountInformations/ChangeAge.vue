<template>
    <DetailedPanel :title="$t('settings.accountInfo.age')">
        <div class="w-full text-primary">
            <div class="relative w-full pb-2 px-5 pt-2">
                <p class="text-muted text-[13px] mt-0.5">
                    {{ $t('settings.accountInfo.age_desc_long') }}
                </p>
            </div>
            <div class="border-t border-b border-primary px-5 py-3">
                <p v-if="user?.birth_date">{{ age }}</p>
                <p v-else>Age not provided</p>
            </div>
            <div class="relative w-full pb-2 px-5 pt-2">
                <p class="text-muted text-[14px] mt-0.5">
                    {{ $t('settings.accountInfo.age_notRight') }}
                    <NuxtLink
                        id="profile-link"
                        :to="profileRoute"
                        class="text-accent hover:underline"
                    >
                        {{ $t('settings.accountInfo.profile') }}
                    </NuxtLink>
                    {{ $t('settings.accountInfo.age_notRight2') }}
                </p>
            </div>
        </div>
    </DetailedPanel>
</template>

<script setup lang="ts">
import DetailedPanel from '../DetailedPanel.vue'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { storeToRefs } from 'pinia'
import { calculateAge } from '../../utils/calculations'
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const age = computed(() => calculateAge(user.value?.birth_date ?? ''))
const profileRoute = computed(() => '/' + user.value?.username + '/settings/profile')
</script>
