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
  selectedOption: String,
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
  { name: 'Process', code: 'p' },
  { name: 'Steps', code: 's' },
  { name: 'Activities', code: 'l' }
]);

processStore.init(negotium_api_url, user);
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
      <div class="col-sm-6">
        <h1 class="m-0">Processes</h1>
        <ol class="breadcrumb sm">
          <li class="breadcrumb-item"><a href="#">Home</a></li>
          <li class="breadcrumb-item active">Processes</li>
        </ol>
      </div><!-- /.col -->
      <div class="col-sm-6 text-right pt-3">
        <a :href="route('process.create')" class="btn btn-sm btn-dark">Create Process</a>
      </div><!-- /.col -->
    </template>

    <div class="content-container pl-4 pr-4">

      <div class="row mb-3">
        <div class="col-md-7">
          <div class="row">
            <div class="col-md-3 mb-2">
              <button class="btn btn-sm btn-block btn-outline-dark w-100" :class="{ active : processStore.isSelectedCategory(0) }" @click="processStore.toogleCategory(0)">All</button>
            </div>
            <div v-for="(category, index) in props.categories" :key="index" class="col-md-3 col-sm-12 mb-2">
              <button class="btn btn-sm btn-block btn-outline-dark" :class="{ active : processStore.isSelectedCategory(category.id) }" @click="processStore.toogleCategory(category.id)"><i class="fa fa-square" :style="'color: '+category.color"></i>&nbsp;&nbsp;{{category.name}}</button>
            </div>
          </div>
        </div>
        <div class="col-md-5 text-right">
          <span label-for="sort_by" class="mr-2 col-sm-12">Sort by:</span>
          <Dropdown v-model="pageProps.selectedOption" :options="sortByOptions" optionLabel="name" placeholder="Select a City" checkmark :highlightOnSelect="false" class="col-md-4 col-sm-12" />
        </div>
      </div>

      <div class="row">
        <div class="col-md-3" v-for="(process, index) in processStore.filterByCategory" :key="index">
          <div class="card card-default">
            <div class="card-header">
              <h3 class="card-title font-weight-bold">
                {{ process.name }} <br/>
                <small class="font-medium" :style="'color: '+process.category.color">{{ process.category.name }}</small>
              </h3>
              <div class="card-tools">
                <button type="button" data-toggle="dropdown" class="btn btn-tool">
                  <i class="pi pi-ellipsis-v"></i>
                </button>
                <div class="dropdown-menu dropdown-menu dropdown-menu-right">
                  <a :href="route('process.edit', process.id)" class="dropdown-item">
                    <small>Edit</small> <i class="pi pi-file-edit float-right mt-1"></i>
                  </a>
                  <div class="dropdown-divider"></div>
                  <a href="#" @click="deleteProcess(process)" class="dropdown-item">
                    <small>Delete</small> <i class="pi pi-times float-right mt-1"></i>
                  </a>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div>{{ process.steps.length }} Steps | {{ (typeof process.steps.activities !== 'undefined') ? process.steps.activities.length : 0 }} Activities</div>
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