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
    <div class="w-40 btn-group-vertical btn-block">
      <button type="button" class="btn btn-md p-3 bg-white rounded-tl rounded-tr border border-neutral-700 justify-left items-left gap-2 inline-flex disabled:opacity-50 disabled:cursor-not-allowed" disabled>
        <i class="standard-step mr-1"></i>
        <span class="text-emerald-700 text-xs font-medium font-['Roboto'] leading-[14px]">Add standard step</span>
      </button>
      <button type="button" class="btn btn-md p-3 bg-white border-l border-r border border-neutral-700 justify-left items-left gap-2 inline-flex  disabled:opacity-50 disabled:cursor-not-allowed" :class="{'bg-zinc-100' : globalStore.getActiveForm === globalStore.STEP_FORM}" @click="createStep()">
        <i class="decision-step mr-1"></i>
        <span class="text-sky-700 text-xs font-medium font-['Roboto'] leading-[14px]">Add decision step</span>
      </button>
      <a type="button" class="btn btn-md p-3 bg-white rounded-bl rounded-br border border-neutral-700 justify-left items-left gap-2 inline-flex disabled:opacity-50 disabled:cursor-not-allowed" :href="route('process')">
        <i class="end-process mr-1"></i>
        <span class="text-slate-700 text-xs font-medium font-['Roboto'] leading-[14px]">End process</span>
      </a>
    </div>
  </div>
</template>

<style scoped>

</style>