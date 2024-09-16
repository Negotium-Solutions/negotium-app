<script setup>

import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import { onMounted } from "vue";
import Breadcrumb from 'primevue/breadcrumb';
import Dropdown from 'primevue/dropdown';
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useProcessManagerStore, useActivityGroupsStore } from "@/stores";
import { usePage } from "@inertiajs/vue3";
import Button from "primevue/button";
import NegotiumButton from "@/Components/negotium/Button.vue";
import Dialog from "primevue/dialog";

const page = usePage();
const breadCrumbs = [{label: 'Process Information'}, {label: 'Steps & Activities', class: 'active'}, {label: 'Team Access'}];

const toast = useToast();
const processManagerStore = useProcessManagerStore();
const activityGroupsStore = useActivityGroupsStore();

const props = defineProps({
  lookup: null,
  process: null,
  dynamicModelFieldTypeGroup: null
});

onMounted(() => {
  processManagerStore.handleProcessDivHeight()
  window.addEventListener('resize', processManagerStore.handleProcessDivHeight);
  processManagerStore.setLookUp('categories', props.lookup.categories);
  processManagerStore.set('process', props.process);
  processManagerStore.set('dynamicModelFieldTypeGroup', props.dynamicModelFieldTypeGroup);
  activityGroupsStore.set('activity_groups', props.dynamicModelFieldTypeGroup);
  console.log('dynamicModelFieldTypeGroup', processManagerStore.dynamicModelFieldTypeGroup);
  processManagerStore.lookup.categories.forEach((category, index) => {
    if(category.id === processManagerStore.process.process_category_id) {
      processManagerStore.selectedCategory = props.lookup.categories[index];
    }
  });
})
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <div class="d-flex w-100">
      <div class="col-sm-6">
        <h1 class="text-neutral-700 text-4xl font-bold font-['Roboto'] mb-2">Process Creator</h1>
        <Breadcrumb :model="breadCrumbs" :class="'p-0 text-sm'">
          <template #separator> <i class="pi pi-arrow-right text-sm"></i></template>
        </Breadcrumb>
      </div><!-- /.col -->
      </div>
    </template>

    <div class="content-container pl-4 pr-4">

      <div class="row" id="process-creator-content">
        <div class="col-lg-3 col-md-3 col-sm-12 pr-0 h-100">
          <div class="card card-default h-100">
            <div class="card-header border-bottom-0 pb-0">
              <div class="text-neutral-700 text-[1.25rem] font-bold font-['Roboto'] leading-loose">Process Info</div>
            </div>
            <!-- /.card-header -->
            <div class="card-body">
              <div class="mb-2">
                <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Process name</div>
                <input v-model="processManagerStore.process.name" type="text" class="mt-2 form-control form-control-md form-control-custom" id="process-name" placeholder="What do you want to call this process?">
                <div class="input-validation-error" v-if="typeof processManagerStore.processErrors?.name !== 'undefined'">
                  <span v-for="(error, index) in processManagerStore.processErrors?.name" :key="index" class="error invalid-feedback">{{ error }}</span>
                </div>
              </div>
              <div class="mb-2">
                <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Category</div>
                <Dropdown disabled v-model="processManagerStore.selectedCategory" :options="processManagerStore.lookup.categories" filter @filter="processManagerStore.onFilter" optionLabel="name" placeholder="Select a category" class="mt-2 w-full md:w-14rem form-control-custom" :class="{'is-invalid-custom': false}">
                  <template #value="slotProps">
                    <div v-if="slotProps.value" class="w-100">
                      <span>{{ slotProps.value.name }}</span>
                      <i class="fa fa-square float-right" :style="'color: '+slotProps.value.color"></i>
                    </div>
                    <span v-else>
                          {{ slotProps.placeholder }}
                      </span>
                  </template>
                  <template #option="slotProps">
                    <div class="p-dropdown-empty-message w-100 text-center border" v-if="slotProps.option.id === 0">
                      <span>{{ slotProps.option.name }}</span>
                    </div>
                    <div class="w-100" v-else>
                      <span class="text-neutral-700 text-sm font-normal font-['Nunito'] leading-tight">{{ slotProps.option.name }}</span>
                      <i class="fa fa-square float-right" :style="'color: '+slotProps.option.color"></i>
                    </div>
                  </template>
                  <template #footer>
                    <div class="w-100">
                      <button @click="processManagerStore.createCategory(toast)" class="w-100 h-[30px] px-4 py-2 rounded border border-neutral-700 justify-center items-center mx-2 my-2 text-center text-xs font-normal font-['Roboto'] leading-3" :class="{'hover:bg-neutral-700 hover:text-white': !processManagerStore.loading}" :disabled="processManagerStore.loading">
                        {{ !processManagerStore.loading ? 'Create new category' : 'Loading ...' }}
                      </button>
                    </div>
                  </template>
                </Dropdown>
                <div class="input-validation-error" v-if="typeof processManagerStore.categoryErrors?.name !== 'undefined'">
                  <span v-for="(error, index) in processManagerStore.categoryErrors?.name" :key="index" class="error invalid-feedback">{{ error }}</span>
                </div>
                <div class="input-validation-error" v-if="typeof processManagerStore.processErrors?.process_category_id !== 'undefined'">
                  <span v-for="(error, index) in processManagerStore.processErrors?.process_category_id" :key="index" class="error invalid-feedback">{{ error }}</span>
                </div>
              </div>
              <div class="mt-3">
                <div class="h-0.5 opacity-10 bg-neutral-700 rounded-[1px]"></div>
              </div>
              <div class="mt-4">
                <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3 mb-2">Steps</div>
                <button type="button" @click="processManagerStore.set('step', step); processManagerStore.clearError()" v-for="(step, index) in processManagerStore.process.steps" :key="index" class="w-100 h-9 p-2 rounded border border-neutral-700/opacity-25 flex-col justify-start items-start gap-2 inline-flex mb-1"  :class="{ 'bg-zinc-100' : processManagerStore.step.id === step.id }">
                  <div class="font-medium text-neutral-700 text-sm font-['Roboto'] leading-tight" >{{ step.name }}</div>
                </button>
              </div>
            </div>
            <!-- /.card-body -->
          </div>
        </div>

        <div class="col-lg-1 col-md-1 col-sm-12 pr-0 pl-0 pt-4">
          <hr class="mt-7" style="border-color: #43AA8B;"/>
        </div>

        <div class="col-lg-3 col-md-3 col-sm-12 pl-0 pr-o mr-0" style="padding-right: 0px;">
          <div class="card card-default">
            <div class="card-header border-bottom-0 pb-0">
              <div class="text-neutral-700 text-[1.25rem] font-bold font-['Roboto'] leading-loose">Step</div>
            </div>
            <!-- /.card-header -->
            <div class="card-body">
              <div class="mb-2">
                <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Step name</div>
                <input v-model="processManagerStore.step.name" type="text" class="mt-2 form-control form-control-md form-control-custom" id="process-name" placeholder="What do you want to call this process?">
                <div class="input-validation-error" v-if="typeof processManagerStore.stepErrors?.name !== 'undefined'">
                  <span v-for="(error, index) in processManagerStore.stepErrors?.name" :key="index" class="error invalid-feedback">{{ error }}</span>
                </div>
              </div>
              <div class="mt-3">
                <div class="h-0.5 opacity-10 bg-neutral-700 rounded-[1px]"></div>
              </div>
              <div class="mt-4">
                <button v-if="!processManagerStore.loading" @click="processManagerStore.showAddActivityModal(toast)" class="flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white w-full"><i class="pi pi-plus"></i> Add activity</button>
                <button v-if="processManagerStore.loading"  class="px-4 py-2 bg-neutral-700 rounded-custom-25 border border-neutral-700 justify-center items-center text-white w-full" disabled><i class="pi pi-spin pi-spinner"></i> Loading ...</button>
              </div>
            </div>
            <!-- /.card-body -->
          </div>
        </div>

        <div class="col-lg-1 col-md-1 col-sm-12 pr-0 pl-0 pt-4">
          <hr class="mt-7" style="border-color: #43AA8B;"/>
        </div>

        <div class="col-lg-1 col-md-1 col-sm-12 pr-0 pl-0 pt-4">
          <button @click="processManagerStore.resetStep()" class="mt-2 flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white w-full"><i class="pi pi-plus"></i> Add Step</button>
        </div>

      </div>
      <Dialog v-model:visible="processManagerStore.showAddActivity" :draggable="false" modal header="Add note or reminder" :style="{ width: '40vw' }" :class="'notes-dialog'" :breakpoints="{ '1199px': '75vw', '575px': '90vw' } ">
        <template #header>
          <div class="row m-0 p-0 pb-2">
            <div class="text-neutral-700 text-[1.5rem] font-bold font-['Roboto'] leading-loose w-100">Add new activity</div>
          </div>
        </template>
        <div class="mt-2">
          <span class="text-neutral-700 text-sm font-normal font-['Nunito'] leading-3 pb-2">Activity name</span>
          <input v-model="processManagerStore.activity.name" type="text" class="form-control">
          <div class="input-validation-error" v-if="typeof processManagerStore.activityErrors?.name !== 'undefined'">
            <span v-for="(error, index) in processManagerStore.activityErrors?.name" :key="index" class="error invalid-feedback">{{ error }}</span>
          </div>
        </div>

        <p class="mt-3 mb-1 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3 d-flex">Select activity type<i class="information ml-2 bg-sky-700"></i></p>
        <div class="btn-group btn-group-toggle w-100" data-toggle="buttons">
          <label class="btn btn-sm btn-default" :class="{ 'active': activityGroupsStore.getActivityGroup === activity_group.id }" @click="activityGroupsStore.setActivityGroup(activity_group.id)" v-for="(activity_group, index) in activityGroupsStore.getActivityGroups" :key="index">
            <input type="radio" name="options" :id="'option_'+activity_group.id" autocomplete="off"> {{ activity_group.name }}
          </label>
        </div>
        <p class="mt-3 mb-1 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Select <span class="font-weight-bold">user input</span></p>
        <div class="btn-group btn-group-toggle w-100" data-toggle="buttons">
          <label class="btn btn-sm btn-default" :class="{ 'active': activityGroupsStore.getActivityType === activity_type.id }" @click="activityGroupsStore.setActivityType(activity_type.id)" v-for="(activity_type, at_index) in activityGroupsStore.getActivityTypesByActivityGroup" :key="at_index">
            <input type="radio" name="options" :id="'option_'+activity_type.id" autocomplete="off"> {{ activity_type.name }}
          </label>
        </div>

        <template #footer>
          <div class="row">
            <div class="col-12 p-4 pr-0">
              <button class="gap-2 justify-center py-2 px-4 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white mr-2" @click="processManagerStore.showAddActivity = false">Cancel</button>
              <negotium-button v-if="!processManagerStore.loading"  @click="processManagerStore.createActivity(toast)" :value="'Save'"></negotium-button>
              <button v-if="processManagerStore.loading"  class="px-4 py-2 bg-neutral-700 rounded-custom-25 border border-neutral-700 justify-center items-center text-white" disabled><i class="pi pi-spin pi-spinner"></i> Loading ...</button>
            </div>
          </div>
        </template>
      </Dialog>
    </div>
  </AuthenticatedLayout>
  <Toast/>
</template>
<style scoped>
  .active {
    background-color: grey;
    color: white;
  }
</style>