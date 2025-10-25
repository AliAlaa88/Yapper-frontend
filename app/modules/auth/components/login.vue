<template>
  <loginStep1 v-if="showStep1" @next="onNext" @close="$emit('close')" @switch="$emit('switch')" />
  <loginStep2 v-if="showStep2" :identifier="identifier" :type="type" @finish="$emit('finish')" @close="$emit('close')" @switch="$emit('switch')" />
</template>

<script setup lang="ts">
import loginStep1 from "./subComponents/loginComponents/loginStep1.vue";
import loginStep2 from "./subComponents/loginComponents/loginStep2.vue";
import { ref } from "vue";
const showStep2 = ref(false);
const showStep1 = ref(true);
const identifier = ref('');
const type=ref('');
const onNext = (Identifier: string, Type: string) => {
  showStep2.value = true;
  showStep1.value = false;
  identifier.value = Identifier;
  type.value = Type;
};

</script>