<template>
    <DetailedPanel title="Change Username">
        <div class="relative w-full space-y-4">
            <div class="px-4 py-3">
                <div class="relative w-full">
                    <input
                        id="username"
                        v-model="user.username"
                        type="text"
                        placeholder="Username"
                        class="peer w-full bg-black border border-primary px-4 py-3 rounded-md
                               text-primary focus:outline-none focus:ring-2 focus:ring-accent-500
                               text-base"
                    />
                    <!-- <label
                        for="username"
                        class="absolute left-3 transition-all pointer-events-none bg-black px-1
                               text-gray-400 peer-focus:text-blue-500"
                        :class="{
                            'top-1/2 -translate-y-1/2 text-base': !user.username && !user.username.length,
                            'opacity-0': !user.username && !user.username.length,
                            '-top-2 text-xs opacity-100': user.username && user.username.length
                        }"
                    >
                        Username
                    </label> -->
                </div>
            </div>
            <div class="w-full border-t border-b border-primary px-4 py-3 mb-2 space-y-4">
                <h1 class="font-bold text-xl">Suggestions</h1>
            </div>
        </div>
    </DetailedPanel>
</template>

<script setup lang="ts">
import DetailedPanel from './DetailedPanel.vue'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { storeToRefs } from 'pinia'
import type { User } from '~/modules/Common/types/user'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
</script>
