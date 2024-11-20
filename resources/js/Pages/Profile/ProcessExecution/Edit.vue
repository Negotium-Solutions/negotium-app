<script setup>
import {useProfilesManagerStore, useProcessExecution, useProfileCommunicationStore } from "@/stores/index.js";
import { onMounted } from "vue";
import ExtendProfileExecutionLayout from "@/Pages/Profile/ProcessExecutionLayout.vue";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import EmailActivity from "@/Components/Process/Activity/Email.vue";
import TextArea from "@/Components/Process/Activity/TextArea.vue";
import Document from "@/Components/Process/Activity/Document.vue";
import Percentage from "@/Components/Process/Activity/Percentage.vue";
import Integer from "@/Components/Process/Activity/Integer.vue";
import Amount from "@/Components/Process/Activity/Amount.vue";
import Date from "@/Components/Process/Activity/Date.vue";
import NegotiumLink from "@/Components/Process/Activity/Link.vue";

const profileManagerStore = useProfilesManagerStore();
const processExecution = useProcessExecution();
const profileCommunicationStore = useProfileCommunicationStore();
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
  profileCommunicationStore.communication.to[0] = props.profile.email;
  console.log('profileManagerStore: ', profileManagerStore);

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
          <div v-for="(field, _index) in processExecution.step.fields" :key="_index" class="col-md-12 pl-3 border mb-2">
            <div class="gap-28 mb-2">
              <span class="mb-2 mt-4 text-neutral-700 text-[1.0rem] font-bold font-['Roboto'] leading-loose">{{ field.label }}</span>
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
              <div class="flex flex-col" v-if="[15].includes(field.dynamic_model_field_type_id)">
                <negotium-link></negotium-link>
              </div>
              <div class="flex flex-col" v-if="[6].includes(field.dynamic_model_field_type_id)">
                <date></date>
              </div>
              <div class="flex flex-col" v-if="[5].includes(field.dynamic_model_field_type_id)">
                <amount></amount>
              </div>
              <div class="flex flex-col" v-if="[4].includes(field.dynamic_model_field_type_id)">
                <integer></integer>
              </div>
              <div class="flex flex-col" v-if="[3].includes(field.dynamic_model_field_type_id)">
                <percentage></percentage>
              </div>
              <div class="flex flex-col" v-if="[10].includes(field.dynamic_model_field_type_id)">
                <document></document>
              </div>
              <div class="flex flex-col" v-if="[2].includes(field.dynamic_model_field_type_id)">
                <text-area></text-area>
              </div>
              <div class="flex flex-col" v-if="[13].includes(field.dynamic_model_field_type_id)">
                <email-activity></email-activity>
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