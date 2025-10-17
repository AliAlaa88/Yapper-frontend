<template>
    <div>
        <h1>User</h1>
        <p>{{ data?.map((user: any) => user.name).join(', ') }}</p>
    </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'

async function getUser() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await response.json()
    return data
}

const { data } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
})
</script>
