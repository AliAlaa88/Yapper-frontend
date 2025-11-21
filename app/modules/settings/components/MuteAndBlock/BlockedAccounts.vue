<template>
    <DetailedPanel :title="$t('settings.blockedAccounts')">
        <div class="w-full text-primary">
            <div v-if="myBlockedUsersQuery.isLoading.value" class="p-4 text-muted">
                Loading muted accounts...
            </div>
            <div class="relative w-full border-b border-primary pb-4  px-5 py-2">
                <p class="text-muted text-[13px] mt-0.5">
                    {{ $t('settings.blockedAccounts_desc') }}
                </p>
            </div>
            <div v-if="myBlockedUsersQuery.isSuccess.value">
                <UserAccountItem
                    v-for="user in myBlockedUsersQuery.data.value"
                    :key="user.user_id"
                    :account="user">
                    <ProfileBlockedAction />
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
import DetailedPanel from '../DetailedPanel.vue'
import { userSettingsQueries } from '../../queries/userSettingsQueries'
import ProfileBlockedAction from '~/modules/profile/components/ProfileHeader/SubComponents/ProfileBlockedAction.vue'

const { myBlockedUsersQuery } = userSettingsQueries()
console.log('hahaga', myBlockedUsersQuery)
watch(() => myBlockedUsersQuery.data.value, (val) => {
    console.log('Blocked users response:', val)
})

</script>
