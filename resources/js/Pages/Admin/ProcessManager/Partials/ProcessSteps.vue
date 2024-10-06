<script setup>
import Button from "primevue/button";
import { onMounted, reactive } from "vue";
import { useProcessManagerStore } from "@/stores";

const processManagerStore = useProcessManagerStore();

const props = defineProps({
  process: null,
  steps: null,
  step: null
});

let counter = 0

const pageProps = reactive({
  activeIndex: 0,
  visibleSteps: [],
  firstSteps:[],
  shoAddStep: false,
});

onMounted(() => {
  setActiveStep();
  
});


function setActiveStep()
{
  props.steps.forEach((step, index) => {
  if (step.id === props.step.id) {
    let stepsLength = props.process.steps.length;
    
    // Always add the current step
    pageProps.visibleSteps.push(step.id);  
    
    // Show only 2 steps if index is 0
    if (index === 0 && index + 1 <= (stepsLength - 1)) {
      pageProps.firstSteps.push(props.steps[0].id)
      pageProps.firstSteps.push(props.steps[index + 1].id)
      pageProps.visibleSteps.push(props.steps[index + 1].id);  // Add only the next step
    }

    // Add previous step if not the first step
    if (index > 0) {
      pageProps.visibleSteps.push(props.steps[index - 1].id);
    }

    // Add next step if not the last step
    if (index < (stepsLength - 1)) {
      pageProps.visibleSteps.push(props.steps[index + 1].id);
    }

    // If the current step is the last one, show option to add a step
    if (index === (stepsLength - 1)) {
      pageProps.shoAddStep = true;  // Ensure showAddStep is correctly named
    }
  }
  console.log(pageProps.visibleSteps)
});

let process1 = document.getElementById('process-1');


if (parseInt(props.step.id) === parseInt(props.steps[0].id)) {
  // Modify process1 element if it exists
  if (process1) {
    process1.classList.remove('col-md-12', 'col-lg-12');
    process1.classList.add('col-md-9', 'col-lg-9', 'offset-md-3', 'offset-lg-3');
  }
}
}

function navigate(process_id, step_id) {
  window.location.href = route('process-manager.edit-activity', [process_id, step_id]);
}

function isActiveStep(step) {
  return step.id === props.step.id;
}

function isHrVisible(step){
  return false
}
</script>

<template>
  <div class="row">

    <template v-for="(step, index) in props.steps" :key="index">
      <div @click="!isActiveStep(step) ? navigate(props.process.id, step.id) : ''" :class="pageProps.firstSteps.includes(step.id) && pageProps.visibleSteps.includes(step.id) ? 'col-md-5 col-lg-5' : 'col-md-4 col-lg-4'" class="cursor-pointer step-nav" v-if="pageProps.visibleSteps.includes(step.id)">
        <div class="row">

          <div class="col-md-2 pl-0 pr-0">
            <hr class="mt-7 my-step-hr" style="border-color: rgb(67, 170, 139);" :style="isHrVisible(step) ? 'opacity:0;':'width:90px'">
          </div>

          <div class="col-md-10 pl-0 pr-0" >
            <div class="card card-default" :class="isActiveStep(step) ? 'bg-white' : 'opacity-75'">
              <div class="card-header border-bottom-0 pb-0">
                <div class="text-neutral-700 text-[1.25rem] font-bold font-['Roboto'] leading-loose">{{ step.name }}</div>
              </div>
              <!-- /.card-header -->
              <div class="card-body">
                <div v-if="!(step.id > 0)" class="mb-3">
                  <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Step name</div>
                  <input v-model="step.name" type="text" class="mt-2 form-control form-control-md form-control-custom" id="process-name" placeholder="What do you want to call this process?">
                  <div class="input-validation-error" v-if="typeof processManagerStore.stepErrors?.name !== 'undefined'">
                    <span v-for="(error, index) in processManagerStore.stepErrors?.name" :key="index" class="error invalid-feedback">{{ error }}</span>
                  </div>
                </div>
                <div>
                  <div class="h-0.5 opacity-10 bg-neutral-700 rounded-[1px]"></div>
                </div>

                <div class="mt-3" v-if="step.activities && step.activities.length > 0">
                  <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3 mb-3">Step Activities</div>
                  <div @click.stop="isActiveStep(step) ? processManagerStore.set('activity', activity) : ''; processManagerStore.clearError()" v-for="(activity, index) in step.activities" :key="index" class="w-100 pt-1 pb-2 pl-2 pr-2 rounded border border-neutral-700/opacity-25 flex justify-between mb-2"  :class="{ 'bg-zinc-100' : processManagerStore.activity.id === activity.id }">
                    <div>
                      <span class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Activity Type - {{ activity.field_type.name }}</span>
                      <div class="font-medium text-neutral-700 text-sm font-['Roboto'] leading-tight text-break" >{{ activity.label }}</div>
                      </div>

                    <div class="items-center">
                      <button type="button" data-toggle="dropdown" class="btn btn-tool mt-1">
                        <i class="pi pi-ellipsis-v"></i>
                      </button>
                      <div class="dropdown-menu dropdown-menu dropdown-menu-right">
                        <a href="#" class="dropdown-item">
                          <small>Edit</small> <i class="pi pi-file-edit float-right mt-1"></i>
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item">
                          <small>Delete</small> <i class="pi pi-times float-right mt-1"></i>
                        </a>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
              <!-- /.card-body -->
              <div class="card-footer border-top-0" :class="isActiveStep(step) ? 'bg-white' : 'bg-white opacity-75'">
                <div class="mb-2">
                  <div class="h-0.5 opacity-10 bg-neutral-700 rounded-[1px]"></div>
                </div>
                  <button v-if="isActiveStep(step) && !processManagerStore.loading" @click.stop="processManagerStore.showAddActivityModal(toast)" class="float-right flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 bg-neutral-700 text-white">
                    <i class="pi pi-plus text-sm custom-icon-sm"></i> Add Activity
                  </button>
                  <button v-else class="float-right flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 bg-neutral-700 text-white">
                    <i class="pi pi-plus text-sm custom-icon-sm"></i> Add Activity
                  </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </template>

    <div class="col-md-4" v-if="pageProps.shoAddStep">
      <div class="row">
        <div class="col-md-2 pl-0 pr-0">
          <hr class="mt-7" style="border-color: rgb(67, 170, 139);"> <!-- TODO: Move to css file -->
        </div>
        <div class="col-md-10 pl-0 pr-0">
          <div class="col-lg-4 col-md-4 col-sm-12 pr-0 pl-0 pt-1">
            <a :href="route('process-manager.edit', [props.process.id])" class="mt-2 flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white"><i class="pi pi-plus text-sm custom-icon-sm"></i> Add Step</a>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>