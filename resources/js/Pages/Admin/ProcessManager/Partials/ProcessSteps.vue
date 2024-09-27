<script setup>
import Button from "primevue/button";
import { onMounted, reactive } from "vue";
import { useProcessManagerStore } from "@/stores";

const processManagerStore = useProcessManagerStore();

const props = defineProps({
  process: null,
  steps: [],
  step: null
});

const pageProps = reactive({
  activeIndex: 0,
  visibleSteps: [],
  shoAddStep: false
});

onMounted(() => {
  setActiveStep();
});

function setActiveStep()
{
  props.steps.forEach((step, index) => {
    console.log('test', props.steps);
    if (step.id === props.step.id) {
      let stepsLength = props.process.steps.length;
      pageProps.visibleSteps.push(step.id);

      if ((index === 0) && (index + 2 <= (stepsLength - 1))) {
        pageProps.visibleSteps.push(props.steps[index + 2].id);
      }

      if (index > 0) {
        pageProps.visibleSteps.push(props.steps[index - 1].id);
      }

      if (index < (stepsLength - 1)) {
        pageProps.visibleSteps.push(props.steps[index + 1].id);
      }

      if (index === (stepsLength - 1)) {
        pageProps.shoAddStep = true;
      }
    }
  });
}

function navigate(process_id, step_id) {
  window.location.href = route('process-manager.edit-activity', [process_id, step_id]);
}

function isActiveStep(step) {
  return step.id === props.step.id;
}
</script>

<template>
  <div class="row">

    <template v-for="(step, index) in props.steps" :key="index">
      <div @click="!isActiveStep(step) ? navigate(props.process.id, step.id) : ''" class="col-md-4 cursor-pointer" v-if="pageProps.visibleSteps.includes(step.id)">
        <div class="row">

          <div class="col-md-2 pl-0 pr-0">
            <hr class="mt-7" style="border-color: rgb(67, 170, 139);">
          </div>

          <div class="col-md-10 pl-0 pr-0">
            <div class="card card-default bg-gray-200" :class="{'bg-white' : isActiveStep(step)}">
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
                <div class="mt-4">
                  <button v-if="isActiveStep(step) && !processManagerStore.loading" @click.stop="processManagerStore.showAddActivityModal(toast)" class="flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 w-full hover:bg-neutral-700 hover:text-white">
                    <i class="pi pi-plus text-sm custom-icon-sm"></i> Add activity
                  </button>
                  <button v-else class="flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 w-full">
                    <i class="pi pi-plus text-sm custom-icon-sm"></i> Add activity
                  </button>
                  <button v-if="processManagerStore.loading" class="flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white w-full" disabled><i class="pi pi-spin pi-spinner text-sm custom-icon-sm"></i> Loading ...</button>
                </div>

                <div class="mt-4">
                  <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3 mb-2">Step Activities</div>
                  <div @click.stop="isActiveStep(step) ? processManagerStore.set('activity', activity) : ''; processManagerStore.clearError()" v-for="(activity, index) in step.activities" :key="index" class="w-100 p-2 rounded border border-neutral-700/opacity-25 flex-col justify-start items-start gap-2 inline-flex mb-1"  :class="{ 'bg-zinc-100' : processManagerStore.activity.id === activity.id }">
                    <span>Activity Type - {{ activity.field_type.name }}</span>
                    <div class="font-medium text-neutral-700 text-sm font-['Roboto'] leading-tight" >{{ activity.label }}</div>

                    <div class="items-center">
                      <button type="button" data-toggle="dropdown" class="btn btn-tool mt-0">
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
            </div>
          </div>

        </div>

      </div>
    </template>

    <div class="col-md-4" v-if="pageProps.shoAddStep">
      <div class="row">
        <div class="col-md-2 pl-0 pr-0">
          <hr class="mt-7" style="border-color: rgb(67, 170, 139);">
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