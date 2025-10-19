<template>
    <div class="min-h-screen flex items-center justify-center bg-black text-white">
        <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">Welcome to Yapper</h1>
            <p class="text-gray-400 mb-6">Redirecting to authentication...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
const router = useRouter();

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
