<template>
    <div class="mt-3 flex gap-5">
        <div class="flex gap-1">
            <span class="font-bold text-white">{{ followingCount }}</span>
            <span class="text-[#71767b]">Following</span>
        </div>
        <div class="flex gap-1">
            <span class="font-bold text-white">{{ followersCount }}</span>
            <span class="text-[#71767b]">Followers</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserInfo } from '../../../composables/useUserInfo'
import { inject } from 'vue'
const userId = inject<Ref<string>>('user-id')!
const { followersCount, followingCount } = useUserInfo(userId)
</script>
