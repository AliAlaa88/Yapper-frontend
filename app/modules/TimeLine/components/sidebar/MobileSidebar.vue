<template>
    <div class="sticky top-0 z-50 bg-primary/80 backdrop-blur-md border-b border-primary w-full">
        <!-- Mobile Header Bar -->
        <div class="flex items-center justify-between px-4 py-2">
            <div class="flex items-center gap-4">
                <!-- Avatar Trigger -->
                <button
                    id="btn-open-mobile-sidebar"
                    @click="isOpen = true"
                    class="rounded-full overflow-hidden size-10 cursor-pointer"
                >
                    <UserImage :image-url="user?.avatar_url" :name="user?.name" :compact="true" />
                </button>
            </div>

            <!-- Logo -->
            <div class="absolute left-1/2 -translate-x-1/2">
                <Logo imgClass="w-8 h-8 object-contain" />
            </div>

            <!-- Settings/Placeholder (to balance layout) -->
            <div class="w-8"></div>
        </div>
    </div>

    <!-- Sidebar Drawer - Teleported to body -->
    <Teleport to="body">
        <!-- Overlay -->
        <Transition name="fade">
            <div
                v-if="isOpen"
                class="fixed inset-0 z-9998 bg-black/50"
                @click="isOpen = false"
            ></div>
        </Transition>

        <!-- Drawer -->
        <Transition :name="isRTL ? 'slide-right' : 'slide-left'">
            <div
                v-if="isOpen"
                class="fixed top-0 bottom-0 z-9999 w-[280px] bg-primary shadow-xl overflow-y-auto flex flex-col"
                :class="isRTL ? 'right-0' : 'left-0'"
            >
                <!-- Drawer Header -->
                <div class="p-4 border-b border-primary flex justify-between items-center">
                    <span class="font-bold text-lg">{{ t('timeline.sidebar.profile') }}</span>
                    <button
                        id="btn-close-mobile-sidebar"
                        @click="isOpen = false"
                        class="p-2 hover:bg-hover rounded-full transition-colors cursor-pointer"
                    >
                        <X class="w-6 h-6 text-primary" />
                    </button>
                </div>

                <!-- User Info Summary -->
                <div class="p-4 border-b border-primary">
                    <div class="flex flex-col gap-1">
                        <UserImage :image-url="user?.avatar_url" :name="user?.name" />
                        <span class="font-bold text-primary">{{ user?.name }}</span>
                        <span class="text-muted text-sm">@{{ user?.username }}</span>
                    </div>
                    <div class="flex gap-4 mt-3 text-sm">
                        <span class="text-primary font-bold"
                            >{{ user?.following_count || 0 }}
                            <span class="text-muted font-normal">{{
                                t('profile.following')
                            }}</span></span
                        >
                        <span class="text-primary font-bold"
                            >{{ user?.followers_count || 0 }}
                            <span class="text-muted font-normal">{{
                                t('profile.followers')
                            }}</span></span
                        >
                    </div>
                </div>

                <!-- Navigation Links -->
                <div class="flex flex-col py-2">
                    <NuxtLink
                        v-for="link in navLinks"
                        :key="link.href"
                        :id="`mobile-sidebar-link-${link.href}`"
                        :to="link.href"
                        @click="isOpen = false"
                        class="flex items-center gap-4 px-4 py-3 hover:bg-muted transition-colors text-primary rounded-full relative"
                    >
                        <div class="relative">
                            <component :is="link.icon" class="w-6 h-6" />
                            <span
                                v-if="link.href === '/messages' && totalUnreadCount > 0"
                                class="absolute -top-1 -right-1 bg-accent text-primary text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center"
                            >
                                {{ totalUnreadCount > 99 ? '99+' : totalUnreadCount }}
                            </span>
                            <span
                                v-if="
                                    link.href === '/notifications' && totalUnreadNotifications > 0
                                "
                                class="absolute -top-1 -right-1 bg-accent text-primary text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center"
                            >
                                {{
                                    totalUnreadNotifications > 99 ? '99+' : totalUnreadNotifications
                                }}
                            </span>
                        </div>
                        <span class="text-lg">{{ t(link.labelKey) }}</span>
                    </NuxtLink>
                </div>

                <div class="mt-auto border-t border-primary p-4">
                    <!-- Logout or other bottom actions can go here -->
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { House, Search, Bell, Mail, User, Settings, Bookmark, X } from 'lucide-vue-next'
import Logo from '~/modules/Common/components/Logo'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { storeToRefs } from 'pinia'
import type { User as UserType } from '~/modules/Common/types/user'
import { useI18n } from 'vue-i18n'
import UserImage from '~/modules/Common/components/UserImage/UserImage.vue'

const { t, locale, locales } = useI18n()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const isOpen = ref(false)

const isRTL = computed(() => {
    const currentLocaleObj = locales.value.find((l) => l.code === locale.value)
    return currentLocaleObj?.dir === 'rtl'
})

// listen to unread chats summary
const { $chatSocketService, $notificationsSocketService } = useNuxtApp()
const totalUnreadCount = computed(() => $chatSocketService.totalUnreadChats.value)
const totalUnreadNotifications = computed(() => $notificationsSocketService.unreadCount.value)

const navLinks = [
    {
        labelKey: 'timeline.sidebar.home',
        icon: House,
        href: '/',
    },
    {
        labelKey: 'timeline.sidebar.explore',
        icon: Search,
        href: '/explore',
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
        href: user.value ? `/${user.value.username}` : '/profile',
    },
    {
        labelKey: 'timeline.sidebar.bookmarks',
        icon: Bookmark,
        href: '/bookmarks',
    },
    {
        labelKey: 'timeline.sidebar.settings',
        icon: Settings,
        href: '/settings/',
    },
]
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
    transition: transform 0.3s ease-in-out;
}

.slide-left-enter-from {
    transform: translateX(-100%);
}

.slide-left-leave-to {
    transform: translateX(-100%);
}

.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 0.3s ease-in-out;
}

.slide-right-enter-from {
    transform: translateX(100%);
}

.slide-right-leave-to {
    transform: translateX(100%);
}
</style>
