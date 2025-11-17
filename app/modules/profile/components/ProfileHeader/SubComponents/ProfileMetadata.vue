<template>
    <div v-if="(location || createdAt) && !isBlocked" class="mt-3 flex flex-wrap gap-3 text-[15px] text-muted">
        <!-- Location -->
        <div v-if="location" class="flex items-center gap-1">
            <MapPin :size="18" class="text-muted" />
            <span>{{ location }}</span>
        </div>

        <!-- Joined Date -->
        <div v-if="createdAt" class="flex items-center gap-1">
            <Calendar :size="18" class="text-muted" />
            <span>{{ $t('profile.joinDate') }} {{ formatDate(createdAt) }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { MapPin, Calendar } from 'lucide-vue-next'
import { useUserInfo } from '~/modules/profile/composables/useUserInfo'
import { inject } from 'vue'

defineProps<{
    location?: string | null
    createdAt?: string
}>()

const userId = inject<Ref<string>>('user-id')!
const { isBlocked } = useUserInfo(userId)

const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}
</script>
