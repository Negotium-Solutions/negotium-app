<script setup>

import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import { onMounted, reactive, ref, computed } from "vue";
import Breadcrumb from 'primevue/breadcrumb';
import Dropdown from 'primevue/dropdown';
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useProcessManagerStore } from "@/stores";
import { usePage } from "@inertiajs/vue3";

const page = usePage();
const breadCrumbs = [{label: 'Home'}, {label: 'Create Process', class: 'active'}];

const toast = useToast();
const processManagerStore = useProcessManagerStore();

const props = defineProps({
  lookup: null,
  process: null
});

onMounted(() => {
  processManagerStore.setLookUp('categories', props.lookup.categories);
  processManagerStore.set('process', props.process);
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
        <h1 class="text-neutral-700 text-4xl font-bold font-['Roboto']">Process Creator</h1>
        <Breadcrumb :model="breadCrumbs" :class="'p-0 text-sm'">
          <template #separator> <i class="pi pi-arrow-right text-sm"></i></template>
        </Breadcrumb>
      </div><!-- /.col -->
      </div>
    </template>

    <div class="content-container pl-4 pr-4">

      <div class="row">
        <div class="col-lg-3 col-md-3 col-sm-12 pr-0">
          <div class="card card-default">
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
                <Dropdown v-model="processManagerStore.selectedCategory" :options="processManagerStore.lookup.categories" filter @filter="processManagerStore.onFilter" optionLabel="name" placeholder="Select a category" class="mt-2 w-full md:w-14rem form-control-custom" :class="{'is-invalid-custom': false}">
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
                <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Steps</div>

              </div>
            </div>
            <!-- /.card-body -->
          </div>
        </div>

        <div class="col-lg-1 col-md-1 col-sm-12 pr-0 pl-0 pt-4">
          <hr class="mt-7" style="border-color: #43AA8B;"/>
        </div>

        <div class="col-lg-3 col-md-3 col-sm-12 pl-0">
          <div class="card card-default">
            <div class="card-header border-bottom-0 pb-0">
              <div class="text-neutral-700 text-[1.25rem] font-bold font-['Roboto'] leading-loose">Step</div>
            </div>
            <!-- /.card-header -->
            <div class="card-body">
              <div class="mb-2">
                <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Step name</div>
                <input v-model="processManagerStore.step.name" type="text" class="mt-2 form-control form-control-md form-control-custom" id="process-name" placeholder="What do you want to call this process?">
                <div class="input-validation-error" v-if="typeof processManagerStore.processErrors?.name !== 'undefined'">
                  <span v-for="(error, index) in processManagerStore.processErrors?.name" :key="index" class="error invalid-feedback">{{ error }}</span>
                </div>
              </div>
              <div class="mt-3">
                <div class="h-0.5 opacity-10 bg-neutral-700 rounded-[1px]"></div>
              </div>
              <div class="mt-4">
                <button class="flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white w-full"><i class="pi pi-plus"></i> Add activity</button>
              </div>
            </div>
            <!-- /.card-body -->
          </div>
        </div>
      </div>

    </div>
  </AuthenticatedLayout>
  <Toast/>
</template>

<style scoped>
</style>