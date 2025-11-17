<template>
    <div class="mt-3 flex flex-wrap gap-5 text-[15px]">
        <div class="flex gap-1 hover:underline cursor-pointer">
            <span class="font-bold text-primary">{{ followingCount }}</span>
            <span class="text-muted">{{ $t('profile.following') }}</span>
        </div>
        <div class="flex gap-1 hover:underline cursor-pointer">
            <span class="font-bold text-primary">{{ followersCount }}</span>
            <span class="text-muted">{{ $t('profile.followers') }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserInfo } from '../../../composables/useUserInfo'
import { inject } from 'vue'
const userId = inject<Ref<string>>('user-id')!
const { followersCount, followingCount } = useUserInfo(userId)
</script>
