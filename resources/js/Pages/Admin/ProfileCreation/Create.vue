<script setup>
import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import { onMounted, reactive, computed } from "vue";
import Breadcrumb from 'primevue/breadcrumb';
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useProfileCreatorManager } from "@/stores";
import { usePage } from "@inertiajs/vue3";
import Button from "primevue/button";

const toast = useToast();
const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);
const breadCrumbs = [{label: 'Home'}, {label: 'Profiles'}, {label: 'Create Profile', class: 'active'}];

const profileCreatorManager = useProfileCreatorManager();

onMounted(() => {

});
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <div class="col-sm-6">
        <h1 class="m-0">Profiles</h1>
        <Breadcrumb :model="breadCrumbs" :class="'p-0 text-sm'">
          <template #separator> <i class="pi pi-arrow-right text-sm"></i></template>
        </Breadcrumb>
      </div><!-- /.col -->
      <div class="col-sm-6 text-right pt-3">
        <a :href="route('profile-creation')" class="btn btn-sm btn-outline-secondary w-24 mr-2">Cancel</a>
        <button @click="profileCreatorManager.create(toast)" class="btn btn-sm btn-dark w-24">Save Draft</button>
      </div><!-- /.col -->
    </template>

    <div class="content-container pl-4 pr-4">

      <div class="row" id="profile-creator-content">

        <div class="col-lg-3 col-md-3 col-sm-12 pr-0 h-100">
          <div class="card card-default h-100">
            <div class="card-header border-bottom-0 pb-0">
              <div class="text-neutral-700 text-[1.25rem] font-bold font-['Roboto'] leading-loose">Profile Info</div>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Profile name</div>
                <input v-model="profileCreatorManager.profile.name" type="text" class="mt-2 form-control form-control-md form-control-custom" id="profile-name" placeholder="What do you want to call this profile?">
                <div class="input-validation-error" v-if="typeof profileCreatorManager.createProfileErrors?.name !== 'undefined'">
                  <span v-for="(error, index) in profileCreatorManager.createProfileErrors?.name" :key="index" class="error invalid-feedback">{{ error }}</span>
                </div>
              </div>
              <div class="mb-2">
                <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Create quick capture for this profile?</div>
                <div class="btn-group btn-group-toggle w-100 mt-2" data-toggle="buttons">
                  <label @click="profileCreatorManager.setQuickCapture('Yes')" class="btn btn-sm btn-outline-secondary border-neutral-700 border-opacity-20"  :class="{ 'bg-zinc-100' : profileCreatorManager.profile.quick_capture === 'Yes' }">
                    <input type="radio" name="options" id="option_1" autocomplete="off">
                    <span class="text-neutral-700 font-normal" :class="{ 'text-white' : profileCreatorManager.profile.quick_capture === 'Yes' }">Yes</span>
                  </label>
                  <label @click="profileCreatorManager.setQuickCapture('No')" class="btn btn-sm btn-outline-secondary border-neutral-700 border-opacity-20"  :class="{ 'bg-zinc-100' : profileCreatorManager.profile.quick_capture === 'No' }">
                    <input type="radio" name="options" id="option_2" autocomplete="off">
                    <span class="text-neutral-700 font-normal" :class="{ 'text-white' : profileCreatorManager.profile.quick_capture === 'No' }">No</span>
                  </label>
                </div>
              </div>
              <div class="mt-3">
                <div class="h-0.5 opacity-10 bg-neutral-700 rounded-[1px]"></div>
              </div>
              <div class="mt-4">
                <button v-if="!profileCreatorManager.loading" @click="profileCreatorManager.create(toast)" class="flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white w-full">
                  <i class="pi pi-plus text-sm custom-icon-sm"></i> Add sections
                </button>
                <button v-if="profileCreatorManager.loading"  class="flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 bg-neutral-700 rounded-custom-25 border border-neutral-700 justify-center items-center text-white w-full" disabled><i class="pi pi-spin pi-spinner"></i> Loading ...</button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-3 col-sm-12 pr-0 h-100">

        </div>

      </div>

    </div>

    <Toast position="top-center">
      <template #message="slotProps">
        <div class="flex flex-column align-items-start" style="flex: 1">
          <div class="font-medium text-sm my-1 text-900">{{ slotProps.message.detail }}</div>
        </div>
      </template>
    </Toast>
  </AuthenticatedLayout>
</template>

<style scoped>
.bg-olive:hover {
  background-color: #2e7555 !important;
  border-color: #2b6b4f;
}
</style>