<template>
    <div class="flex items-start px-4 py-3 transition hover:bg-hover">
        <NuxtLink id="profile-link-settings" :to="`/${account.username}`" class="flex items-start w-full">
            <!-- <img :src="account.avatar_url ?? ''" class="w-12 h-12 rounded-full object-cover" > -->
            <UserImage :image-url="account.avatar_url || ''" :name="account.name" :compact="true" />
            <div class="flex-1 ml-3 space-y-1">
                <div class="flex items-left flex-col justify-between">
                    <span class="font-semibold hover:underline">{{ account.name }}</span>
                    <p class="text-muted text-[14px]">@{{ account.username }}</p>
                </div>
                <p class="text-sm leading-tight text-primary whitespace-pre-line">
                    {{ account.bio }}
                </p>
            </div>

        </NuxtLink>
        <slot />
    </div>
</template>

<script setup lang="ts">
import type { OtherUser } from '~/modules/profile/types/user'
import UserImage from '~/modules/Common/components/UserImage/UserImage.vue';

defineProps<{
    account: OtherUser
}>()
</script>
