<script setup>

import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import { onMounted, ref, onUpdated } from "vue";
import Breadcrumb from 'primevue/breadcrumb';
import Dropdown from 'primevue/dropdown';
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useProcessManagerStore } from "@/stores";
import { usePage } from "@inertiajs/vue3";
import Button from "primevue/button";

const page = usePage();
const breadCrumbs = [{label: 'Process Information'}, {label: 'Steps & Activities', class: 'active'}, {label: 'Team Access'}];
import {useConfirm} from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";

const confirm = useConfirm();
const toast = useToast();
const processManagerStore = useProcessManagerStore();

onMounted(() => {
  processManagerStore.handleProcessDivHeight()
  window.addEventListener('resize', processManagerStore.handleProcessDivHeight);

  // Get the current URL
  const urlParams = new URLSearchParams(window.location.search);
  // Check if 'addActivity' is set
  if (urlParams.has('addActivity')) {
    if(urlParams.get('addActivity')) {
      processManagerStore.showAddActivity = true;
    }
  }
});

onUpdated(() => {
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
        <div class="col-sm-6 text-right">
          <a :href="route('process-manager')" class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 bg-neutral-700 text-white float-right">
            Save & Close
          </a>
        </div>
      </div>
    </template>

    <div class="content-container pl-4 pr-4">
      <div class="h-[1px] row">
        <div class="col-lg-3 col-md-3 col-sm-12" id="project-info-owidth">

        </div></div>
      <div class="row" id="process-creator-content">
        <div style="width:100px;height:100px;background: var(--neg-bg-light);position:absolute;z-index:1;"></div>
        <div class="col-lg-3 col-md-3 col-sm-12 pr-0" id="project-info-width" style="position: absolute;z-index: 1;">
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
                      <i class="fa fa-square float-right mt-1" :style="'color: '+slotProps.value.color"></i>
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
                      <i class="fa fa-square float-right mt-1" :style="'color: '+slotProps.option.color"></i>
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
              <div class="mt-3">
                <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3 mb-3">Steps</div>
                <a :href="route('process-manager.edit-activity', [processManagerStore.process.id, step.id])" v-for="(step, index) in processManagerStore.process.groups" :key="index" class="w-full m-h-9 p-2 rounded border border-neutral-700/opacity-25 flex items-start justify-between mb-1" :class="{ 'bg-zinc-100' : processManagerStore.step.id === step.id }">
                  <div class="font-medium text-neutral-700 text-sm font-['Roboto'] leading-tight w-full overflow-hidden break-words">
                    <span :class="{ 'text-white' : processManagerStore.step.id === step.id }">{{ step.name }}</span>
                  </div>
                  <div class="items-center flex-shrink-0 self-start">
                    <button type="button" data-toggle="dropdown" class="btn btn-tool">
                      <i class="pi pi-ellipsis-v"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right">
                      <a href="#" class="dropdown-item">
                        <small>Edit</small> <i class="pi pi-file-edit float-right mt-1"></i>
                      </a>
                      <div class="dropdown-divider"></div>
                      <a href="#" @click="processManagerStore.deleteItem(step, 'step', confirm, toast)" class="dropdown-item">
                        <small>Delete</small> <i class="pi pi-times float-right mt-1"></i>
                      </a>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <!-- /.card-body -->
          </div>
        </div>
        <div class="col-sm-12 pr-0 h-100" :class="(route().current('process-manager.edit-activity') && (processManagerStore.process.groups && processManagerStore.process.groups.length == 1)) ? ' offset-lg-3 offset-md-3 col-lg-9 col-md-9' : ' col-lg-12 col-md-12'" id="process-1" v-if="!route().current('process-manager.edit')">
          <slot></slot>
        </div>
        <div class="col-sm-12 pr-0 h-100" :class="(route().current('process-manager.edit')) ? ' offset-lg-3 offset-md-3 col-lg-9 col-md-9' : ' d-none col-lg-12 col-md-12'" id="process-2">
          <slot></slot>
        </div>

      </div>
    </div>
  </AuthenticatedLayout>
  <Toast position="top-center">
    <template #message="slotProps">
        <div class="flex flex-column align-items-start" style="flex: 1">
            <div class="font-medium text-sm my-1 text-900">{{ slotProps.message.detail }}</div>
        </div>
    </template>
  </Toast>
  <ConfirmDialog></ConfirmDialog>
</template>