<template>
    <div class="bg-black">
        <ProfileHeader />

        <NuxtPage :key="username" />

        <SnackBar />
        <ConfirmtionModal />
    </div>
</template>

<script setup lang="ts">
import ProfileHeader from '../modules/profile/components/ProfileHeader/ProfileHeader.vue'
import SnackBar from '../modules/profile/components/ProfileContent/SubComponents/SnackBar.vue'
import ConfirmtionModal from '~/modules/profile/components/ProfileHeader/SubComponents/ConfirmtionModal.vue'
import { useProfile } from '~/modules/profile/composables/useProfile'
import { useProfileStore } from '~/modules/profile/stores/profileStore'
import { useProfileProviders } from '~/modules/profile/composables/useProfileProviders'
import { watch } from 'vue'

useProfileProviders()

const route = useRoute()
const username = computed(() => route.params.username as string)

const profileStore = useProfileStore()

watch(
    username,
    (newUsername) => {
        if (newUsername) {
            profileStore.clearProfile()
            useProfile(newUsername)
        }
    },
    { immediate: true },
)
</script>
