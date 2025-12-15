<template>
    <!-- Mobile: Bottom sheet overlay -->
    <div
        v-if="visible && isMobile"
        class="fixed inset-0 bg-black/50 z-50"
        @click="$emit('close')"
    />
    <div
        v-if="visible"
        ref="mentionSuggestionRef"
        class="fixed z-100 w-[360px] max-h-80 overflow-y-auto bg-primary border border-primary shadow-2xl md:rounded-2xl rounded-t-2xl rounded-b-none inset-x-0 bottom-0 md:bottom-auto md:inset-x-auto"
        :style="popupStyle"
        @click.stop
    >
        <div v-if="loading" class="p-3 text-sm text-muted">{{ t('mentions.loading') }}</div>
        <div v-else-if="!suggestions.length" class="p-3 text-sm text-muted">
            {{ t('mentions.noMatches') }}
        </div>
        <ul v-else class="divide-y divide-primary">
            <li
                v-for="user in suggestions"
                :key="user.user_id"
                class="flex items-center gap-3 px-4 py-3 hover:bg-hover cursor-pointer transition-colors"
                @click="handleSelect(user)"
            >
                <UserImage :image-url="user.avatar_url" :name="user.username" :compact="true" />
                <div class="flex flex-col leading-tight">
                    <span class="text-primary text-sm font-semibold">{{
                        user.name || user.username
                    }}</span>
                    <span class="text-muted text-xs">@{{ user.username }}</span>
                    <span
                        v-if="statusFor(user)"
                        class="text-muted text-xs mt-1 flex items-center gap-1"
                    >
                        <component
                            :is="statusFor(user)?.icon"
                            class="w-3.5 h-3.5"
                            stroke-width="2"
                        />
                        {{ statusFor(user)?.label }}
                    </span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { UserCheck, UserPlus, Users } from 'lucide-vue-next'
import type { Component } from 'vue'
import { useI18n } from 'vue-i18n'
import UserImage from '~/modules/Common/components/UserImage/UserImage.vue'
import type { UserSuggestion } from '~/modules/search/types'
import { watch, onBeforeUnmount, nextTick } from 'vue'

const props = withDefaults(
    defineProps<{
        visible: boolean
        suggestions: UserSuggestion[]
        loading?: boolean
        position?: { top: number; left: number }
    }>(),
    {
        loading: false,
        position: () => ({ top: 0, left: 0 }),
    },
)

const emit = defineEmits<{
    select: [user: UserSuggestion]
    close: []
}>()

const mentionSuggestionRef = ref<HTMLElement | null>(null)
const triggerRect = ref<DOMRect | null>(null)

const isMobile = computed(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
})

const popupStyle = computed(() => {
    // On mobile, use bottom sheet positioning
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
        return {
            bottom: '0',
            left: '0',
            right: '0',
            top: 'auto',
            width: '100%',
            maxHeight: '50vh',
            borderRadius: '1rem 1rem 0 0',
        }
    }

    if (!triggerRect.value) {
        return {
            top: `${props.position.top}px`,
            left: `${props.position.left}px`,
        }
    }

    const rect = triggerRect.value
    const pickerWidth = 360
    const pickerHeight = 320 // max-h-80 = 320px

    // Calculate position to avoid going off screen
    let left = rect.left
    let top = rect.bottom + 8

    // Adjust if would go off right edge
    if (left + pickerWidth > window.innerWidth) {
        left = window.innerWidth - pickerWidth - 8
    }

    // Adjust if would go off left edge
    if (left < 8) {
        left = 8
    }

    // If would go off bottom, position above instead
    if (top + pickerHeight > window.innerHeight) {
        top = rect.top - pickerHeight - 8
        // If still off screen at top, position at bottom of viewport
        if (top < 8) {
            top = window.innerHeight - pickerHeight - 8
        }
    }

    return {
        top: `${top}px`,
        left: `${left}px`,
    }
})

const handleSelect = (user: UserSuggestion) => {
    emit('select', user)
}

const handleClickOutside = (event: MouseEvent) => {
    if (mentionSuggestionRef.value && !mentionSuggestionRef.value.contains(event.target as Node)) {
        emit('close')
    }
}

watch(
    () => props.visible,
    async (newValue) => {
        if (newValue) {
            await nextTick()
            // Get the textarea's position from the parent
            if (mentionSuggestionRef.value) {
                const parent = mentionSuggestionRef.value.parentElement
                const textarea = parent?.querySelector('textarea')
                if (textarea) {
                    triggerRect.value = textarea.getBoundingClientRect()
                }
            }
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside, true)
            }, 0)
        } else {
            document.removeEventListener('click', handleClickOutside, true)
            triggerRect.value = null
        }
    },
)

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside, true)
})

const { t } = useI18n()

const statusFor = (user: UserSuggestion): { label: string; icon: Component } | null => {
    if (user.is_following && user.is_follower) {
        return { label: t('mentions.mutual'), icon: Users }
    }
    if (user.is_following) {
        return { label: t('mentions.following'), icon: UserCheck }
    }
    if (user.is_follower) {
        return { label: t('mentions.followsYou'), icon: UserPlus }
    }
    return null
}
</script>
