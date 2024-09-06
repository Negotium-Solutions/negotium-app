<script setup>
  const props = defineProps({
    value: '',
    disabled: false
  })
</script>

<template>
  <button class="px-4 py-2 rounded-custom-25 border justify-center items-center text-white" :class="props.disabled ? 'bg-neutral-500 border-neutral-500' : 'bg-neutral-700 border-neutral-700'" :disabled="props.disabled">
    {{ props.value }}
  </button>
</template>