<template>
    <aside class="min-w-[275px] min-h-screen px-3 bg-primary">
        <nav class="flex flex-col gap-2 text-primary h-full">
            <NuxtLink to="/" class="flex items-center gap-5 p-3 rounded-full">
                <div
                    class="w-[64px] h-[64px] hover:bg-hover rounded-full flex items-center justify-center p-3"
                >
                    <img
                        src="../../../../assets/logo-white.png"
                        alt="logo"
                        class="w-full h-full object-contain"
                    />
                </div>
            </NuxtLink>
            <div v-for="link in navLinks" :key="link.href">
                <div class="flex items-center gap-5 p-3 rounded-full">
                    <NuxtLink
                        :to="link.href"
                        class="flex items-center text-primary font-medium w-full"
                    >
                        <div
                            class="text-xl hover:bg-hover w-fit flex items-center gap-2 flex-row hover:bg-hover p-3 rounded-full"
                        >
                            <component :is="link.icon" class="w-[26px] h-[26px] text-primary" />
                            <span class="text-primary">{{ link.label }}</span>
                        </div>
                    </NuxtLink>
                </div>
            </div>

            <div>
                <button
                    class="py-3 px-4 bg-alternate rounded-full text-lg text-alternate font-medium transition-colors duration-200 hover:opacity-90 w-[90%]"
                >
                    Post
                </button>
            </div>
        </nav>
    </aside>
</template>

<script setup lang="ts">
import { House, Search, Bell, Mail, User, Settings } from 'lucide-vue-next'
const navLinks = [
    {
        label: 'Home',
        icon: House,
        href: '/',
    },
    {
        label: 'Search',
        icon: Search,
        href: '/search',
    },
    {
        label: 'Notifications',
        icon: Bell,
        href: '/notifications',
    },
    {
        label: 'Messages',
        icon: Mail,
        href: '/messages',
    },
    {
        label: 'Profile',
        icon: User,
        href: '/profile',
    },
    {
        label: 'Settings',
        icon: Settings,
        href: '/settings',
    },
]
</script>
