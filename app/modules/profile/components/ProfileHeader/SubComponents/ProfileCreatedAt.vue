<template>
    <p
        v-if="createdAt && !isBlocked"
        class="mt-3 text-[15px] leading-6 text-white">{{ createdAt }}</p>
</template>

<script setup lang="ts">
import { useUserInfo } from '~/modules/profile/composables/useUserInfo'

defineProps<{
    createdAt?: string
}>()

const userId = inject<Ref<string>>('user-id')!
const {
    isBlocked,
} = useUserInfo(userId)

</script>
