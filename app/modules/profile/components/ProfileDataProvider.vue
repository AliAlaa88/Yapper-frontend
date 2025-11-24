<template>
    <slot v-if="!showNotFound" />
    <ProfileNotFound v-else />
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { useProfile } from '~/modules/profile/composables/useProfile'
import { useProfileStore } from '~/modules/profile/stores/profileStore'
import ProfileNotFound from './ProfileNotFound.vue'

const props = defineProps<{
    username: string
}>()

const showNotFound = ref(false)
const profileStore = useProfileStore()

const { error } = useProfile(props.username)

watch(
    error,
    (newError) => {
        if (newError && (newError as Error).message === 'User not found') {
            showNotFound.value = true
        } else {
            showNotFound.value = false
        }
    },
    { immediate: true },
)

onBeforeUnmount(() => {
    profileStore.clearProfile()
})
</script>
