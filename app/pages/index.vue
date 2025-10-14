<template>
  <div class="flex h-screen bg-black text-white">
    <!-- Left section with background image or logo -->
    <div class="hidden md:flex w-1/2 items-center justify-center relative bg-cover bg-center">
      <div class="absolute inset-0 bg-black/40"></div>
      <img src="../assets/logo-white.png"
           alt="Twitter Logo"
           class="w-1/3 relative z-10" />
    </div>

    <!-- Right section -->
    <div class="flex flex-col justify-center px-6 sm:px-10 md:px-14 w-full md:w-1/2">
      <div>
        <img
          src="../assets/logo-white.png"
          alt="Twitter logo"
          class="w-10 mb-8 md:hidden"
        />
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 leading-tight">
        Happening now</h1>
        <h2 class="text-xl sm:text-4xl font-bold mb-8">Join today.</h2>
        <div class="w-full sm:w-3/4">
          <div class="flex flex-col gap-3 w-3/4">
            <button class="flex items-center justify-center gap-2 border border-gray-600 text-black bg-white font-semibold py-2 rounded-full w-70 hover:bg-gray-200 transition">
              <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" class="w-5 h-5" />
              Sign up with Google
            </button>
          
            <button class="flex items-center justify-center gap-2 border border-gray-600 text-black bg-white font-semibold py-2 rounded-full w-70 hover:bg-gray-200 transition">
              <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" class="w-5 h-5" />
              Sign up with GitHub
            </button>
            <div class="flex items-center gap-2 text-gray-500 text-sm md:text-base my-2">
              <div class="flex-1 h-px bg-gray-600"></div>
                <span class="whitespace-nowrap">OR</span>
              <div class="flex-1 h-px bg-gray-600"></div>
            </div>

            <button class="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-full w-70">
            Create account
          </button>
          <p class="text-gray-400 text-sm">
            By signing up, you agree to the Terms of Service and Privacy Policy.
          </p>

          </div>

          <div class="mt-8">
            <h3 class="font-semibold mb-3">Already have an account?</h3>
            <button class="border border-gray-500 hover:bg-gray-800 text-white font-bold py-2 rounded-full w-70">
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
