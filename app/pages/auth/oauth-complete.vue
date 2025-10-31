<template>
    <OAuthComplete :oauth_session_token="Oauth_session_token" />
</template>

<script setup lang="ts">
import OAuthComplete from '~/modules/auth/components/OAuthComplete.vue';
import { ref } from 'vue';

const urlParams = new URLSearchParams(window.location.search);
const Oauth_session_token = ref(urlParams.get('session') || '');

</script>