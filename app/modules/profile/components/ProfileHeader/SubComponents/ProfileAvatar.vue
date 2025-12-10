<template>
    <div class="relative">
        <NuxtLink
            v-if="avatarUrl && !imageError"
            :to="`${username}/photo`"
            class="group relative block h-[85px] w-[85px] sm:h-[133px] sm:w-[133px] rounded-full border-4 border-black bg-black hover:brightness-90 transition-all duration-200"
        >
            <img
                :src="avatarUrl"
                :alt="displayName"
                class="h-full w-full rounded-full object-cover"
                @error="handleImageError"
            />
        </NuxtLink>

        <img
            v-else
            :src="`https://ui-avatars.com/api/?name=${displayName}`"
            :alt="displayName"
            class="flex h-[85px] w-[85px] sm:h-[133px] sm:w-[133px] items-center justify-center rounded-full border-4 border-black bg-[#71767b] text-3xl sm:text-5xl font-bold text-white"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'nuxt/app'

const props = defineProps<{
    avatarUrl?: string
    displayName: string
}>()

const imageError = ref(false)
const route = useRoute()
const username = computed(() => route.params.username as string)

const handleImageError = () => {
    imageError.value = true
}

watch(() => props.avatarUrl, () => {
    imageError.value = false
})
</script>
