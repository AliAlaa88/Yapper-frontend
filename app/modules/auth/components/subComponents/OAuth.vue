<template>
    <div class="flex flex-col gap-3">
        <button
            id="button-google-oauth"
            class="cursor-pointer flex items-center justify-center gap-2 bg-alternate border-2 border-alternate text-alternate hover:bg-hover hover:text-primary hover:border-blue font-semibold py-2.5 rounded-full w-full transition duration-200 shadow-sm"
            @click="googleSignUp"
        >
            <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                class="w-5 h-5"
            />
            {{ $t('auth.OAuth.continueWithGoogle') }}
        </button>

        <button
            id="button-github-oauth"
            class="button-hover-invert cursor-pointer flex items-center justify-center gap-2 bg-alternate border-2 border-alternate text-alternate hover:bg-hover hover:text-primary hover:border-blue font-semibold py-2.5 rounded-full w-full transition duration-200 shadow-sm"
            @click="githubSignUp"
        >
            <img
                src="https://www.svgrepo.com/show/512317/github-142.svg"
                alt="GitHub"
                class="w-5 h-5 github-icon"
            />
            {{ $t('auth.OAuth.continueWithGithub') }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from '#app'
const config = useRuntimeConfig()

function googleSignUp() {
    window.location.href = `${config.public.apiUrl}/auth/google`
}

function githubSignUp() {
    window.location.href = `${config.public.apiUrl}/auth/github`
}
</script>
