<template>
    <div>
        <!-- Background: Profile Content (faded) -->
        <ProfileContent />

        <!-- Foreground: Edit Profile Modal -->
        <EditProfile />
    </div>
</template>

<script setup lang="ts">
import EditProfile from '~/modules/profile/components/EditProfile/EditProfile.vue'
import ProfileContent from '~/modules/profile/components/ProfileContent/ProfileContent.vue'

definePageMeta({
    layout: 'profile',
    middleware: ['auth'],
})
</script>
