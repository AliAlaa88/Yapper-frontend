<template>
    <button
        class="flex h-9 w-9 items-center justify-center rounded-full border border-[#536471] transition hover:bg-[#181818]"
        @click="goToMessages"
    >
        <Mail :size="18" class="text-primary" />
    </button>
</template>

<script setup lang="ts">
import { Mail } from 'lucide-vue-next'

const router = useRouter()

function goToMessages() {
    router.push('/messages')
}
</script>
