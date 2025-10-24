<template>
    <div>
        <!-- Background: Profile Content (faded) -->
        <ProfileContent />

        <!-- Foreground: Cover Modal -->
        <CoverModal />
    </div>
</template>

<script setup lang="ts">
import CoverModal from '~/modules/profile/components/ProfilePhoto/CoverModal.vue'
import ProfileContent from '~/modules/profile/components/ProfileContent/ProfileContent.vue'

definePageMeta({ layout: 'profile' })
</script>
