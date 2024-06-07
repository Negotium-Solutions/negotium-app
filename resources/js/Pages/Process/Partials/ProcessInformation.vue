<script setup>
import {useGlobalsStore, useStepsStore} from "@/stores";

const stepStore = useStepsStore();
const globalsStore = useGlobalsStore();

const props = defineProps({
  process: {},
  step_id: 0
});

function setStep(step) {
  stepStore.setStep(step);
  globalsStore.activeForm = globalsStore.STEP_INFORMATION;
}
</script>

<template>
  <div class="col-md-3 col-sm-12 pr-0">
    <div class="card card-default">
      <div class="card-header">
        <h3 class="card-title text-bold">Process Information</h3>
      </div>
      <!-- /.card-header -->
      <div class="card-body">
        <div class="mb-2">
          <label for="step-name" class="font-weight-normal mb-0 gray"><small>Process name</small></label>
          <p class="font-weight-bold mt-0">{{ props.process.name }}</p>
        </div>
        <div class="mb-1">
          <label for="step-name" class="font-weight-normal mb-0 gray"><small>Category</small></label>
          <p class="font-weight-bold mt-0">{{ props.process.category.name }}</p>
        </div>
        <div class="mt-3">
          <hr/>
        </div>
        <div class="mt-3">
          <label for="steps" class="font-weight-normal mb-0 gray"><small>Process Steps</small></label>
        </div>
        <div>
          <button type="button" @click="setStep(step)" v-for="(step, index) in props.process.steps" :key="index" class="btn btn-sm btn-outline-dark w-100 m-1"  :class="{ active : stepStore.step.id === step.id }">
            {{ step.name }}
          </button>
        </div>
      </div>
      <!-- /.card-body -->
    </div>
  </div>
</template>