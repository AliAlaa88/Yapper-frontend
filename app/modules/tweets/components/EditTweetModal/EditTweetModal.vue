<template>
    <Teleport to="body">
        <div
            v-if="isOpen"
            class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            @click.self="closeModal"
        >
            <div
                class="relative w-full h-full flex items-start justify-center overflow-y-auto py-4 sm:py-8"
            >
                <div class="relative w-full max-w-[600px] bg-primary rounded-2xl mx-4" @click.stop>
                    <!-- Header -->
                    <div class="flex items-center justify-between p-4 border-b border-primary">
                        <button
                            class="p-2 rounded-full hover:bg-hover transition-colors"
                            @click="closeModal"
                        >
                            <X :size="20" class="text-primary" />
                        </button>
                        <Button
                            id="edit-save-btn"
                            :disabled="disableSaveButton"
                            :button-class="buttonClass"
                            :button-text="$t('form.save')"
                            :loading-text="$t('messages.loading')"
                            :is-loading="isLoading"
                            @click="handleSave"
                        />
                    </div>

                    <!-- Content -->
                    <div class="p-4">
                        <div class="flex gap-3">
                            <img
                                :src="userAvatar"
                                :alt="user?.name"
                                class="w-10 h-10 rounded-full"
                            >
                            <div class="flex-1">
                                <FormattedTextarea
                                    id="edit-tweet-textarea"
                                    v-model="editedContent"
                                    :placeholder="$t('timeline.postTweet.placeholder')"
                                    :inlineborder="false"
                                    :mentions="mentions"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { FormattedTextarea } from '~/modules/TimeLine/components/postTweet/subComponents/FormattedTextarea'
import Button from '~/modules/Common/components/Button/Button.vue'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { storeToRefs } from 'pinia'

const props = defineProps<{
    isOpen: boolean
    tweetId: string
    initialContent: string
    isLoading?: boolean
    mentions?: string[]
}>()

const emit = defineEmits<{
    close: []
    save: [content: string]
}>()

const buttonClass =
    'px-4 py-2 bg-alternate text-alternate rounded-full font-bold ' +
    'hover:bg-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const editedContent = ref('')

const userAvatar = computed(
    () =>
        user.value?.avatar_url ??
        `https://ui-avatars.com/api/?name=${user.value?.name}&background=random`,
)

const disableSaveButton = computed(
    () =>
        editedContent.value.trim().length === 0 ||
        editedContent.value.trim() === props.initialContent.trim(),
)

const closeModal = () => {
    emit('close')
}

const handleSave = () => {
    if (!disableSaveButton.value) {
        emit('save', editedContent.value)
    }
}
const paresMentions = (content: string) => {
    if (props.mentions && props.mentions.length > 0) {
        const mentionRegex = /\$\((\d+)\)/gu
        return content.replace(mentionRegex, (match, p1) => {
            const index = parseInt(p1, 10)
            return props.mentions && props.mentions[index] ? '@' + props.mentions[index] : match
        })
    } else return content
}
// Initialize content when modal opens
watch(
    () => props.isOpen,
    (isOpen) => {
        if (isOpen) {
            editedContent.value = paresMentions(props.initialContent)
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
    },
    { immediate: true },
)

// Handle escape key
const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) closeModal()
}

onMounted(() => {
    document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = ''
})
</script>
