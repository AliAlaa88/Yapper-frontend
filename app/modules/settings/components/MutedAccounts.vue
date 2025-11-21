<template>
    <DetailedPanel :title="t('settings.mutedAccounts')">
        <div class="w-full text-primary">
            <!-- <div v-if="myMutedUsersQuery.isLoading.value" class="p-4 text-muted">
                Loading muted accounts...
            </div> -->
            <div class="relative w-full border-b border-primary pb-4  px-5 py-2">
                <p class="text-muted text-[13px] mt-0.5">
                    {{  t('settings.mutedAccounts_desc')    }}
                </p>
            </div>
            <div v-if="myMutedUsersQuery.isSuccess.value">
                <UserAccountItem
                    v-for="user in myMutedUsersQuery.data.value"
                    :key="user.user_id"
                    :account="user">
                    <Button
                        id="settings-mute-button"
                        button-class="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full bg-red/10
                        border border-red text-red hover:bg-red-20 transition ml-3 text-red hover:text-red-400">
                        <MegaphoneOff :size="16" />
                    </Button>
                </UserAccountItem>
            </div>

            <!-- <div v-else-if="myMutedUsersQuery.isError.value" class="p-4 text-red-500">
                Failed to load muted accounts.
            </div> -->
        </div>
    </DetailedPanel>
</template>

<script setup lang="ts">
import UserAccountItem from './UserAccountItem.vue'
import DetailedPanel from './DetailedPanel.vue'
import { userSettingsQueries } from '../queries/userSettingsQueries'
import { MegaphoneOff } from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const { myMutedUsersQuery } = userSettingsQueries()
console.log('hahaga', myMutedUsersQuery)
watch(() => myMutedUsersQuery.data.value, (val) => {
    console.log('Muted users response:', val)
})

</script>
