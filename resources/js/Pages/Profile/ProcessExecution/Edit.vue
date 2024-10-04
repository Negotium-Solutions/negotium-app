<script setup>
import { useProfilesManagerStore, useProcessExecution } from "@/stores/index.js";
import { onMounted } from "vue";
import ExtendProfileExecutionLayout from "@/Pages/Profile/ProcessExecutionLayout.vue";
import { useToast } from "primevue/usetoast";

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
});
</script>

<template>
  <ExtendProfileExecutionLayout>
  <div v-if="processExecution.isSet('process', processExecution.process)" class="col-lg-12 pl-0 pr-0">
    <div class="d-flex flex-column w-100 pl-3 pr-3">

      <div class="flex flex-col px-2 py-2 mb-2">
        <div class="d-flex w-100 pt-2 pl-2 pr-2 pb-1">
          <h6 class="text-neutral-700 text-md mb-1 font-bold font-['Roboto']">{{ processExecution.step.name }}</h6>
        </div>

        <div class="row">
          <div v-for="(field, _index) in processExecution.step.fields" :key="_index" class="col-md-12 pl-3">
            <div class="gap-28 mb-1">
              <span class="mb-1 text-xs font-normal font-['Nunito'] leading-3 text-neutral-700">{{ field.label }}</span>
              <input v-if="field.dynamic_model_field_type_id == 1" class="form-control" v-model="processExecution.step.fields[_index].value">
              <select class="form-control" v-if="[7, 8, 9].includes(field.dynamic_model_field_type_id)" v-model="processExecution.step.fields[_index].value" placeholder="Select a Gender">
                <option v-for="(option, index) in field.options" :key="index">{{ option.name }}</option>
              </select>
              <div class="input-validation-error" v-if="typeof processExecution.profileProcessFieldsErrors?.[field.field] !== 'undefined'">
                <span v-for="(error, index) in processExecution.profileProcessFieldsErrors?.[field.field]" :key="index" class="error invalid-feedback">{{ error }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  </ExtendProfileExecutionLayout>
</template>