<script setup>
import { useGlobalsStore, useStepsStore, useActivitiesStore } from "@/stores";
import { onMounted } from "vue";

const stepStore = useStepsStore();
const globalsStore = useGlobalsStore();
const activityStore = useActivitiesStore();

const props = defineProps({
  process: {},
  step_id: 0
});

onMounted(() => {
  // stepStore.setStep(props.processes.steps[0]); TODO: Fix this to select default step
});

function setStep(step) {
  stepStore.setStep(step);
  activityStore.setActivities(step.activities);
  globalsStore.activeForm = globalsStore.ACTIVITY_FORM;
}
</script>

<template>
  <div class="col-lg-2 col-md-3 col-sm-12 pr-0">
    <div class="card card-default">
      <div class="card-header border-bottom-0 pb-0">
        <div class="text-neutral-700 text-[1.25rem] font-bold font-['Roboto'] leading-loose">Process Info</div>
      </div>
      <!-- /.card-header -->
      <div class="card-body">
        <div class="mb-2">
          <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Process name</div>
          <p class="mt-1 text-neutral-700 text-sm font-medium font-['Roboto'] leading-tight">{{ props.process.name }}</p>
        </div>
        <div class="mb-1">
          <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Category</div>
          <p class="mt-1 text-neutral-700 text-sm font-medium font-['Roboto'] leading-tight">{{ props.process.category.name }}</p>
        </div>
        <div class="mt-3">
          <div class="h-0.5 opacity-10 bg-neutral-700 rounded-[1px]"></div>
        </div>
        <div class="mt-3 mb-2">
          <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Process Steps</div>
        </div>
        <div>
          <button type="button" @click="setStep(step)" v-for="(step, index) in props.process.steps" :key="index" class="w-100 h-9 p-2 rounded border border-neutral-700/opacity-25 flex-col justify-start items-start gap-2 inline-flex mb-1"  :class="{ 'bg-zinc-100' : stepStore.step.id === step.id }">
            <div :class="stepStore.step.id === step.id ? 'font-semibold' : 'font-medium'" class="text-neutral-700 text-sm font-['Roboto'] leading-tight" >{{ step.name }}</div>
          </button>
        </div>
      </div>
      <!-- /.card-body -->
    </div>
  </div>
</template>