<template>
    <div v-if="mutualFollowersCount > 0" class="mt-3 text-[15px] text-muted">
        <div class="flex items-center gap-1.5">
            <div class="flex -space-x-1">
                <img
                    v-for="follower in displayedFollowers"
                    :key="follower.user_id"
                    :src="follower.avatar_url || ''"
                    :alt="follower.name"
                    class="w-4 h-4 rounded-full border border-black object-cover bg-[#71767b]"
                >
            </div>
            <span class="text-muted hover:underline cursor-pointer">
                {{ formattedText }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { OtherUser } from '../../../types/user'

const props = defineProps<{
    mutualFollowersCount: number
    mutualFollowers: OtherUser[]
}>()

const { t } = useI18n()

const displayedFollowers = computed(() => {
    return props.mutualFollowers.slice(0, 3)
})

const formattedText = computed(() => {
    const count = props.mutualFollowersCount
    const followers = props.mutualFollowers

    if (count === 0 || followers.length === 0) return ''

    if (count === 1 && followers[0]) {
        return t('profile.mutualFollowers.followedBy', { name: followers[0].name })
    }

    if (count === 2 && followers[0] && followers[1]) {
        return t('profile.mutualFollowers.followedByTwo', {
            name1: followers[0].name,
            name2: followers[1].name,
        })
    }

    if (count > 2 && followers[0]) {
        const others = count - 1
        return t('profile.mutualFollowers.followedByMultiple', {
            name: followers[0].name,
            count: others,
        })
    }

    return ''
})
</script>
