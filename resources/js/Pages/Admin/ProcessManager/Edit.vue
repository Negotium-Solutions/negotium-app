<script setup>

import { onMounted, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useProcessManagerStore } from "@/stores";
import { usePage } from "@inertiajs/vue3";
import Button from "primevue/button";
import ExtendProcessManagerEditLayout from "@/Pages/Admin/ProcessManager/ProcessManagerEditLayout.vue";

const page = usePage();
import {useConfirm} from "primevue/useconfirm";

const confirm = useConfirm();
const toast = useToast();
const processManagerStore = useProcessManagerStore();

const props = defineProps({
  step_id: null,
  lookup: null,
  process: null,
  dynamicModelFieldTypeGroup: null
});

onMounted(() => {
  processManagerStore.handleProcessDivHeight()
  window.addEventListener('resize', processManagerStore.handleProcessDivHeight);
  processManagerStore.setLookUp('categories', props.lookup.categories);
  processManagerStore.set('process', props.process);
  processManagerStore.set('dynamicModelFieldTypeGroups', props.dynamicModelFieldTypeGroup);
  processManagerStore.setStep(parseInt(props.step_id));
  processManagerStore.lookup.categories.forEach((category, index) => {
    if(category.id === processManagerStore.process.process_category_id) {
      processManagerStore.selectedCategory = props.lookup.categories[index];
    }
  });

  // Get the current URL
  const urlParams = new URLSearchParams(window.location.search);
  // Check if 'addActivity' is set
  if (urlParams.has('addActivity')) {
    if(urlParams.get('addActivity')) {
      processManagerStore.showAddActivity = true;
    }
  }
});
</script>

<template>
  <ExtendProcessManagerEditLayout>

    <div class="row">

      <div class="col-lg-1 col-md-1 col-sm-12 pr-0 pl-0 pt-4">
        <hr class="mt-7" style="border-color: #43AA8B;"/>
      </div>

      <div class="col-lg-5 col-md-5 col-sm-12 pl-0 pr-o mr-0" style="padding-right: 0px;">
        <div class="card card-default">
          <div class="card-header border-bottom-0 pb-0">
            <div class="text-neutral-700 text-[1.25rem] font-bold font-['Roboto'] leading-loose">{{ processManagerStore.step.name }}</div>
          </div>
          <!-- /.card-header -->
          <div class="card-body">
            <div v-if="!(processManagerStore.step.id > 0)" class="mb-3">
              <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Step name</div>
              <input v-model="processManagerStore.step.name" type="text" class="mt-2 form-control form-control-md form-control-custom" id="process-name" placeholder="What do you want to call this step?">
              <div class="input-validation-error" v-if="typeof processManagerStore.stepErrors?.name !== 'undefined'">
                <span v-for="(error, index) in processManagerStore.stepErrors?.name" :key="index" class="error invalid-feedback">{{ error }}</span>
              </div>
            </div>
            <div>
              <div class="h-0.5 opacity-10 bg-neutral-700 rounded-[1px]"></div>
            </div>

          </div>
          <!-- /.card-body -->
          <div class="card-footer border-top-0 bg-white">
              <div class="mb-2">
                <div class="h-0.5 opacity-10 bg-neutral-700 rounded-[1px]"></div>
              </div>
                <button v-if="!processManagerStore.loading" @click.stop="processManagerStore.showAddActivityModal(toast)" class="float-right flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 bg-neutral-700 text-white">
                  <i class="pi pi-plus text-sm custom-icon-sm"></i> Add activity
                </button>
                <button v-else class="float-right flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700">
                  <i class="pi pi-plus text-sm custom-icon-sm"></i> Add activity
                </button>
            </div>
        </div>
      </div>

      <div class="col-lg-1 col-md-1 col-sm-12 pr-0 pl-0 pt-4">
        <hr class="mt-7" style="border-color: #43AA8B;"/>
      </div>

      <div class="col-lg-2 col-md-2 col-sm-12 pr-0 pl-0 pt-4">
        <a :href="route('process-manager.edit', [process.id])" class="w-[126px] mt-2 flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white"><i class="pi pi-plus text-sm custom-icon-sm"></i> Add Step</a>
      </div>

    </div>

  </ExtendProcessManagerEditLayout>
</template>