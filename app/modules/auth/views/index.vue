<template>
  <div class="min-h-svh grid grid-cols-1 md:grid-cols-2 bg-black text-white">
    <!-- Left section (hidden on mobile) -->
    <div class="hidden md:flex items-center justify-center relative bg-cover bg-center">
      <logo imgClass="relative z-10 w-32 lg:w-40" />
    </div>

    <!-- Right section -->
    <div class="flex items-center justify-center p-6 sm:p-10">
      <div class="w-full max-w-md">
        <logo imgClass="w-10 mb-8 md:hidden" />
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">Happening now</h1>
        <h2 class="text-2xl sm:text-3xl font-bold mb-8">Join today.</h2>

        <div class="flex flex-col gap-3 max-w-90">
          <OAuth />

          <div class="flex items-center gap-2 text-gray-500 text-sm my-2">
            <div class="flex-1 h-px bg-gray-700" />
            <span class="whitespace-nowrap">OR</span>
            <div class="flex-1 h-px bg-gray-700" />
          </div>

          <button class="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-full w-full" @click="goToSignup">
            Create account
          </button>
          <p class="text-gray-400 text-xs leading-relaxed">
            By signing up, you agree to the Terms of Service and Privacy Policy.
          </p>
          <div class="mt-10">
            <h3 class="font-semibold mb-3">Already have an account?</h3>
            <button class="border border-gray-600 hover:bg-gray-800 text-white font-bold py-2.5 rounded-full w-full" @click="goToLogin">
            Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import logo from "../components/subComponents/logo.vue";
import OAuth from "../components/subComponents/OAuth.vue";
const router = useRouter();

const goToLogin = () => {
  router.push("/auth/login");
};

const goToSignup = () => {
  router.push("/auth/signup");
};

</script>
