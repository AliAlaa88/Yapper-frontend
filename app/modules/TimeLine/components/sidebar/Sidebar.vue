<template>
    <aside class="min-w-[275px] min-h-screen px-3 bg-primary flex flex-col">
        <nav class="flex flex-col gap-2 text-primary flex-1">
            <NuxtLink to="/" class="flex items-center gap-5 p-3 rounded-full">
                <div
                    class="w-[64px] h-[64px] hover:bg-hover rounded-full flex items-center justify-center p-3"
                >
                    <!-- <img
                        src="../../../../assets/logo-white.png"
                        alt="logo"
                        class="w-full h-full object-contain"
                    /> -->
                    <Logo imgClass="w-full h-full object-contain" />
                </div>
            </NuxtLink>
            <div v-for="link in navLinks" :key="link.href">
                <div class="flex items-center gap-5 p-3 rounded-full">
                    <NuxtLink
                        :to="link.href"
                        :id="`sidebar-link-${link.href}`"
                        class="flex items-center text-primary font-medium w-full"
                    >
                        <div
                            class="text-xl hover:bg-hover w-fit flex items-center gap-2 flex-row hover:bg-hover p-3 rounded-full"
                        >
                            <component :is="link.icon" class="w-[26px] h-[26px] text-primary" />
                            <span class="text-primary">{{ link.label_en }}</span>
                        </div>
                    </NuxtLink>
                </div>
            </div>

            <div>
                <button
                    class="py-3 px-4 bg-alternate rounded-full text-lg text-alternate font-medium transition-colors duration-200 hover:opacity-90 w-[90%]"
                    @click="handleOpen"
                    id="sidebar-post-btn"
                >
                    Post
                </button>
            </div>
        </nav>

        <div class="mt-10   mb-4">
            <UserActions />
        </div>

        <Popup :isOpen="isOpen" title="Post a tweet" @close="handleClose">
            <PostTweet :border="false" />
        </Popup>
    </aside>
</template>

<script setup lang="ts">
import { House, Search, Bell, Mail, User, Settings } from 'lucide-vue-next'
import PostTweet from '../postTweet/PostTweet.vue'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import Logo from '~/modules/Common/components/Logo'
import UserActions from './subCompoents/UserActions/index'
import { getUser } from '#imports'
const user = getUser();
const navLinks = [
    {
        label_en: 'Home',
        label_ar: 'الرئيسية',
        icon: House,
        href: '/en',
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
