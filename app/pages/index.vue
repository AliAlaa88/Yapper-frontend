<template>
    <div class="flex flex-col gap-4">
        <h1 class="text-primary">User</h1>
        <p class="text-primary">{{ data?.map((user: any) => user.name).join(', ') }}</p>
        <Tabs :tabs="tabs" :activeTab="activeTab" @change="handleChange" />
    </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import Tabs from '../modules/Common/components/Tabs'

definePageMeta({
    layout: 'main-layout',
})

async function getUser() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await response.json()
    return data
}

const tabs = [
    {
        label: 'User',
        value: 'user',
    },
    {
        label: 'Post',
        value: 'post',
    },
]

const activeTab = ref('user')

function handleChange(tab: string) {
    activeTab.value = tab
}

const { data, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
})
</script>
