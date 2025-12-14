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
                    <UserImage :image-url="user?.avatar_url" :name="user?.name" :size="40" />
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

                <div class="border-t border-primary">
                    <!-- User Info -->
                    <div class="p-4">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-12 h-12 rounded-full overflow-hidden bg-gray flex-shrink-0"
                            >
                                <NuxtImg
                                    v-if="user?.avatar_url"
                                    :src="user.avatar_url"
                                    :alt="user.name"
                                    class="w-full h-full object-cover"
                                    :onerror="
                                        (event: any) => handleImageError(user?.name ?? '', event)
                                    "
                                />
                                <NuxtImg
                                    :src="`https://ui-avatars.com/api/?name=${user?.name}&background=random`"
                                    alt="User"
                                    class="w-full h-full object-cover"
                                />
                            </div>
                            <div class="flex flex-col min-w-0 flex-1">
                                <span class="font-bold text-primary text-sm truncate">
                                    {{ user?.name || 'User' }}
                                </span>
                                <span class="text-secondary text-sm truncate">
                                    @{{ user?.username || 'username' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Menu Items -->
                    <div class="px-4 pb-4">
                        <!-- Logout -->
                        <button
                            class="w-full px-4 py-3 text-left cursor-pointer text-primary hover:bg-hover transition-colors text-sm"
                            @click="handleLogoutClick"
                        >
                            {{
                                $t('userActions.logoutUsername', {
                                    username: user?.username || 'username',
                                })
                            }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>

    <!-- Logout Confirmation Popup -->
    <Popup
        :is-open="isLogoutConfirmOpen"
        :has-close-button="false"
        x-position="center"
        y-position="center"
        content-class="w-full"
        header-class=""
        slot-class="p-8 flex flex-col items-center justify-center max-h-none overflow-visible"
        @close="closeLogoutConfirm"
    >
        <div class="flex flex-col items-center">
            <!-- Logo -->
            <div class="mb-5">
                <Logo img-class="w-8 h-8" />
            </div>

            <!-- Title -->
            <h2 class="text-xl font-bold text-primary mb-2">{{ $t('userActions.logoutTitle') }}</h2>

            <!-- Description -->
            <p class="text-secondary text-[15px] text-center mb-6 leading-5">
                {{ $t('userActions.logoutDescription') }}
            </p>

            <!-- Action Buttons -->
            <div class="flex flex-col gap-3 w-full">
                <!-- Log out Button -->
                <button
                    class="w-full py-3 px-6 bg-white text-black text-[15px] font-bold rounded-full hover:bg-gray-200 transition-colors"
                    @click="confirmLogout"
                >
                    {{ $t('userActions.logout') }}
                </button>

                <!-- Cancel Button -->
                <button
                    class="w-full py-3 px-6 bg-transparent border border-gray-700 text-primary text-[15px] font-bold rounded-full hover:bg-gray-800/50 transition-colors"
                    @click="closeLogoutConfirm"
                >
                    {{ $t('userActions.cancel') }}
                </button>
            </div>
        </div>
    </Popup>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { House, Search, Bell, Mail, User, Settings, Bookmark, X } from 'lucide-vue-next'
import Logo from '~/modules/Common/components/Logo'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import UserImage from '~/modules/Common/components/UserImage/UserImage.vue'
import { useLogoutQuery } from '~/modules/auth/queries/useLoginQuery'
import { handleImageError } from '~/utils/helpers'

const { t, locale, locales } = useI18n()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const isOpen = ref(false)
const isLogoutConfirmOpen = ref(false)

const isRTL = computed(() => {
    const currentLocaleObj = locales.value.find((l) => l.code === locale.value)
    return currentLocaleObj?.dir === 'rtl'
})

// listen to unread chats summary
const { $chatSocketService, $notificationsSocketService } = useNuxtApp()
const totalUnreadCount = computed(() => $chatSocketService.totalUnreadChats.value)
const totalUnreadNotifications = computed(() => $notificationsSocketService.unreadCount.value)

const { mutate: logout } = useLogoutQuery()

const handleLogoutClick = () => {
    isOpen.value = false
    isLogoutConfirmOpen.value = true
}

const closeLogoutConfirm = () => {
    isLogoutConfirmOpen.value = false
}

const confirmLogout = () => {
    logout()
}

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
