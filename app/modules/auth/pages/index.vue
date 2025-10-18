<template>
  <div class="min-h-svh grid grid-cols-1 md:grid-cols-2 bg-black text-white">
    <!-- Left section (hidden on mobile) -->
    <div class="hidden md:flex items-center justify-center relative bg-cover bg-center">
      <div class="absolute inset-0 bg-black/40" />
      <img
        src="../assets/logo-white.png"
        alt="X Logo"
        class="relative z-10 w-32 lg:w-40"
      />
    </div>

    <!-- Right section -->
    <div class="flex items-center justify-center p-6 sm:p-10">
      <div class="w-full max-w-md">
        <img
          src="../assets/logo-white.png"
          alt="X Logo"
          class="w-10 mb-8 md:hidden"
        />
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">Happening now</h1>
        <h2 class="text-2xl sm:text-3xl font-bold mb-8">Join today.</h2>

        <div class="flex flex-col gap-3 max-w-90">
          <button class="flex items-center justify-center gap-2 border border-gray-600 text-black bg-white font-semibold py-2.5 rounded-full w-full hover:bg-gray-200 transition">
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" class="w-5 h-5" />
            Sign up with Google
          </button>

          <button class="flex items-center justify-center gap-2 border border-gray-600 text-black bg-white font-semibold py-2.5 rounded-full w-full hover:bg-gray-200 transition">
            <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" class="w-5 h-5" />
            Sign up with GitHub
          </button>

          <div class="flex items-center gap-2 text-gray-500 text-sm my-2">
            <div class="flex-1 h-px bg-gray-700" />
            <span class="whitespace-nowrap">OR</span>
            <div class="flex-1 h-px bg-gray-700" />
          </div>

          <button class="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-full w-full" @click="openCreateAccountModal">
            Create account
          </button>
          <p class="text-gray-400 text-xs leading-relaxed">
            By signing up, you agree to the Terms of Service and Privacy Policy.
          </p>
          <div class="mt-10">
            <h3 class="font-semibold mb-3">Already have an account?</h3>
            <button class="border border-gray-600 hover:bg-gray-800 text-white font-bold py-2.5 rounded-full w-full" @click="openSignInModal">
            Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
    <SignInModal v-if="showSignInModal" @close="closeSignInModal" @switch="openCreateAccountModal" />
    <CreateAccount v-if="createAccountModal" @close="closeCreateAccountModal" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import SignInModal from "../shared/components/login.vue";
import CreateAccount from "../shared/components/createAccount.vue";

const showSignInModal = ref(false);
const createAccountModal = ref(false);

const openSignInModal = () => {
  closeCreateAccountModal();
  showSignInModal.value = true;
};

const closeSignInModal = () => {
  showSignInModal.value = false;
};

const openCreateAccountModal = () => {
  closeSignInModal();
  createAccountModal.value = true;
};

const closeCreateAccountModal = () => {
  createAccountModal.value = false;
};

</script>
