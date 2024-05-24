<script setup>
import { ref } from "vue";
import Breadcrumb from "primevue/breadcrumb";
import Button from "primevue/button";

const home = ref({ label: 'Home' });

const props = defineProps({
  name: String,
  items: Array,
  buttons: []
});
</script>
<template>
  <div class="card justify-content-left">
    <div class="flex justify-content-between flex-wrap pt-3">
      <div class="heading flex align-items-center justify-content-center">{{ name }}</div>
      <div class="flex align-items-center justify-content-center">
        <a v-for="(button, index) in props.buttons" :href="button.href">
          <Button :label="button.label" :severity="button.severity" class="mr-2" :key="index" raised></Button>
        </a>
      </div>
    </div>
    <Breadcrumb :home="home" :model="items" class="pt-0">
      <template #item="{ item }">
        <a class="cursor-pointer" :href="item.url">
          <span class="text-primary font-semibold">{{ item.label }}</span>
        </a>
      </template>
      <template v-if="items.length > 0" #separator> <i class="pi pi-arrow-right"></i> </template>
    </Breadcrumb>
  </div>
</template>
<style>
  .heading {
    padding-left: 15px;
    font-family: Roboto;
    font-size: 36px;
    font-weight: 700;
    line-height: 44px;
  }

  .breadcrumbs {
    pading-top: 0px;
  }
</style>