<template>
    <div class="w-full">
        <div 
            v-for="user in users" 
            :key="user.id"
            class="px-4 py-3 flex items-center justify-between hover:bg-hover transition-colors border-b border-primary"
        >
            <div 
                class="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                @click="onClickUser(user)"
            >
                <img 
                    :src="user.avatar_url" 
                    :alt="user.name"
                    class="w-12 h-12 rounded-full object-cover"
                    @error="(e) => handleImageError(user.name, e)"
                />
                <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1">
                        <p class="text-primary font-bold truncate">{{ user.name }}</p>
                        <BadgeCheck v-if="user.verified" class="w-4 h-4 text-accent shrink-0" />
                    </div>
                    <p class="text-muted text-sm truncate">@{{ user.username }}</p>
                    <p v-if="user.bio" class="text-primary text-sm line-clamp-2 mt-1">{{ user.bio }}</p>
                </div>
            </div>
            <div @click.stop>
                <Button
                    :button-text="user.is_following ? t('timeline.banner.following') : t('timeline.banner.follow')"
                    :button-class="user.is_following 
                        ? 'px-4 py-1.5 rounded-full text-sm font-semibold border border-primary text-primary hover:bg-red-500/10 hover:text-red-500 hover:border-red-500 transition-colors' 
                        : 'px-4 py-1.5 rounded-full text-sm font-semibold bg-accent text-white hover:bg-accent-hover transition-colors'"
                    :is-loading="followingUserId === user.id"
                    class="shrink-0 ml-3"
                    @click="handleFollowToggle(user)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from '~/modules/Common/components/Button/Button.vue'
import { BadgeCheck } from 'lucide-vue-next'
import { handleImageError } from '~/utils/helpers'
import { useNuxtApp } from '#app'

const { t } = useI18n()
const router = useRouter()
const { $userInfoService, $queryClient } = useNuxtApp()

interface User {
    id: string
    username: string
    name: string
    bio?: string
    avatar_url: string
    verified?: boolean
    is_following?: boolean
}

defineProps<{
    users: User[]
}>()

const followingUserId = ref<string | null>(null)

function onClickUser(user: User) {
    router.push(`/${user.username}`)
}

async function handleFollowToggle(user: User) {
    console.log('Follow toggle clicked for:', user.username)
    followingUserId.value = user.id
    
    try {
        if (user.is_following) {
            console.log('Unfollowing user:', user.id)
            await $userInfoService.unfollowUser(user.id)
        } else {
            console.log('Following user:', user.id)
            await $userInfoService.followUser(user.id)
        }
        
        // Invalidate queries to refresh the data
        $queryClient.invalidateQueries({ queryKey: ['explore', 'who-to-follow'] })
        $queryClient.invalidateQueries({ queryKey: ['getExplore'] })
        $queryClient.invalidateQueries({ queryKey: ['user', user.id] })
        
        console.log('Follow action successful')
    } catch (error) {
        console.error('Failed to toggle follow:', error)
    } finally {
        followingUserId.value = null
    }
}
</script>
