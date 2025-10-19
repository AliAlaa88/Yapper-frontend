<template>
    <div>
        <!-- Background: Profile Content (faded) -->
        <ProfileContent />

        <!-- Foreground: Photo Modal -->
        <PhotoModal />
    </div>
</template>

<script setup lang="ts">
import PhotoModal from '~/modules/profile/components/ProfilePhoto/PhotoModal.vue'
import ProfileContent from '~/modules/profile/components/ProfileContent/ProfileContent.vue'

definePageMeta({ layout: 'profile' })
</script>
