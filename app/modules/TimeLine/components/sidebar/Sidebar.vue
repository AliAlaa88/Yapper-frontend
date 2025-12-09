<template>
    <aside
        :class="[
            'h-full bg-primary flex flex-col transition-all duration-300 ease-in-out',
            isCollapsed ? 'w-[70px] px-2' : 'w-[275px] px-3',
        ]"
    >
        <nav class="flex flex-col flex-1 py-1">
            <!-- Logo -->
            <NuxtLink
                :to="'/'"
                :class="[
                    'inline-flex items-center mb-1 transition-all duration-200',
                    isCollapsed ? 'justify-center' : 'justify-start',
                ]"
            >
                <div
                    :class="[
                        'hover:bg-hover rounded-full flex items-center justify-center transition-colors duration-200',
                        isCollapsed ? 'w-[50px] h-[50px]' : 'w-[65px] h-[65px]',
                    ]"
                >
                    <Logo
                        :img-class="
                            isCollapsed
                                ? 'w-[30px] h-[30px] object-contain'
                                : 'w-[40px] h-[40px] object-contain'
                        "
                    />
                </div>
            </NuxtLink>

            <!-- Navigation Links -->
            <div class="flex flex-col gap-4">
                <template v-for="link in navLinks" :key="link.href">
                    <CustomToolTip
                        v-if="isCollapsed"
                        :side="tooltipSide"
                        align="center"
                        :delay-duration="300"
                        content-class="rounded-2xl shadow-xl border border-primary bg-primary px-3 py-2"
                    >
                        <template #trigger>
                            <NuxtLink
                                :id="`sidebar-link-${link.href}`"
                                :to="link.href"
                                class="inline-flex items-center justify-center group relative"
                            >
                                <div
                                    class="flex items-center justify-center p-3 rounded-full hover:bg-hover transition-colors duration-200 w-full relative"
                                >
                                    <component
                                        :is="link.icon"
                                        class="w-[26px] h-[26px] text-primary"
                                    />
                                    <span
                                        v-if="link.href === '/messages' && totalUnreadCount > 0"
                                        class="absolute -top-1 -right-1 bg-accent text-primary text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center"
                                    >
                                        {{ totalUnreadCount > 99 ? '99+' : totalUnreadCount }}
                                    </span>
                                </div>
                            </NuxtLink>
                        </template>
                        <template #content>
                            <span class="text-sm text-primary whitespace-nowrap">{{
                                t(link.labelKey)
                            }}</span>
                        </template>
                    </CustomToolTip>

                    <NuxtLink
                        v-else
                        :id="`sidebar-link-${link.href}`"
                        :to="link.href"
                        class="inline-flex items-center justify-start group relative"
                    >
                        <div
                            class="flex items-center gap-4 p-3 rounded-full hover:bg-hover transition-colors duration-200 relative"
                        >
                            <div class="relative">
                                <component :is="link.icon" class="w-[26px] h-[26px] text-primary" />
                                <span
                                    v-if="link.href === '/messages' && totalUnreadCount > 0"
                                    class="absolute -top-1 -right-1 bg-accent text-primary text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center"
                                >
                                    {{ totalUnreadCount > 99 ? '99+' : totalUnreadCount }}
                                </span>
                            </div>
                            <span class="text-[20px] text-primary font-normal">{{
                                t(link.labelKey)
                            }}</span>
                        </div>
                    </NuxtLink>
                </template>
            </div>

            <!-- Post Button -->
            <div :class="['mt-10', isCollapsed ? '' : 'pr-6']">
                <CustomToolTip
                    v-if="isCollapsed"
                    :side="tooltipSide"
                    align="center"
                    :delay-duration="300"
                    content-class="rounded-2xl shadow-xl border border-primary bg-primary px-3 py-2"
                >
                    <template #trigger>
                        <button
                            id="sidebar-post-btn_collapsed"
                            class="w-full aspect-square bg-alternate rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-90"
                            @click="handleOpen"
                        >
                            <Plus :size="24" class="text-alternate" />
                        </button>
                    </template>
                    <template #content>
                        <span class="text-sm text-primary whitespace-nowrap">{{
                            t('timeline.sidebar.post')
                        }}</span>
                    </template>
                </CustomToolTip>

                <button
                    v-else
                    id="sidebar-post-btn_expanded"
                    class="w-full py-3 px-6 bg-alternate rounded-full text-[17px] text-alternate font-bold transition-all duration-200 hover:opacity-90"
                    @click="handleOpen"
                >
                    {{ t('timeline.sidebar.post') }}
                </button>
            </div>
        </nav>

        <!-- User Actions at Bottom -->
        <div class="pb-4">
            <UserActions :is-collapsed="isCollapsed" />
        </div>

        <!-- Popup -->
        <Popup
            :isOpen="isOpen"
            :title="t('timeline.sidebar.postTweet')"
            @close="handleClose"
            bgColor="bg-popup/20"
            :slotClass="'w-full'"
        >
            <PostTweet :border="false" :handleClose="handleClose" />
        </Popup>
    </aside>
</template>

<script setup lang="ts">
import { House, Search, Bell, Mail, User, Settings, Bookmark, Plus } from 'lucide-vue-next'
import PostTweet from '../postTweet/PostTweet.vue'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import Logo from '~/modules/Common/components/Logo'
import UserActions from './subCompoents/UserActions/index'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useSidebarState } from '../../composables/useSidebarState'
import { CustomToolTip } from '~/modules/Common/components/Tooltip'

const { t, locale, locales } = useI18n()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const { isCollapsed } = useSidebarState()

// Determine tooltip side based on RTL/LTR
const isRTL = computed(() => {
    const currentLocaleObj = locales.value.find((l) => l.code === locale.value)
    return currentLocaleObj?.dir === 'rtl'
})

const tooltipSide = computed(() => (isRTL.value ? 'left' : 'right'))

const navLinks = computed(() => [
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
        href: '/settings/account',
    },
])

const isOpen = ref(false)

const handleOpen = () => {
    isOpen.value = true
}

const handleClose = () => {
    isOpen.value = false
}

const { $chatSocketService } = useNuxtApp()
const totalUnreadCount = computed(() => $chatSocketService.totalUnreadCount.value)
</script>
