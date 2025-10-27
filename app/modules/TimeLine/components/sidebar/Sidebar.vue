<template>
    <aside class="min-w-[275px] min-h-screen px-3 border-r border-x bg-primary">
        <nav class="flex flex-col justify-evenly text-primary h-full">
            <NuxtLink
                to="/"
                class="flex items-center gap-5 px-3 py-3 rounded-full transition-colors duration-200 hover:bg-hover"
            >
                <img src="../../../../assets/logo-white.png" alt="logo" class="w-[32px] h-[32px]" />
            </NuxtLink>
            <div v-for="link in navLinks" :key="link.href">
                <div
                    class="flex items-center gap-5 p-3 rounded-full transition-colors duration-200"
                >
                    <NuxtLink
                        :to="link.href"
                        class="flex items-center text-primary font-medium transition-colors duration-200 w-full"
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
                    class="py-3 px-4 bg-alternate rounded-full text-alternate font-medium transition-colors duration-200 hover:opacity-90 w-[90%]"
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
