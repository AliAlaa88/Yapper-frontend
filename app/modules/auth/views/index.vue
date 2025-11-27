<template>
    <div class="min-h-svh grid grid-cols-1 md:grid-cols-2 bg-primary text-primary">
        <!-- Left section (hidden on mobile) -->
        <div class="hidden md:flex items-center justify-center relative bg-cover bg-center">
            <Logo imgClass="relative z-10 w-32 lg:w-40" />
        </div>

        <!-- Right section -->
        <div class="flex items-center justify-center p-6 sm:p-10">
            <div class="w-full max-w-md">
                <Logo imgClass="w-10 mb-8 md:hidden" />
                <h1
                    class="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-primary"
                >
                    {{ $t('auth.home.happeningNow') }}
                </h1>
                <h2 class="text-2xl sm:text-3xl font-bold mb-8 text-primary">{{ $t('auth.home.joinToday') }}</h2>

                <div class="flex flex-col gap-3 max-w-90">
                    <OAuth />

                    <div class="flex items-center gap-2 text-primary text-sm my-2">
                        <div class="flex-1 h-px bg-gray-700" />
                        <span class="whitespace-nowrap">{{ $t('auth.common.or') }}</span>
                        <div class="flex-1 h-px bg-gray-700" />
                    </div>

                    <button
                        data-testid="button-createAccount-authHome"
                        class="bg-alternate hover:bg-hover-alternate text-alternate font-semibold cursor-pointer rounded-full py-2 transition mb-3 duration-200 w-full"
                        @click="goToSignup"
                    >
                        {{ $t('auth.common.createAccount') }}
                    </button>
                    <p class="text-primary text-xs leading-relaxed">
                        {{ $t('auth.home.terms') }}
                    </p>
                    <div class="mt-10">
                        <h3 class=" font-semibold mb-3 text-primary">{{ $t('auth.home.alreadyHaveAccount') }}</h3>
                        <button
                            data-testid="button-signIn-authHome"
                            class="cursor-pointer border border-alternate hover:bg-hover hover:border-blue text-primary font-bold py-2.5 rounded-full w-full"
                            @click="goToLogin"
                        >
                            {{ $t('auth.common.signIn') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <slot />
    </div>
</template>

<script lang="ts" setup>
import Logo from '~/modules/Common/components/Logo'
import OAuth from '../components/subComponents/OAuth.vue'
import { useRouter } from 'vue-router'
import { isLoggedIn } from '~/utils/helpers'
const router = useRouter()

const goToLogin = () => {
    router.push('/auth/login')
}

const goToSignup = () => {
    router.push('/auth/signup')
}
</script>
