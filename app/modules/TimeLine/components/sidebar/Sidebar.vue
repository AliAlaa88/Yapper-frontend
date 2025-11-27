<template>
    <aside class="min-w-[275px] min-h-screen px-3 bg-primary flex flex-col">
        <nav class="flex flex-col flex-1 py-1">
            <!-- Logo -->
            <NuxtLink to="/" class="inline-flex items-center justify-start mb-1">
                <div
                    class="w-[65px] h-[65px] hover:bg-hover rounded-full flex items-center justify-center transition-colors duration-200"
                >
                    <Logo img-class="w-[40px] h-[40px] object-contain" />
                </div>
            </NuxtLink>

            <!-- Navigation Links -->
            <div class="flex flex-col gap-4">
                <NuxtLink
                    v-for="link in navLinks"
                    :id="`sidebar-link-${link.href}`"
                    :key="link.href"
                    :to="link.href"
                    class="inline-flex items-center justify-start group"
                >
                    <div
                        class="flex items-center gap-4 p-3 rounded-full hover:bg-hover transition-colors duration-200"
                    >
                        <component :is="link.icon" class="w-[26px] h-[26px] text-primary" />
                        <span class="text-[20px] text-primary font-normal">{{
                            t(link.labelKey)
                        }}</span>
                    </div>
                </NuxtLink>
            </div>

            <!-- Post Button -->
            <div class="mt-10 pr-6">
                <button
                    id="sidebar-post-btn"
                    class="w-full py-3 px-6 bg-alternate rounded-full text-[17px] text-alternate font-bold transition-all duration-200 hover:opacity-90"
                    @click="handleOpen"
                >
                    {{ t('timeline.sidebar.post') }}
                </button>
            </div>
        </nav>

        <!-- User Actions at Bottom -->
        <div class="pb-4">
            <UserActions />
        </div>

        <!-- Popup -->
        <Popup :is-open="isOpen" :title="t('timeline.sidebar.postTweet')" @close="handleClose">
            <PostTweet :border="false" />
        </Popup>
    </aside>
</template>

<script setup lang="ts">
import { House, Search, Bell, Mail, User, Settings, Bookmark } from 'lucide-vue-next'
import PostTweet from '../postTweet/PostTweet.vue'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import Logo from '~/modules/Common/components/Logo'
import UserActions from './subCompoents/UserActions/index'
import { getUser } from '#imports'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const user = getUser()

const navLinks = [
    {
        labelKey: 'timeline.sidebar.home',
        icon: House,
        href: '/',
    },
    {
        labelKey: 'timeline.sidebar.search',
        icon: Search,
        href: '/search',
    },
    {
        labelKey: 'timeline.sidebar.notifications',
        icon: Bell,
        href: '/notifications',
    },
    {
        labelKey: 'timeline.sidebar.messages',
        icon: Mail,
        href: '/messages',
    },
    {
        labelKey: 'timeline.sidebar.profile',
        icon: User,
        href: user ? `/${user.username}` : '/profile',
    },
    {
        labelKey: 'timeline.sidebar.bookmarks',
        icon: Bookmark,
        href: '/bookmarks',
    },
    {
        labelKey: 'timeline.sidebar.settings',
        icon: Settings,
        href: '/settings/account',
    },
]

const isOpen = ref(false)

const handleOpen = () => {
    isOpen.value = true
}

const handleClose = () => {
    isOpen.value = false
}
</script>
