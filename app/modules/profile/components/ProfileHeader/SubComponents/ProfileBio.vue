<template>
    <p v-if="bio && !isBlocked" class="mt-3 text-[15px] leading-6 text-primary">{{ bio }}</p>
</template>

<script setup lang="ts">
import { useUserInfo } from '~/modules/profile/composables/useUserInfo'
import { inject } from 'vue'

defineProps<{
    bio?: string
}>()

const userId = inject<Ref<string>>('user-id')!
const { isBlocked } = useUserInfo(userId)
</script>
