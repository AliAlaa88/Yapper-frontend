<template>
    <div>
        <h1 class="text-primary">User</h1>
        <p class="text-primary">{{ data?.map((user: any) => user.name).join(', ') }}</p>
    </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'

definePageMeta({
    layout: 'main-layout',
})

async function getUser() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await response.json()
    return data
}

const { data, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
})
</script>
