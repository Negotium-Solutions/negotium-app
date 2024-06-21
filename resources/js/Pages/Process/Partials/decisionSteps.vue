<script setup>
import { useGlobalsStore, useStepsStore } from '@/stores';

const globalStore = useGlobalsStore();
const stepStore = useStepsStore();

function createStep() {
  globalStore.setActiveForm(globalStore.STEP_FORM);
  stepStore.resetStep();
}
</script>

<template>
  <div class="col-md-2 col-sm-12 md:mt-5 md:pt-4 pl-0">
    <div class="btn-group-vertical btn-block">
      <button type="button" class="btn btn-md btn-outline-secondary text-left" disabled><i class="pi pi-delete-left pr-2"></i> Add standard step</button>
      <button type="button" class="btn btn-md btn-outline-secondary text-left" :class="{'active' : globalStore.getActiveForm === globalStore.STEP_FORM}" @click="createStep()"><i class="pi pi-address-book pr-2"></i> Add decision step</button>
      <a type="button" class="btn btn-md btn-outline-secondary text-left" :href="route('process')"><i class="pi pi-flag pr-2"></i> End process</a>
    </div>
  </div>
</template>

<style scoped>

</style>