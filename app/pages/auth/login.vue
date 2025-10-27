<template>
  <AuthLayout>
    <SignInModal @close="goBack" @switch="goToSignup" @finish="goBack" />
  </AuthLayout>
</template>

<script lang="ts" setup>
import SignInModal from "../../modules/auth/components/login.vue";
import AuthLayout from "../../modules/auth/views/index.vue";

const router = useRouter();

const goBack = () => {
  router.push("/auth");
};

const goToSignup = () => {
  router.push("/auth/signup");
};
</script>
