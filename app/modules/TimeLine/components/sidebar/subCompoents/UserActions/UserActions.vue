<template>
    <div class="mt-auto my-4 relative">
        <!-- User Card -->
        <div
            class="flex items-center justify-between p-3 rounded-full hover:bg-hover cursor-pointer transition-colors"
            @click="togglePopup"
        >
            <!-- User Info -->
            <div class="flex items-center gap-3 flex-1">
                <!-- Avatar -->
                <div class="w-12 h-12 rounded-full overflow-hidden bg-gray">
                    <img
                        v-if="user?.avatar_url"
                        :src="user.avatar_url"
                        :alt="user.name"
                        class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center bg-blue">
                        <User class="w-7 h-7 text-white" />
                    </div>
                </div>
                <!-- Name and Username -->
                <div class="flex flex-col flex-1 min-w-0">
                    <span class="font-bold text-primary truncate text-sm">
                        {{ user?.name || 'User' }}
                    </span>
                    <span class="text-secondary text-sm truncate">
                        @{{ user.username || 'username' }}
                    </span>
                </div>
            </div>
            <!-- Three Dots Menu -->
            <button id="user-actions-menu-button" class="ml-2 p-1 rounded-full hover:bg-primary/10">
                <MoreVertical class="w-5 h-5 text-primary" />
            </button>
        </div>

        <!-- Dropdown Menu -->
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="translate-y-1 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="translate-y-1 opacity-0"
        >
            <div
                v-if="isPopupOpen"
                class="absolute bottom-full left-0 mb-2 w-[280px] bg-primary rounded-2xl shadow-xl border border-primary overflow-hidden z-50"
            >
                <!-- Caret Arrow -->
                <div class="absolute bottom-0 left-6 transform translate-y-full w-0 h-0">
                    <div
                        class="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"
                    ></div>
                    <div
                        class="absolute left-[-1px] top-[-1px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-dark"
                    ></div>
                </div>

                <!-- Menu Items -->
                <div class="py-2">
                    <!-- Add Existing Account -->
                    <button
                        class="w-full px-4 py-3 text-left text-primary hover:bg-hover transition-colors text-sm"
                        @click="handleAddExistingAccount"
                    >
                        Add an existing account
                    </button>

                    <!-- Logout -->
                    <button
                        class="w-full px-4 py-3 text-left text-primary hover:bg-hover transition-colors text-sm"
                        @click="handleLogoutClick"
                    >
                        Log out @{{ user.username || 'username' }}
                    </button>
                </div>
            </div>
        </Transition>

        <!-- Backdrop to close on click outside -->
        <div v-if="isPopupOpen" class="fixed inset-0 z-40" @click="closePopup"></div>

        <!-- Logout Confirmation Popup -->
        <Popup
            :isOpen="isLogoutConfirmOpen"
            :hasCloseButton="false"
            x-position="center"
            y-position="center"
            contentClass="max-w-[320px] w-full mx-4"
            headerClass=""
            slotClass="p-8 flex flex-col items-center justify-center max-h-none overflow-visible"
            @close="closeLogoutConfirm"
        >
            <div class="flex flex-col items-center">
                <!-- Logo -->
                <div class="mb-5">
                    <Logo imgClass="w-8 h-8" />
                </div>

                <!-- Title -->
                <h2 class="text-xl font-bold text-primary mb-2">Log out of X?</h2>

                <!-- Description -->
                <p class="text-secondary text-[15px] text-center mb-6 leading-5">
                    You can always log back in at any time. If you just want to switch accounts, you
                    can do that by adding an existing account.
                </p>

                <!-- Action Buttons -->
                <div class="flex flex-col gap-3 w-full">
                    <!-- Log out Button -->
                    <button
                        class="w-full py-3 px-6 bg-white text-black text-[15px] font-bold rounded-full hover:bg-gray-200 transition-colors"
                        @click="confirmLogout"
                    >
                        Log out
                    </button>

                    <!-- Cancel Button -->
                    <button
                        class="w-full py-3 px-6 bg-transparent border border-gray-700 text-primary text-[15px] font-bold rounded-full hover:bg-gray-800/50 transition-colors"
                        @click="closeLogoutConfirm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Popup>
    </div>
</template>

<script setup lang="ts">
import { User, MoreVertical } from 'lucide-vue-next'

import { useLogoutQuery } from '~/modules/auth/queries/useLoginQuery'
import type { User as UserType } from '~/modules/Common/types/user'
import { getUser } from '~/utils/helpers'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import Logo from '~/modules/Common/components/Logo'

const user = getUser() as UserType

const isPopupOpen = ref(false)
const isLogoutConfirmOpen = ref(false)

const { mutate: logout } = useLogoutQuery()

const togglePopup = () => {
    isPopupOpen.value = !isPopupOpen.value
}

const closePopup = () => {
    isPopupOpen.value = false
}

const handleAddExistingAccount = () => {
    // UI only - no functionality yet
    console.log('Add existing account clicked')
    closePopup()
}

const handleLogoutClick = () => {
    closePopup()
    isLogoutConfirmOpen.value = true
}

const closeLogoutConfirm = () => {
    isLogoutConfirmOpen.value = false
}

const confirmLogout = () => {
    logout()
    closeLogoutConfirm()
}
</script>
