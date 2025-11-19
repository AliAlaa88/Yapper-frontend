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
import { useProfile } from '~/modules/profile/composables/useProfile'
import { provide, computed } from 'vue'
import { useUserInfoQuery } from '~/modules/profile/queries/useUserInfoQuery'
import { useProfileStore } from '~/modules/profile/stores/profileStore'

const confirmation = useConfirmation()
provide('confirmation', confirmation)
const snackbar = useSnackbar()
provide('snackbar', snackbar)

const route = useRoute()
const username = route.params.username as string

// this should be removed when finished from user-id dependency
const { userQuery } = useUserInfoQuery(username)
const user = computed(() => userQuery.data.value)
provide(
    'user-id',
    computed(() => user.value?.user_id),
)
//
const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)
if (!profile.value) {
    useProfile(username)
}
</script>
