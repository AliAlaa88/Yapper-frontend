<template>
    <DetailedPanel title="Delete Account">
        <div class="w-full text-primary">
            <div class="flex items-start px-4 py-3 transition">
                <img :src="user.avatar_url ?? ''" class="w-10 h-10 rounded-full object-cover" />

                <div class="flex-1 ml-3 space-y-1">
                    <div class="flex items-left flex-col justify-between">
                        <span class="font-semibold">{{ user.name }}</span>
                        <p class="text-muted text-[14px]">@{{ user.username }}</p>
                    </div>
                </div>
            </div>
            <div class="space-y-4 border-b border-primary">
                <h1
                    class="text-xl text-primary font-bold mt-3 ml-5"
                >
                    This will delete your account
                </h1>
                <p
                    class="text-[13px] text-muted max-w-lg ml-5 mb-4"
                >
                    {{ `You’re about to start the process of deleting your
                    Yapper account. Your display name, @${user.username}, and
                    public profile will no longer be viewable on Yapper.com,
                    Yapper for iOS, or Yapper for Android.`}}
                </p>
            </div>
            <Button
                button-class="w-full hover:bg-red-500/10 h-13 mt-2 text-red bg-primary"
                button-text="Delete"
                :is-loading="useDeleteAccount.isPending.value"
                @click="handleDelete"
            />
        </div>
    </DetailedPanel>
</template>

<script setup lang="ts">
import DetailedPanel from './DetailedPanel.vue'
import { getUser } from '~/utils/helpers'
import type { User } from '~/modules/Common/types/user'
import Button from '~/components/ui/Button.vue'
import { userSettingsQueries } from '../queries/userSettingsQueries'
const {useDeleteAccount} = userSettingsQueries()

const user = getUser() as User

const handleDelete = async () => {
    try {
        await useDeleteAccount.mutateAsync()
    } catch (error) {
        console.log('error deleting account', error)
    }
}
</script>
