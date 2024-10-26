<script setup>
import { AuthenticatedLayout } from "@/Layouts/Adminlte/index.js";
import { ref,onMounted, computed } from "vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import Avatar from 'primevue/avatar';
import { usePage } from "@inertiajs/vue3";
import { useProcessExecution } from "@/stores/index.js";
import { FunctionsHelper } from "@/helpers/index.js";
import Button from "primevue/button";

const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);
const activeStep = ref('')
const toast = useToast();
const processExecution = useProcessExecution();

onMounted(() => {
  setTimeout(() => {
    processExecution.handleInnerContentDivHeight();
    const arr = processExecution.process.groups;

    const index = arr.findIndex(obj => obj.id === processExecution.step.id);
    activeStep.value = index
  }, 100);
});
</script>

<template>
  <AuthenticatedLayout>
    <template #profile>
    <div class="content-container">

      <div class="row" id="profiles-sidebar">
        <div class="col-lg-2 col-md-3 col-sm-12 border-right pr-0">
          <div v-for="(profile, index) in processExecution.profiles" :key="index" :class="{ 'bg-slate-500': processExecution.profile.id === profile.id }" class="w-100 py-2 h-14 border-b border-gray-200 justify-start items-center gap-3 inline-flex cursor-pointer">
            <div class="w-100 pl-6 pr-2 d-flex">
            <Avatar class="p-overlay-badge align-middle mr-2 w-[40px]" size="large" :image="processExecution.apiImagesUrl+profile.avatar"  />
            <span :class="processExecution.profile.id === profile.id ? 'text-white' : 'text-neutral-700'" class="flex items-center justify-center text-sm font-medium font-['Roboto'] leading-tight"> {{ profile.profile_name }} </span>
            <div class="row mb-2"></div>
            </div>
          </div>
        </div>
        <div class="col-lg-10 col-md-10 col-sm-12">
          <div class="row" v-if="processExecution.isSet('process', processExecution.process)" id="process-execution-header">
            <div class="d-flex w-100 pt-4  pl-3 pr-3 pb-6 border-bottom">
              <div class="col-sm-6 p-0">
                <h1 class="text-neutral-700 text-3xl font-bold font-['Roboto']">{{ processExecution.process.name }}</h1>
              </div>
              <div class="col-sm-6 text-right">
                <button @click="FunctionsHelper.loadPreviousPage()" class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 mr-2">Back</button>
                <button v-if="!processExecution.loading" class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 mr-2">Complete Process</button>
                <button v-if="!processExecution.loading" @click="processExecution.storeDynamicModel(toast, null, processExecution.profile.profile_type_id)" class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 bg-neutral-700 text-white">Save & Close</button>
                <button v-if="processExecution.loading"  class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 bg-neutral-700 text-white" disabled><i class="pi pi-spin pi-spinner"></i> Loading ...</button>
              </div>
            </div>
          </div>
          <div id="inner-content" class="row" v-if="processExecution.isSet('process', processExecution.process)">
            <div class="col-lg-3 col-md-3 col-sm-12 pl-0 pr-0 profile-info" id="profiles-detail" style="position:relative">
              <div class="pt-3 border-right pr-3 pl-3 col-md-12 h-100" id="process-execution-content">

                <div class="timeline">

                  <div class="time-label pb-0 mb-0">
                    <span class="pb-3">Progress</span>
                  </div>
                  <div class="flex" v-for="(step, index) in processExecution.process.groups" :key="index" :class="(index+1) === processExecution.process.groups.length ? '' :'mb-4 pb-3'">
                    <i :class="processExecution.step.id === step.id ? 'fas bg-blue' : index < activeStep ? 'fa fa-check bg-success-500 pt-1 text-white' : 'fas bg-neutral-500'" style="line-height: 1.5;"></i>
                    <div class="timeline-item flex flex-col pl-2"> <!-- Use flex column to align items vertically -->
                      <span class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Step {{ index + 1 }}</span>
                      <div class="font-bold text-neutral-700 text-sm font-['Roboto'] leading-tight text-break">{{ step.name }}</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <!-- Profile Page Start -->
            <div class="col-lg-9 col-md-9 col-sm-12 pl-0 pr-0">
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