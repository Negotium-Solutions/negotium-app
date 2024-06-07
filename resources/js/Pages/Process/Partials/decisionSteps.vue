<script setup>

</script>

<template>
  <div class="col-md-2 col-sm-12 md:mt-7 md:pt-12 pl-0">
    <div class="btn-group-vertical btn-block">
      <button type="button" class="btn btn-md btn-outline-secondary text-left"><i class="pi pi-delete-left pr-2"></i> Add standard step</button>
      <button type="button" class="btn btn-md btn-outline-secondary text-left" @click=""><i class="pi pi-address-book pr-2"></i> Add decision step</button>
      <a type="button" class="btn btn-md btn-outline-secondary text-left" :href="route('process')"><i class="pi pi-flag pr-2"></i> End process</a>
    </div>
  </div>
</template>

<style scoped>

</style>