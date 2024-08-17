<script setup>
  const props = defineProps({
    value: '',
    disabled: false
  })
</script>

<template>
  <button class="px-4 py-2 rounded-custom-25 border border-neutral-700 justify-center items-center text-white bg-neutral-700" :class="{ 'bg-neutral-500 border-neutral-500' : props.disabled }" :disabled="props.disabled">
    {{ props.value }}
  </button>
</template>