<template>
<forgetPassword @finish="onFinish"/>
</template>

<script setup lang="ts">
import forgetPassword from '../../modules/auth/components/forgetPassword.vue'

const onFinish = () => {
    navigateTo('/auth/login');
}
</script>