<template>
    <div class="mt-3 flex flex-wrap gap-5">
        <div class="flex gap-1">
            <span class="font-bold text-primary">{{ followingCount }}</span>
            <span class="text-muted">Following</span>
        </div>
        <div class="flex gap-1">
            <span class="font-bold text-primary">{{ followersCount }}</span>
            <span class="text-muted">Followers</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserInfo } from '../../../composables/useUserInfo'
import { inject } from 'vue'
const userId = inject<Ref<string>>('user-id')!
const { followersCount, followingCount } = useUserInfo(userId)
</script>
