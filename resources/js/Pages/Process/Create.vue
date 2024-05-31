<script setup>
import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import { onMounted, reactive, computed } from "vue";
import Breadcrumb from 'primevue/breadcrumb';
import Dropdown from 'primevue/dropdown';
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useProcessesStore } from "@/stores";
import { usePage } from "@inertiajs/vue3";

const toast = useToast();
const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);

const useProcessStore = useProcessesStore();
useProcessStore.init(negotium_api_url, user.value);

const props = defineProps({
  categories: Array,
  selectedCategory: String
});

const pageProps = reactive({
  isFormSubmitted: false,
  selectedCategory: { id: null, name: 'Select category', color: 'white' },
  categories: [],
  addCategoryOption: {
    id: 0,
    name: 'Create new category'
  }
});

onMounted(() => {
  // pageProps.categories.push(pageProps.addCategoryOption);
  props.categories.forEach((category) => {
    pageProps.categories.push(category);
  });
});

function clickCategory() {
 // TODO: Add category button as per the designs, to a new category
  console.log('Category clicked!!');
}

function createProcess()
{
  this.pageProps.isFormSubmitted = true;
  useProcessStore.process.process_category_id = pageProps.selectedCategory.id;
  const response = useProcessStore.create();
  response.then((result) => {
    console.log('Result: ', result);
    if(result.status === 'error') {
      toast.add({severity: 'error', summary: 'Error', detail: result.message, life: 3000});
    } else {
      toast.add({severity: 'success', summary: 'Success', detail: result.message, life: 5000});
      setTimeout(() => {
        window.location = '/step/create/'+useProcessStore.process.id;
      }, 3000);
    }
  });
}

function isInValidProcessName() {
  return this.pageProps.isFormSubmitted && (useProcessStore.process.name === null);
}

function isInValidProcessCategoryName() {
  return this.pageProps.isFormSubmitted && (useProcessStore.process.process_category_id === null);
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
        <a :href="route('process')" class="btn btn-sm btn-outline-secondary w-24 mr-2">Cancel</a>
        <a :href="route('process.create')" class="btn btn-sm btn-dark w-24">Save Draft</a>
      </div><!-- /.col -->
    </template>

    <div class="content-container pl-4 pr-4">

      <div class="row justify-content-md-center">
        <div class="col-md-4 col-sm-12 pr-0">
          <div class="card card-default">
            <div class="card-header">
              <h3 class="card-title text-bold">Process Info</h3>
            </div>
            <!-- /.card-header -->
            <!-- form start -->
            <form class="form-horizontal">
              <div class="card-body">
                <div class="form-group">
                  <label for="process-name" class="font-weight-normal">Process name</label>
                  <input v-model="useProcessStore.process.name" type="text" class="form-control form-control-md form-control-custom" id="process-name" placeholder="What do you want to call this process?" :class="{'is-invalid-custom': isInValidProcessName()}">
                  <span v-if="isInValidProcessName()" id="process-name-error" class="error invalid-feedback">This field is required</span>
                </div>

                <div class="form-group">
                  <label for="category" class="font-weight-normal">Category</label>
                  <Dropdown @click="clickCategory()" v-model="pageProps.selectedCategory" :options="pageProps.categories" filter optionLabel="category" placeholder="Select a category" class="w-full md:w-14rem form-control-custom" :class="{'is-invalid-custom': isInValidProcessCategoryName()}">
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
                        <span>{{ slotProps.option.name }}</span>
                        <i class="fa fa-square float-right" :style="'color: '+slotProps.option.color"></i>
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
            <button type="button" class="btn btn-md bg-olive btn-block active">Start</button>
            <button type="button" class="btn btn-md bg-olive btn-block" @click="createProcess()">Create Step</button>
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

.bg-olive:hover {
  background-color: #2e7555 !important;
  border-color: #2b6b4f;
}
/* p-dropdown-empty-message btn-md border btn-primary mt-3 m-2 */
</style>