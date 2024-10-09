<script setup>
import { useProfilesManagerStore, useProfileDetailStore } from "@/stores/index.js";
import { onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import { AuthenticatedLayout } from "@/Layouts/Adminlte";

const profileManagerStore = useProfilesManagerStore();
const profileDetailStore = useProfileDetailStore();
const toast = useToast();

const props = defineProps({
  profile: null,
  profile_type_id: null,
  profileTypes: Array,
  lookup: null
});

onMounted(() => {
  profileDetailStore.set('profile', props.profile);
  profileDetailStore.set('profile_type_id', props.profile_type_id);
});
</script>

<template>
  <AuthenticatedLayout>
    <div class="row">
      <div class="col-lg-12">
        <div class="d-flex w-100 pt-3 pl-3 pr-3 pb-4">
          <div class="col-sm-6 p-0">
            <h1 class="text-neutral-700 text-[1.5rem] font-bold font-['RobotNo']">Profile Details</h1>
          </div>
          <div class="col-sm-6 text-right">
            <a :href="route('profile.create', props.profile_type_id)" class="gap-2 justify-center py-2 px-4 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white mr-2">Cancel</a>
            <button v-if="!profileDetailStore.loading" @click="profileDetailStore.createProfile(toast)" class="gap-2 justify-center py-2 px-4 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Save</button>
            <button v-if="profileDetailStore.loading"  class="px-4 py-2 bg-neutral-700 rounded-custom-25 border border-neutral-700 justify-center items-center text-white" disabled><i class="pi pi-spin pi-spinner"></i> Loading ...</button>
          </div>
        </div>
        <div class="row ml-2 mb-2">
          <div class="px-1 mb-1">
            <a :href="route('profile.create', 1)" class="float-right h-[38px] p-3 bg-white rounded border border-neutral-700 justify-center items-center gap-2 inline-flex ml-1 text-xs font-bold cursor-pointer" :class="{ 'bg-zinc-100 text-yellow-100' : parseInt(props.profile_type_id) === 1 }">Individual</a>
          </div>
          <div class="px-1 mb-1">
            <a :href="route('profile.create', 2)" class="float-right h-[38px] p-3 bg-white rounded border border-neutral-700 justify-center items-center gap-2 inline-flex ml-1 text-xs font-bold cursor-pointer" :class="{ 'bg-zinc-100 text-yellow-100' : parseInt(props.profile_type_id) === 2 }">Business</a>
          </div>
        </div>
        <div v-if="profileDetailStore.isSet('profile', profileDetailStore.profile)" class="d-flex flex-column w-100 pl-3 pr-3">

          <div v-for="(profileDetail, index) in profileDetailStore.profile.steps" :key="index" class="flex flex-col px-2 py-2 rounded-lg border border-solid border-neutral-700 mb-2">
            <div class="d-flex w-100 pt-2 pl-2 pr-2 pb-1">
              <h6 class="text-neutral-700 text-md mb-1 font-bold font-['Roboto']">{{ profileDetail.name }}</h6>
            </div>

            <div class="row">
              <div v-for="(field, _index) in profileDetail.fields" :key="_index" class="col-md-6 pl-3" :class="{ 'border-top-0 border-bottom-0 border-left-0 border-right-2 border border-solid border-neutral-700 border-opacity-20': _index % 2 === 0 }">
                <div class="gap-28 mb-1">
                  <span class="mb-1 text-xs font-normal font-['Nunito'] leading-3 text-neutral-700">{{ field.label }}</span>
                  <input v-if="field.dynamic_model_field_type_id == 1" class="form-control" v-model="profileDetailStore.profile.steps[index].fields[_index].value">
                  <select class="form-control" v-if="field.dynamic_model_field_type_id == 9" v-model="profileDetailStore.profile.steps[index].fields[_index].value" placeholder="Select a Gender">
                    <option v-for="(option, index) in field.options" :key="index">{{ option.name }}</option>
                  </select>
                  <div class="input-validation-error" v-if="typeof profileDetailStore.createProfileErrors?.[field.field] !== 'undefined'">
                    <span v-for="(error, index) in profileDetailStore.createProfileErrors?.[field.field]" :key="index" class="error invalid-feedback">{{ error }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>