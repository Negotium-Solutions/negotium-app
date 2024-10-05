<script setup>
import { AuthenticatedLayout } from "@/Layouts/Adminlte/index.js";
import { onMounted, computed } from "vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import Avatar from 'primevue/avatar';
import { usePage } from "@inertiajs/vue3";
import { useProfilesManagerStore, useProcessExecution } from "@/stores/index.js";
import { FunctionsHelper } from "@/helpers/index.js";
import Button from "primevue/button";

const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);

const toast = useToast();
const profileManagerStore = useProfilesManagerStore();
const processExecution = useProcessExecution();

onMounted(() => {
  setTimeout(() => {
    processExecution.handleInnerContentDivHeight();
  }, 100);
});
</script>

<template>
  <AuthenticatedLayout>
    <template #profile>
    <div class="content-container">

      <div class="row" id="profiles-sidebar">
        <div class="col-lg-2 col-md-3 col-sm-12 border-right pr-0">
          <div v-for="(profile, index) in profileManagerStore.profiles" :key="index" @click="FunctionsHelper.navigateTo(route(route().current(), {'profile_id': profile.id, 'process_id': processExecution.process.id, 'step_id': 0}), '?pt='+profileManagerStore.profile.profile_type_id)" :class="{ 'bg-slate-500': profileManagerStore.profile.id === profile.id }" class="w-100 py-2 h-14 border-b border-gray-200 justify-start items-center gap-3 inline-flex cursor-pointer">
            <div class="w-100 pl-6 pr-2 d-flex">
            <Avatar class="p-overlay-badge align-middle mr-2 w-[40px]" size="large" :image="profileManagerStore.apiImagesUrl+profile.avatar"  />
            <span :class="profileManagerStore.profile.id === profile.id ? 'text-white' : 'text-neutral-700'" class="flex items-center justify-center text-sm font-medium font-['Roboto'] leading-tight"> {{ profile.profile_name }} </span>
            <div class="row mb-2"></div>
            </div>
          </div>
        </div>
        <div class="col-lg-10 col-md-10 col-sm-12">
          <div class="row" v-if="processExecution.isSet('process', processExecution.process)">
            <div class="d-flex w-100 pt-3 pl-3 pr-3 pb-4 border-bottom">
              <div class="col-sm-6 p-0">
                <h1 class="text-neutral-700 text-[1.5rem] font-bold font-['Roboto']">{{ processExecution.process.name }}</h1>
              </div>
              <div class="col-sm-6 text-right">
                <button @click="FunctionsHelper.loadPreviousPage()" class="gap-2 justify-center py-2 px-4 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white mr-2">Back</button>
                <button v-if="!processExecution.loading" class="gap-2 justify-center py-2 px-4 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white mr-2">Complete Process</button>
                <button v-if="!processExecution.loading" @click="processExecution.storeDynamicModel(toast, null, profileManagerStore.profile.profile_type_id)" class="gap-2 justify-center py-2 px-4 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Save & Close</button>
                <button v-if="processExecution.loading"  class="px-4 py-2 bg-neutral-700 rounded-custom-25 border border-neutral-700 justify-center items-center text-white" disabled><i class="pi pi-spin pi-spinner"></i> Loading ...</button>
              </div>
            </div>
          </div>
          <div id="inner-content" class="row" v-if="processExecution.isSet('process', processExecution.process)">
            <div class="col-lg-4 col-md-4 col-sm-12 pl-0 pr-0 profile-info" id="profiles-detail" style="position:relative">
              <div class="pt-3 border-right pr-3 pl-3 col-md-12" id="process-execution-content">

                <div class="timeline">

                  <div class="time-label">
                    <span>Progress</span>
                  </div>
                  <div class="mb-5" v-for="(step, index) in processExecution.process.steps" :key="index">
                    <i class="fas" :class="processExecution.step.id === step.id ? 'bg-blue' : 'bg-lightgray'"></i>
                    <div class="timeline-item">
                      <span>Step {{ index + 1 }}</span>
                      <div class="font-bold">{{ step.name }}</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <!-- Profile Page Start -->
            <div class="col-lg-8 col-md-8 col-sm-12 pl-0 pr-0">
              <slot/>
            </div>
          </div>
        </div>

        <!-- Profile Page End -->
      </div>
    </div>
    </template>
  </AuthenticatedLayout>
  <Toast position="top-center">
    <template #message="slotProps">
      <div class="flex flex-column align-items-start" style="flex: 1">
        <div class="font-medium text-sm my-1 text-900">{{ slotProps.message.detail }}</div>
      </div>
    </template>
  </Toast>
</template>
<style scoped>
  .timeline>div>.timeline-item {
    box-shadow: 0 0 0 0;
    border-radius: .25rem;
    background-color: #fff;
    color: #495057;
    margin-left: 60px;
    margin-right: 15px;
    margin-top: 0;
    padding: 0;
    position: relative;
  }
</style>