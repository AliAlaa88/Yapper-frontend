<template>
    <div class="flex items-start px-4 py-3 transition">
        <img :src="account.avatar_url ?? ''" class="w-12 h-12 rounded-full object-cover" />

        <div class="flex-1 ml-3 space-y-1">
            <div class="flex items-left flex-col justify-between">
                <span class="font-semibold">{{ account.name }}</span>
                <p class="text-muted text-[14px]">@{{ account.username }}</p>
            </div>
            <p class="text-sm leading-tight text-primary whitespace-pre-line">
                {{ account.bio }}
            </p>
        </div>

        <slot />
    </div>
</template>

<script setup lang="ts">
import type { OtherUser } from '~/modules/profile/types/user'


defineProps<{
    account: OtherUser
}>()
</script>
