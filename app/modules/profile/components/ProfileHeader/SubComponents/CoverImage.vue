<template>
    <div class="h-[133px] sm:h-[200px] overflow-hidden bg-[#333639]">
        <NuxtLink
            v-if="coverUrl && !imageError"
            :to="`${username}/cover`"
            class="group relative block h-full w-full hover:brightness-90 transition-all duration-200"
        >
            <img
                :src="coverUrl"
                alt="Cover"
                class="h-full w-full object-cover"
                @error="handleImageError"
            />
        </NuxtLink>
        <div v-else class="h-full w-full bg-[#333639]" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'nuxt/app'

const props = defineProps<{
    coverUrl?: string | null | undefined
}>()

const imageError = ref(false)
const route = useRoute()
const username = computed(() => route.params.username as string)

const handleImageError = () => {
    imageError.value = true
}

watch(
    () => props.coverUrl,
    () => {
        imageError.value = false
    },
)
</script>
