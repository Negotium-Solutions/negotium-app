<script setup>

import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import { onMounted, reactive, ref, computed } from "vue";
import Breadcrumb from 'primevue/breadcrumb';
import Dropdown from 'primevue/dropdown';
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import { useProcessesStore } from "@/stores";
import { usePage } from "@inertiajs/vue3";

const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);
const breadCrumbs = [{label: 'Home'}, {label: 'Processes', class: 'active'}];

const confirm = useConfirm();
const toast = useToast();
const processStore = useProcessesStore();

const props = defineProps({
  processes: Array,
  categories: Object,
  selectedOption: String
});

const pageProps = reactive({
  processes: Array,
  selectedOption: "d",
  selectedCategory: 0
});

const activitiesCounter = computed((steps) => {
  let counter = 0;
  steps.forEach((step) => {
    counter += step.activities.length
  });
  return counter;
})

const sortByOptions = ref([
  { name: 'Latest First', code: 'd' },
  { name: 'Oldest First', code: 'a' },
  { name: 'Process', code: 'p' },
  { name: 'Steps', code: 's' },
  { name: 'Activities', code: 'l' }
]);

processStore.setProcesses(props.processes);

onMounted(() =>{
  pageProps.processes = props.processes;
});

function deleteProcess(process) {
  confirm.require({
    message: 'Are you sure you want to delete this process?',
    header: 'Warning',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'btn-sm btn-outline-light border',
    acceptClass: 'btn-sm btn-danger',
    accept: () => {
      const response = processStore.delete(process);
      response.then((result) => {
        console.log('Result: ', result);
        if(result.status === 'success') {
          toast.add({ severity: 'success', summary: 'Success', detail: 'Process deleted successfully.', life: 3000 });
        } else {
          toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while trying to delete process', life: 3000 });
        }
      })
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'Operation cancelled', life: 3000 });
    }
  });
}
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <div class="d-flex w-100">
      <div class="col-sm-6">
        <h1 class="text-neutral-700 text-4xl font-bold font-['Roboto']">Processes</h1>
        <Breadcrumb :model="breadCrumbs" :class="'p-0 text-sm'">
          <template #separator> <i class="pi pi-arrow-right text-sm"></i></template>
        </Breadcrumb>
      </div><!-- /.col -->
      <div class="col-sm-6 text-right pt-2 pt-sm-3 pt-md-3 pt-lg-3 pt-xl-3">
        <a :href="route('process.create')" class="px-4 py-2 bg-neutral-700 rounded border border-neutral-700 justify-center items-center text-white">Create Process</a>
      </div><!-- /.col -->
      </div>
    </template>

    <div class="content-container pl-4 pr-4">

      <div class="row mb-3">
        <div class="col-md-8">
          <div class="row">
            <div class="pr-1 mb-2">
              <button :class="['flex gap-2 justify-center py-2.5 px-3 text-xs leading-3 rounded border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white', { 'bg-neutral-700 text-white' : processStore.isSelectedCategory(0) }]" @click="processStore.toogleCategory(0)">All</button>
            </div>
            <div v-for="(category, index) in props.categories" :key="index" class="px-1 mb-2">
              <button :class="['flex gap-2 justify-center py-2.5 px-3 text-xs leading-3 rounded border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white', { 'bg-neutral-700 text-white' : processStore.isSelectedCategory(category.id) }]" @click="processStore.toogleCategory(category.id)"><i class="fa fa-square" :style="'color: '+category.color"></i>&nbsp;&nbsp;{{category.name}}</button>
            </div>
          </div>
        </div>
        <div class="col-md-4 text-right">
          <span label-for="sort_by" class="mr-2 col-sm-12">Sort by:</span>
          <Dropdown v-model="pageProps.selectedOption" :options="sortByOptions" optionLabel="name" placeholder="Please Select" checkmark :highlightOnSelect="false" class="border-neutral-700/opacity-20 text-neutral-700 text-xs font-normal font-['Nunito']" />
        </div>
      </div>

      <div class="row">
        <div class="col-md-3 mb-3" v-for="(process, index) in processStore.filterByCategory" :key="index">
          <div class="flex flex-col px-4 py-6 rounded-lg border border-solid bg-neutral-50 border-neutral-700">
            <div class="flex gap-5">
              <div class="flex-auto text-lg font-bold leading-6 text-neutral-700">
                {{ process.name }}
              </div>
              <div class="flex flex-col items-center">
                <button type="button" data-toggle="dropdown" class="btn btn-tool mt-0">
                  <i class="pi pi-ellipsis-v"></i>
                </button>
                <div class="dropdown-menu dropdown-menu dropdown-menu-right">
                  <a class="dropdown-item">
                    <small>Edit</small> <i class="pi pi-file-edit float-right mt-1"></i>
                  </a>
                  <div class="dropdown-divider"></div>
                  <a href="#" @click="deleteProcess(process)" class="dropdown-item">
                    <small>Delete</small> <i class="pi pi-times float-right mt-1"></i>
                  </a>
                </div>
              </div>
            </div>
            <div v-if="process.category" class="mt-1 text-xs leading-3" :style="'color: '+process.category.color">{{ process.category.name }}</div>
            <div class="shrink-0 mt-3 h-px rounded-sm bg-neutral-700"></div>
            <div class="mt-2.5 text-sm leading-5 text-neutral-700">
              <div>{{ process.steps.length }} Steps | {{ (typeof process.steps.activities !== 'undefined') ? process.steps.activities.length : 0 }} Activities</div>
            </div>
            <div class="mt-2 text-xs leading-3 text-neutral-700">
              000 Profiles linked
            </div>
          </div>
        </div>
      </div>

    </div>
  </AuthenticatedLayout>
  <Toast/>
  <ConfirmDialog></ConfirmDialog>
</template>

<style scoped>
</style>