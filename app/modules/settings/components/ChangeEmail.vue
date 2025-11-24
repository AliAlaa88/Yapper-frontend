<template>
    <DetailedPanel title="Change your password">
        <div class="relative w-full border-b border-primary">
            <div class="px-4 py-3 mb-2">
                <div class="relative w-full">
                    <input
                        id="current-email"
                        type="text"
                        :value="user.email"
                        readonly
                        class="w-full border border-primary px-4 py-4 rounded-md opacity-50
                            text-muted text-base focus:outline-none cursor-default" >
                    <label
                        for="current-email"
                        class="absolute left-4 -top-3 text-xs text-muted
                        pointer-events-none px-1 py-1">
                        Current
                    </label>
                </div>
            </div>
        </div>
        <div class="flex justify-center mt-4">
            <!-- <button
                class="text-accent text-[15px] hover:text-orange-400
                transition-colors duration-200"
                @click=""
            >
                Update email address
            </button> -->
        </div>
    </DetailedPanel>
</template>

<script setup lang="ts">
import DetailedPanel from './DetailedPanel.vue'
import { getUser } from '~/utils/helpers'
import type { User } from '~/modules/Common/types/user'

const user = getUser() as User
</script>
