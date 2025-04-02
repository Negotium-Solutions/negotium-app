<script setup>

import { onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useProcessManagerStore } from "@/stores";
import { usePage } from "@inertiajs/vue3";
import Button from "primevue/button";
import NegotiumButton from "@/Components/negotium/Button.vue";
import Dialog from "primevue/dialog";
import ProcessSteps from '@/Pages/Admin/ProcessManager/Partials/ProcessSteps.vue'
import ProcessManagerEditLayout from "@/Pages/Admin/ProcessManager/ProcessManagerEditLayout.vue";

const page = usePage();

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
  processManagerStore.setStep(props.step_id);
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

  <ProcessManagerEditLayout>

    <process-steps v-if="processManagerStore.step.id !== null" :process="processManagerStore.process" :steps="processManagerStore.process.groups" :step="processManagerStore.step"></process-steps>

    <Dialog v-model:visible="processManagerStore.showAddActivity" :draggable="false" modal header="Add note or reminder" :style="{ width: '30vw' }" :class="'notes-dialog'" :breakpoints="{ '900px': '65vw', '575px': '90vw' } ">
      <template #header>
        <div class="row m-0 p-0 pb-2">
          <div class="text-neutral-700 text-[1.5rem] font-bold font-['Roboto'] leading-loose w-100">Add new activity</div>
        </div>
      </template>
      <div class="mt-2">
        <span class="text-neutral-700 text-sm font-normal font-['Nunito'] leading-3 pb-2">Activity name</span>
        <a class="text-neutral-700 text-sm float-right text-green-3 font-normal font-['Nunito'] leading-3 pb-2" :class="{ 'text-red': processManagerStore.showInput}" @click.prevent="processManagerStore.toggleGuidanceNote()">{{ processManagerStore.guidanceNoteAction }}</a>
        <input v-model="processManagerStore.activity.name" type="text" class="form-control">
        <div class="input-validation-error" v-if="typeof processManagerStore.activityErrors?.name !== 'undefined'">
          <span v-for="(error, index) in processManagerStore.activityErrors?.name" :key="index" class="error invalid-feedback">{{ error }}</span>
        </div>
      </div>

      <div v-if="processManagerStore.showInput" class="mb-2">
        <span class="text-neutral-700 text-sm font-normal font-['Nunito'] leading-3 pb-2">Guidance note</span>
        <input v-model="processManagerStore.guidanceNote" type="text" class="form-control" placeholder="Enter your guidance note...">
      </div>

      <p class="mt-3 mb-1 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3 d-flex">Select activity type <i class="information ml-2 bg-sky-700"></i></p>
      <div class="btn-group btn-group-toggle w-100" data-toggle="buttons">
        <label class="btn btn-sm btn-outline-secondary border-neutral-700 border-opacity-20" :class="{ 'bg-zinc-100': processManagerStore.getDynamicModelFieldTypeGroup === dynamicModelFieldTypeGroup.id }" @click="processManagerStore.setDynamicModelFieldTypeGroup(dynamicModelFieldTypeGroup.id)" v-for="(dynamicModelFieldTypeGroup, index) in processManagerStore.dynamicModelFieldTypeGroups" :key="index">
          <input type="radio" name="options" :id="'option_'+dynamicModelFieldTypeGroup.id" autocomplete="off"> <span class="text-neutral-700 font-normal" :class="{ 'text-white': processManagerStore.getDynamicModelFieldTypeGroup === dynamicModelFieldTypeGroup.id }">{{ dynamicModelFieldTypeGroup.name }}</span>
        </label>
      </div>
      <p class="mt-3 mb-1 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Select <span class="font-weight-bold">user input</span></p>
      <div class="btn-group btn-group-toggle w-100" data-toggle="buttons">
        <label class="btn btn-sm btn-outline-secondary border-neutral-700 border-opacity-20" :class="{ 'bg-zinc-100': processManagerStore.getDynamicModelFieldType === dynamicModelFieldType.id }" @click="processManagerStore.setDynamicModelFieldType(dynamicModelFieldType.id)" v-for="(dynamicModelFieldType, at_index) in processManagerStore.getDynamicModelFieldTypeByDynamicModelFieldTypeGroup" :key="at_index">
          <input type="radio" name="options" :id="'option_'+dynamicModelFieldType.id" autocomplete="off"> <span class="text-neutral-700 font-normal" :class="{ 'text-white': processManagerStore.getDynamicModelFieldType === dynamicModelFieldType.id }">{{ dynamicModelFieldType.name }}</span>
        </label>
      </div>

      <div class="mt-3 mb-1" v-if="processManagerStore.getDynamicModelFieldTypeGroup === 2">
        <p class="text-neutral-700 text-xs font-normal font-['Nunito'] leading-3 mb-2">Answer options</p>
        <div v-if="processManagerStore.getDynamicModelFieldTypeGroup === 2" class="w-100 mb-2 mt-2 options-container">
          <div class="w-100">
            <input
                type="text"
                class="m-0 w-full border-0 h-9 rounded border border-neutral-700/opacity-25"
                v-model="processManagerStore.activityOptionInput"
                @keyup.enter="processManagerStore.addOption(processManagerStore.activity.options)"
                placeholder="Type an option and press Enter"
            />
          </div>
        </div>
        <div class="input-validation-error" v-if="typeof processManagerStore.activityErrors?.options !== 'undefined'">
          <span v-for="(error, index) in processManagerStore.activityErrors?.options" :key="index" class="error invalid-feedback">{{ error }}</span>
        </div>
        <div class="mb-2 max-h-[200px] d-block overflow-y-auto">
          <div v-for="(option, index) in processManagerStore.activity.options" :key="index" class="w-100 d-block mb-2 text-neutral-700 font-normal bg-white font-['Nunito'] leading-tight p-2.5 rounded border border-neutral-700/opacity-25 flex-col justify-start items-start gap-2 inline-flex">
            <span>{{ option }}</span>
            <i class="pi pi-times float-right cursor-pointer" @click="processManagerStore.removeOption(processManagerStore.activity.options, index)"></i>
          </div>
        </div>
      </div>
      <div class="mt-3 mb-1" v-if="processManagerStore.getDynamicModelFieldType === 16">
        <p class="text-neutral-700 text-xs font-normal font-['Nunito'] leading-3 mb-2">Upload Document</p>
        <div v-if="processManagerStore.getDynamicModelFieldType === 16" class="w-100 mb-2 mt-2 options-container">
          <div class="w-100">
            <input
                type="file"
                class="p-1 w-full border-0 rounded border border-neutral-700/opacity-25"
                @change="processManagerStore.handleFileUpload($event)"
            />
          </div>
        </div>
        <div class="input-validation-error" v-if="typeof processManagerStore.activityErrors?.options !== 'undefined'">
          <span v-for="(error, index) in processManagerStore.activityErrors?.options" :key="index" class="error invalid-feedback">{{ error }}</span>
        </div>
        <div class="mb-2 max-h-[200px] d-block overflow-y-auto">
          <div v-for="(option, index) in processManagerStore.activity.options" :key="index" class="w-100 d-block mb-2 text-neutral-700 font-normal bg-white font-['Nunito'] leading-tight p-2.5 rounded border border-neutral-700/opacity-25 flex-col justify-start items-start gap-2 inline-flex">
            <span>{{ option }}</span>
            <i class="pi pi-times float-right cursor-pointer" @click="processManagerStore.removeOption(processManagerStore.activity.options, index)"></i>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="row w-100 m-0">
          <div class="col-12 pt-3 pb-3 flex justify-between">
            <button class="flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700" @click="processManagerStore.showAddActivity = false">
              Cancel
            </button>
            <div class="flex items-center">
              <button class="flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 bg-neutral-700 text-white" v-if="!processManagerStore.loading" @click="processManagerStore.createActivity(toast)">Save Activity</button>
              <button v-if="processManagerStore.loading" class="flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 bg-neutral-700 text-white" disabled>
                <i class="pi pi-spin pi-spinner"></i> Loading ...
              </button>
            </div>
          </div>
        </div>

      </template>
    </Dialog>

  </ProcessManagerEditLayout>

</template>

<style scoped>
.options-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border: 1px solid #ccc;
  padding: 0px;
  border-radius: 4px;
}

.option-tag {
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
  background-color: #e0f7fa;
  padding: 4px 8px;
  border-radius: 9px;
  height: 25px;
}

.option-tag .pi {
  margin-left: 4px;
  cursor: pointer;
}

.option-tag:hover {
  background-color: #b2ebf2;
}

.options-input {
  border: none;
  outline: none;
  flex-grow: 1;
  padding: 4px;
}

.options-input::placeholder {
  color: #ccc;
}

.options-input:focus {
  outline: none;
  border-color: transparent;
  border: none;
}
</style>