<template>
    <div class="bg-black">
        <!-- Profile Header (Fixed) -->
        <ProfileHeader />

        <!-- Page Content (NuxtPage for child routes) -->
        <NuxtPage />
    </div>
</template>

<script setup lang="ts">
// import type { UserProfile } from '../modules/profile/types/user'
import ProfileHeader from '../modules/profile/components/ProfileHeader/ProfileHeader.vue'

// // TODO: This should come from API
// const mockUser: UserProfile = {
//     id: '1',
//     username: 'mock_user',
//     displayName: 'Mock User',
//     bio: 'This is a mock user.',
//     followersCount: 1234,
//     followingCount: 567,
//     verified: true,
// }
</script>
