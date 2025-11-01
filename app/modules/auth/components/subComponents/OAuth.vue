<template>
    <div class="flex flex-col gap-3">
        <button
            id="button-google-oauth"
            class="flex items-center justify-center gap-2 border border-gray-600 text-black bg-white font-semibold py-2.5 rounded-full w-full hover:bg-gray-200 transition"
            @click="googleSignUp"
        >
            <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                class="w-5 h-5"
            />
            Sign up with Google
        </button>

        <button
            id="button-github-oauth"
            class="flex items-center justify-center gap-2 border border-gray-600 text-black bg-white font-semibold py-2.5 rounded-full w-full hover:bg-gray-200 transition"
            @click="githubSignUp"
        >
            <img
                src="https://www.svgrepo.com/show/512317/github-142.svg"
                alt="GitHub"
                class="w-5 h-5"
            />
            Sign up with GitHub
        </button>
    </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

function googleSignUp() {
    window.location.href = `${config.public.apiUrl}/auth/google`
}

function githubSignUp() {
    window.location.href = `${config.public.apiUrl}/auth/github`
}
</script>
