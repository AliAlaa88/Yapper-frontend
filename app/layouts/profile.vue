<template>
    <div class="bg-black">
        <!-- Profile Header (Fixed) -->
        <ProfileHeader />

        <!-- Page Content (NuxtPage for child routes) -->
        <NuxtPage />
    </div>
</template>

<script setup lang="ts">
import ProfileHeader from '../modules/profile/components/ProfileHeader/ProfileHeader.vue'
</script>
