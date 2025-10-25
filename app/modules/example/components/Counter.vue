<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="greeting">
        <h1>{{ message }}</h1>
        <button @click="handleClick">Click me</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    name?: string
}

const props = withDefaults(defineProps<Props>(), {
    name: 'World',
})

const message = ref(`Hello, ${props.name}!`)

const handleClick = () => {
    message.value = `Clicked! Hello, ${props.name}!`
}
</script>
