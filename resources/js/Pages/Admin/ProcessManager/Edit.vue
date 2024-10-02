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

      <div class="col-lg-3 col-md-3 col-sm-12 pl-0 pr-o mr-0" style="padding-right: 0px;">
        <div class="card card-default">
          <div class="card-header border-bottom-0 pb-0">
            <div class="text-neutral-700 text-[1.25rem] font-bold font-['Roboto'] leading-loose">{{ processManagerStore.step.name }}</div>
          </div>
          <!-- /.card-header -->
          <div class="card-body">
            <div v-if="!(processManagerStore.step.id > 0)" class="mb-3">
              <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Step name</div>
              <input v-model="processManagerStore.step.name" type="text" class="mt-2 form-control form-control-md form-control-custom" id="process-name" placeholder="What do you want to call this process?">
              <div class="input-validation-error" v-if="typeof processManagerStore.stepErrors?.name !== 'undefined'">
                <span v-for="(error, index) in processManagerStore.stepErrors?.name" :key="index" class="error invalid-feedback">{{ error }}</span>
              </div>
            </div>
            <div>
              <div class="h-0.5 opacity-10 bg-neutral-700 rounded-[1px]"></div>
            </div>
            <div class="mt-4">
              <button v-if="!processManagerStore.loading" @click="processManagerStore.showAddActivityModal(toast)" class="flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white w-full"><i class="pi pi-plus text-sm custom-icon-sm"></i> Add activity</button>
              <button v-if="processManagerStore.loading" class="flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white w-full" disabled><i class="pi pi-spin pi-spinner text-sm custom-icon-sm"></i> Loading ...</button>
            </div>

            <div class="mt-4">
              <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3 mb-2">Step Activities</div>
              <div @click="processManagerStore.set('activity', activity); processManagerStore.clearError()" v-for="(activity, index) in processManagerStore.step.activities" :key="index" class="w-100 p-2 rounded border border-neutral-700/opacity-25 flex-col justify-start items-start gap-2 inline-flex mb-1"  :class="{ 'bg-zinc-100' : processManagerStore.activity.id === activity.id }">
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
                    <a href="#" @click="processManagerStore.deleteItem(activity, 'activity', confirm, toast)" class="dropdown-item">
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

      <div class="col-lg-1 col-md-1 col-sm-12 pr-0 pl-0 pt-4">
        <hr class="mt-7" style="border-color: #43AA8B;"/>
      </div>

      <div class="col-lg-2 col-md-2 col-sm-12 pr-0 pl-0 pt-4">
        <a :href="route('process-manager.edit', [process.id])" class="mt-2 flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white"><i class="pi pi-plus text-sm custom-icon-sm"></i> Add Step</a>
      </div>

    </div>

  </ExtendProcessManagerEditLayout>
</template>