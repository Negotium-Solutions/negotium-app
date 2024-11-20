<script setup>
import { ref, computed } from 'vue';

const inputValue = ref(0); // Default value
const integerValue = computed(() => parseInt(inputValue) || 0);
</script>

<template>
  <div class="w-100 mt-2">
    <input
        type="number"
        class="form-control"
        v-model="inputValue"
    >
  </div>
</template>