<template>
    <div class="border-b border-primary">
        <!-- Collapsed state - simple input placeholder -->
        <div v-if="!isFocused" class="flex items-center gap-3 p-4 cursor-text" @click="handleFocus">
            <img
                v-if="user?.avatar_url"
                :src="user.avatar_url"
                :alt="user.name"
                class="w-10 h-10 object-cover rounded-full"
            />
            <img
                v-else
                :src="`https://ui-avatars.com/api/?name=${user?.name}&background=random`"
                :alt="user?.name"
                class="w-10 h-10 object-cover rounded-full"
            />
            <span class="text-secondary text-lg flex-1">
                {{ $t('timeline.postTweet.replyPlaceholder') }}
            </span>
            <Button
                id="reply-tweet-reply-btn"
                :disabled="true"
                button-class="px-4 py-2 bg-alternate text-alternate rounded-full font-bold hover:bg-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :button-text="t('timeline.postTweet.reply')"
            />
        </div>

        <!-- Expanded state - full PostTweet component -->
        <div v-else @click.stop>
            <PostTweet
                :border="false"
                :parent-tweet-id="props.parentTweetId"
                :replying-to-username="props.replyingToUsername"
                :inlineborder="false"
                @success="handleSuccess"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { useI18n } from 'vue-i18n'
import PostTweet from '~/modules/TimeLine/components/postTweet'
import Button from '~/modules/Common/components/Button/Button.vue'

const { t } = useI18n()

const props = defineProps<{
    parentTweetId: string
    replyingToUsername: string
}>()

const emit = defineEmits<{
    (e: 'success'): void
}>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isFocused = ref(false)

const handleFocus = () => {
    isFocused.value = true
}

// Expose focus method for parent components
defineExpose({
    focus: handleFocus,
})

const handleSuccess = () => {
    isFocused.value = false
    emit('success')
}
</script>
