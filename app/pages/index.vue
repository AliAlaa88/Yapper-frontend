<template>
    <div>
        <h1>User</h1>
        <p>{{ data?.map((user: UserType) => user.name).join(', ') }}</p>
    </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import type { User as UserType } from '~/modules/tweets/types'
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
