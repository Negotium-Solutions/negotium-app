<script setup>
import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import { onMounted, reactive, computed } from "vue";
import Breadcrumb from 'primevue/breadcrumb';
import Dropdown from 'primevue/dropdown';
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useProcessesStore, useProcessCategoryStore } from "@/stores";
import { usePage } from "@inertiajs/vue3";

const toast = useToast();
const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);
const breadCrumbs = [{label: 'Home'}, {label: 'Processes'}, {label: 'Create Process', class: 'active'}];

const processCategoryStore = useProcessCategoryStore();
const processStore = useProcessesStore();

const props = defineProps({
  categories: Array,
  selectedCategory: String
});

const pageProps = reactive({
  isFormSubmitted: false,
  selectedCategory: { id: null, name: 'Select category', color: 'white' },
  categories: [],
  isLoadingCreateProcessCategory: false,
  isLoadingCreateProcess: false
});

onMounted(() => {
  processCategoryStore.process_categories = props.categories;
  // pageProps.categories.push(pageProps.addCategoryOption);
  props.categories.forEach((category) => {
    pageProps.categories.push(category);
  });
});

function createCategory() {
  this.pageProps.isLoadingCreateProcessCategory = true;
  const response = processCategoryStore.create();
  response.then((result) => {
    if (result.status === 'error') {
      toast.add({severity: 'error', summary: 'Error', detail: result.message, life: 3000});

      if (result.code === 422) {
        toast.add({severity: 'error', summary: 'Error', detail: 'The category search textbox is empty, add new category on the search textbox', life: 3000});
      }
    } else {
      toast.add({severity: 'success', summary: 'Success', detail: result.message, life: 5000});

      const categories = processCategoryStore.fetchProcessCategories();
    }
    this.pageProps.isLoadingCreateProcessCategory = false;
  });
}

function createProcess()
{
  this.pageProps.isLoadingCreateProcess = true;
  this.pageProps.isFormSubmitted = true;
  processStore.process.process_category_id = pageProps.selectedCategory.id;
  const response = processStore.create();
  response.then((result) => {
    if(result.status === 'error') {
      toast.add({severity: 'error', summary: 'Error', detail: result.message, life: 3000});
      this.pageProps.isLoadingCreateProcess = false;
    } else {
      let toastMessages = [];
      toastMessages.push({severity: 'success', summary: 'Success', message: result.message});
      localStorage.setItem('toastMessages', JSON.stringify(toastMessages));
      window.location = '/process/edit/'+processStore.process.id;
    }
  });
}

function isInValidProcessName() {
  return this.pageProps.isFormSubmitted && (processStore.process.name === null);
}

function isInValidProcessCategoryName() {
  return this.pageProps.isFormSubmitted && (pageProps.selectedCategory.id === null);
}

function onFilter(event) {
  processCategoryStore.process_category.name = event.value;
}
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <div class="col-sm-6">
        <h1 class="m-0">Processes</h1>
        <Breadcrumb :model="breadCrumbs" :class="'p-0 text-sm'">
          <template #separator> <i class="pi pi-arrow-right text-sm"></i></template>
        </Breadcrumb>
      </div><!-- /.col -->
      <div class="col-sm-6 text-right pt-3">
        <a :href="route('process')" class="btn btn-sm btn-outline-secondary w-24 mr-2">Cancel</a>
        <a :href="route('process.create')" class="btn btn-sm btn-dark w-24">Save Draft</a>
      </div><!-- /.col -->
    </template>

    <div class="content-container pl-4 pr-4">

      <div class="row justify-content-md-center">
        <div class="col-md-4 col-sm-12 pr-0">
          <div class="card card-default">
            <div class="card-header border-b border-transparent">
              <h3 class="text-neutral-700 text-[28px] font-bold font-['Roboto'] leading-loose">Process Info</h3>
            </div>
            <!-- /.card-header -->
            <!-- form start -->
            <form class="form-horizontal">
              <div class="card-body pt-0">
                <div class="form-group">
                  <label for="process-name" class="font-weight-normal">Process name</label>
                  <input v-model="processStore.process.name" type="text" class="form-control form-control-md form-control-custom" id="process-name" placeholder="What do you want to call this process?" :class="{'is-invalid-custom': isInValidProcessName()}">
                  <span v-if="isInValidProcessName()" id="process-name-error" class="error invalid-feedback">This field is required</span>
                </div>

                <div class="form-group">
                  <label for="category" class="font-weight-normal">Category</label>
                  <Dropdown v-model="pageProps.selectedCategory" :options="processCategoryStore.process_categories" filter @filter="onFilter" optionLabel="name" placeholder="Select a category" class="w-full md:w-14rem form-control-custom" :class="{'is-invalid-custom': isInValidProcessCategoryName()}">
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
                          <button @click="createCategory()" class="w-100 h-[30px] px-4 py-2 rounded border border-neutral-700 justify-center items-center mx-2 my-2 text-center text-xs font-normal font-['Roboto'] leading-3" :class="{'hover:bg-neutral-700 hover:text-white': !pageProps.isLoadingCreateProcessCategory}" :disabled="pageProps.isLoadingCreateProcessCategory">
                            {{ !pageProps.isLoadingCreateProcessCategory ? 'Create new category' : 'Loading ...' }}
                          </button>
                        </div>
                      </template>
                  </Dropdown>
                  <span v-if="isInValidProcessCategoryName()" id="category-error" class="error invalid-feedback">This field is required</span>
                </div>
              </div>
              <!-- /.card-body -->
            </form>
          </div>
        </div>
        <div class="col-md-1 col-sm-12 pl-0 pr-0 place-items-center md:mt-12 md:pt-12 pr-0" style="vertical-align: middle;">
          <hr class="border-bottom bg-olive ml-0 mr-0 md:mt-9" />
        </div>
        <div class="col-md-2 col-sm-12 md:mt-12 md:pt-12 pl-0">
          <div class="btn-group-vertical btn-block">
            <button type="button" class="btn btn-md bg-olive btn-block active" @click="createProcess()">Start</button>
            <button type="button" class="btn btn-md bg-olive btn-block" @click="createProcess()" :disabled="pageProps.isLoadingCreateProcess">
              {{ !pageProps.isLoadingCreateProcess ? 'Create step' : 'Loading ...' }}
            </button>
          </div>
        </div>
      </div>

    </div>
    <Toast/>
  </AuthenticatedLayout>
</template>

<style scoped>
.p-dropdown-empty-message {
  height: 100px;
}

input.p-dropdown-filter,.p-dropdown-filter-container{
  width: 100%;
    height: calc(2.25rem + 2px);
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    box-shadow: inset 0 0 0 transparent;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}

.bg-olive:hover {
  background-color: #2e7555 !important;
  border-color: #2b6b4f;
}
/* p-dropdown-empty-message btn-md border btn-primary mt-3 m-2 */
</style>