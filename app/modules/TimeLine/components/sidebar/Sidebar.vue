<template>
    <aside class="min-w-[275px] min-h-screen px-3 bg-primary flex flex-col">
        <nav class="flex flex-col flex-1 py-1">
            <!-- Logo -->
            <NuxtLink to="/" class="inline-flex items-center justify-start mb-1">
                <div
                    class="w-[65px] h-[65px] hover:bg-hover rounded-full flex items-center justify-center transition-colors duration-200"
                >
                    <Logo imgClass="w-[40px] h-[40px] object-contain" />
                </div>
            </NuxtLink>

            <!-- Navigation Links -->
            <div class="flex flex-col gap-4">
                <NuxtLink
                    v-for="link in navLinks"
                    :key="link.href"
                    :to="link.href"
                    :id="`sidebar-link-${link.href}`"
                    class="inline-flex items-center justify-start group"
                >
                    <div
                        class="flex items-center gap-4 p-3 rounded-full hover:bg-hover transition-colors duration-200"
                    >
                        <component :is="link.icon" class="w-[26px] h-[26px] text-primary" />
                        <span class="text-[20px] text-primary font-normal">{{
                            link.label_en
                        }}</span>
                    </div>
                </NuxtLink>
            </div>

            <!-- Post Button -->
            <div class="mt-10 pr-6">
                <button
                    class="w-full py-3 px-6 bg-alternate rounded-full text-[17px] text-alternate font-bold transition-all duration-200 hover:opacity-90"
                    @click="handleOpen"
                    id="sidebar-post-btn"
                >
                    Post
                </button>
            </div>
        </nav>

        <!-- User Actions at Bottom -->
        <div class="pb-4">
            <UserActions />
        </div>

        <!-- Popup -->
        <Popup :isOpen="isOpen" title="Post a tweet" @close="handleClose">
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

const user = getUser()

const navLinks = [
    {
        label_en: 'Home',
        label_ar: 'الرئيسية',
        icon: House,
        href: '/',
    },
    {
        label_en: 'Search',
        label_ar: 'البحث',
        icon: Search,
        href: '/search',
    },
    {
        label_en: 'Notifications',
        label_ar: 'الإشعارات',
        icon: Bell,
        href: '/notifications',
    },
    {
        label_en: 'Messages',
        label_ar: 'الرسائل',
        icon: Mail,
        href: '/messages',
    },
    {
        label_en: 'Profile',
        label_ar: 'الملف الشخصي',
        icon: User,
        href: user ? `/${user.username}` : '/profile',
    },
    {
        label_en: 'Bookmarks',
        label_ar: 'المفضلة',
        icon: Bookmark,
        href: '/bookmarks',
    },
    {
        label_en: 'Settings',
        label_ar: 'الإعدادات',
        icon: Settings,
        href: '/settings',
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
