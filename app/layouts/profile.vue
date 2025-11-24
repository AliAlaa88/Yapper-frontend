<template>
    <MainLayout>
        <ProfileNotFound v-if="showNotFound" />
        <template v-else>
            <ProfileHeader />
            <NuxtPage :key="username" />
        </template>

        <SnackBar />
        <ConfirmtionModal />
    </MainLayout>
</template>

<script setup lang="ts">
import ProfileHeader from '../modules/profile/components/ProfileHeader/ProfileHeader.vue'
import ProfileNotFound from '../modules/profile/components/ProfileNotFound.vue'
import SnackBar from '../modules/profile/components/ProfileContent/SubComponents/SnackBar.vue'
import ConfirmtionModal from '~/modules/profile/components/ProfileHeader/SubComponents/ConfirmtionModal.vue'
import { useProfile } from '~/modules/profile/composables/useProfile'
import { useProfileStore } from '~/modules/profile/stores/profileStore'
import { useProfileProviders } from '~/modules/profile/composables/useProfileProviders'
import { watch, ref } from 'vue'
import MainLayout from './main-layout.vue'

useProfileProviders()

const route = useRoute()
const username = computed(() => route.params.username as string)
const showNotFound = ref(false)

const profileStore = useProfileStore()

const { error } = useProfile(username)

watch(
    username,
    (newUsername) => {
        if (newUsername) {
            profileStore.clearProfile()
            showNotFound.value = false
        }
    },
    { immediate: true },
)

watch(error, (newError) => {
    if (newError && (newError as Error).message === 'User not found') {
        showNotFound.value = true
    }
}, { immediate: true })
</script>
