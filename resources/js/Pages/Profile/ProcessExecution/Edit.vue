<script setup>
import { useProfilesManagerStore, useProcessExecution } from "@/stores/index.js";
import { onMounted } from "vue";
import ExtendProfileExecutionLayout from "@/Pages/Profile/ProcessExecutionLayout.vue";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";

const profileManagerStore = useProfilesManagerStore();
const processExecution = useProcessExecution();
const toast = useToast();

const props = defineProps({
  process: null,
  step_id: null,
  profileTypeId: 0,
  profileTypes: Array,
  profile: Object,
  apiUrl: String,
  apiImagesUrl: String,
  navigation: String,
  lookup: null
});

onMounted(() => {
  profileManagerStore.setProfileData(props);
  processExecution.set('process', props.process);
  processExecution.set('profile', props.profile);
  processExecution.setStep(props.step_id);

  processExecution.handleInnerContentDivHeight()
  window.addEventListener('resize', processExecution.handleInnerContentDivHeight);
});

function setFieldValue(index, value) {
      processExecution.step.fields[index].value = value;
    }
</script>

<template>
  <ExtendProfileExecutionLayout>
  <div v-if="processExecution.isSet('process', processExecution.process)" class="col-lg-12 pl-0 pr-0" id="process-execution-steps">
    <div class="d-flex flex-column w-100 pl-3 pr-3">

      <div class="flex flex-col px-2 py-2 mb-2">
        <div class="d-flex w-100 pt-2 pl-2 pr-2 pb-1">
          <div class="text-neutral-700 text-[1.25rem] font-bold font-['Roboto'] leading-loose">{{ processExecution.step.name }}</div>
        </div>

        <div class="row">
          <div v-for="(field, _index) in processExecution.step.fields" :key="_index" class="col-md-12 pl-3">
            <div class="gap-28 mb-2">
              <span class="mb-1 text-xs font-normal font-['Nunito'] leading-3 text-neutral-700">{{ field.label }}</span>
              <input v-if="field.dynamic_model_field_type_id == 1" class="form-control" v-model="processExecution.step.fields[_index].value">
              <select class="form-control" v-if="[9].includes(field.dynamic_model_field_type_id)" v-model="processExecution.step.fields[_index].value" placeholder="Please select">
                <option v-for="(option, index) in field.options" :key="index">{{ option.name }}</option>
              </select>
              <div class="flex flex-col" v-if="[8].includes(field.dynamic_model_field_type_id)">
                <label
                  v-for="(option, index) in field.options"
                  :key="index"
                  :class="['form-control', 'p-2', 'border', 'rounded', 'cursor-pointer', 'transition','font-normal','leading-3',{ 'bg-slate-500 text-white' : processExecution.step.fields[_index].value == option.name }]"
                  style="font-weight: 400 !important;"
                >
                  <input
                    type="radio"
                    :value="option.id"
                    class="hidden"
                    @click="setFieldValue(_index, option.name)"
                  />
                  {{ option.name }}
                </label>
              </div>
              <div class="btn-group btn-group-toggle w-100" data-toggle="buttons" v-if="[7].includes(field.dynamic_model_field_type_id)">
                <label class="btn btn-sm btn-outline-secondary border-neutral-700 border-opacity-20" v-for="(option, index) in field.options" :key="index" :class="{ 'bg-slate-500' : processExecution.step.fields[_index].value == option.name }">
                  <input type="radio" name="options" @click="setFieldValue(_index, option.name)" :id="'option_'+option.id" autocomplete="off"> <span class="text-neutral-700 font-normal" :class="{ 'text-white' : processExecution.step.fields[_index].value == option.name }">{{ option.name }}</span>
                </label>
              </div>
              <div class="input-validation-error" v-if="typeof processExecution.profileProcessFieldsErrors?.[field.field] !== 'undefined'">
                <span v-for="(error, index) in processExecution.profileProcessFieldsErrors?.[field.field]" :key="index" class="error invalid-feedback">{{ error }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="processExecution.isSet('process', processExecution.process)" class="col-lg-12 pl-2 pr-2 m-0 border-t" id="process-execution-buttons">
    <div class="d-flex flex-column w-100 pl-3 pr-3" style="padding-right:50px !important;">

      <div class="flex flex-col px-2 py-2 mb-2">
        <div class="row mt-3">
          <div class="col-md-12 text-right">
            <button v-if="!processExecution.saveStepLoading" @click="processExecution.storeDynamicModel(toast, processExecution.step, profileManagerStore.profile.profile_type_id)" class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 bg-neutral-700 text-white">
              {{ processExecution.step.id !== processExecution.getNextStepId ? 'Next Step' : 'Save' }}
            </button>
            <button v-if="processExecution.saveStepLoading"  class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 bg-neutral-700 text-white" disabled><i class="pi pi-spin pi-spinner text-sm custom-icon-sm"></i> Loading ...</button>
          </div>
        </div>
        </div>
        </div>
  </div>
  </ExtendProfileExecutionLayout>
</template>