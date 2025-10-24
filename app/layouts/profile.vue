<template>
    <div class="bg-black">
        <!-- Profile Header (Fixed) -->
        <ProfileHeader />

        <!-- Page Content (NuxtPage for child routes) -->
        <NuxtPage />

        <!-- SnackBar-->
        <SnackBar />
        <ConfirmtionModal />
    </div>
</template>

<script setup lang="ts">
import ProfileHeader from '../modules/profile/components/ProfileHeader/ProfileHeader.vue'
import SnackBar from '../modules/profile/components/ProfileContent/SubComponents/SnackBar.vue'
import { useSnackbar } from '../modules/profile/composables/useSnackbar'
import ConfirmtionModal from '~/modules/profile/components/ProfileHeader/SubComponents/ConfirmtionModal.vue'
import { useConfirmation } from '~/modules/profile/composables/useConfirmation'
import { useUserInfoQuery } from '~/modules/profile/queries/useUserInfoQuery'

const confirmation = useConfirmation()
provide('confirmation', confirmation)
const snackbar = useSnackbar()
provide('snackbar', snackbar)

const route = useRoute()
const username = route.params.username as string

const userQuery = useUserInfoQuery(username)
const user = computed(() => userQuery.data.value)
provide('user-id', computed(() => user.value?.id))

</script>
