<template>
  <AuthLayout>
    <CreateAccount @close="goBack" @finish="onSignupFinish" />
  </AuthLayout>
</template>

<script lang="ts" setup>
import CreateAccount from "../../modules/auth/components/createAccount.vue";
import AuthLayout from "../../modules/auth/views/index.vue";

const router = useRouter();

const goBack = () => {
  router.push("/auth");
};

const onSignupFinish = () => {
  // Signup complete, redirect back to auth or home
  router.push("/auth");
};
</script>
