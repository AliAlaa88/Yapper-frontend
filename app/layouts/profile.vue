<template>
    <MainLayout>
        <ProfileDataProvider :key="username" :username="username">
            <ProfileHeader />
            <NuxtPage :key="username" />
        </ProfileDataProvider>

        <SnackBar />
        <ConfirmtionModal />
    </MainLayout>
</template>

<script setup lang="ts">
import ProfileHeader from '../modules/profile/components/ProfileHeader/ProfileHeader.vue'
import ProfileDataProvider from '../modules/profile/components/ProfileDataProvider.vue'
import SnackBar from '../modules/profile/components/ProfileContent/SubComponents/SnackBar.vue'
import ConfirmtionModal from '~/modules/profile/components/ProfileHeader/SubComponents/ConfirmtionModal.vue'
import { useProfileProviders } from '~/modules/profile/composables/useProfileProviders'
import MainLayout from './main-layout.vue'

useProfileProviders()

const route = useRoute()
const username = computed(() => route.params.username as string)
</script>
