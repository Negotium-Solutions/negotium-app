<script setup>
import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import { onMounted, reactive, computed } from "vue";
import Breadcrumb from 'primevue/breadcrumb';
import Dropdown from 'primevue/dropdown';
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useStepsStore } from "@/stores";
import { usePage } from "@inertiajs/vue3";

const toast = useToast();
const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);

const useStepStore = useStepsStore();
useStepStore.init(negotium_api_url, user.value);

const props = defineProps({
  process: {},
  model_id: null,
  parent_id: null
});

const pageProps = reactive({
  isFormSubmitted: false,
  step: { id: null, name: null, parent_id: null, order: null, model_id: 1 },
  isStepEdit: false,
  selectedStep: 0
});

onMounted(() => {
  useStepStore.step.model_id = props.model_id;
  useStepStore.steps = props.process.steps;
});

function createStep()
{
  this.pageProps.isFormSubmitted = true;
  useStepsStore.step.parent_id = props.parent_id;
  const response = useStepStore.create();
  response.then((result) => {
    console.log('Result: ', result);
    if(result.status === 'error') {
      toast.add({severity: 'error', summary: 'Error', detail: result.message, life: 3000});
    } else {
      toast.add({severity: 'success', summary: 'Success', detail: result.message, life: 3000});
    }
  });
}

function isInValidStepName() {
  return this.pageProps.isFormSubmitted && (useStepStore.process.name === null);
}

function selectStep(step) {
  useStepStore.step = step;
  pageProps.isStepEdit = false;
  pageProps.selectedStep = step.id;
}

function editStep() {
  pageProps.isStepEdit = true;
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

      <div class="row">
        <div class="col-md-3 col-sm-12 pr-0">
          <div class="card card-default">
            <div class="card-header">
              <h3 class="card-title text-bold">Process Information</h3>
            </div>
            <!-- /.card-header -->
            <!-- form start -->
            <form class="form-horizontal">
              <div class="card-body">
                <div class="mb-2">
                  <label for="step-name" class="font-weight-normal mb-0 gray"><small>Process name</small></label>
                  <p class="font-weight-bold mt-0">{{ props.process.name }}</p>
                </div>
                <div class="mb-1">
                  <label for="step-name" class="font-weight-normal mb-0 gray"><small>Category</small></label>
                  <p class="font-weight-bold mt-0">{{ props.process.category.name }}</p>
                </div>
                <div class="mt-3">
                  <hr/>
                </div>
                <div class="mt-3">
                  <label for="steps" class="font-weight-normal mb-0 gray"><small>Process Steps</small></label>
                </div>
                <div>
                  <button @click="selectStep(step)" v-for="(step, index) in useStepStore.steps" :key="index" type="button" class="btn btn-sm btn-outline-dark w-100 m-1"  :class="{ active : pageProps.selectedStep === step.id }">
                    {{ step.name }}
                  </button>
                </div>
              </div>
              <!-- /.card-body -->
            </form>
          </div>
        </div>
        <div class="col-md-1 col-sm-12 pl-0 pr-0 place-items-center md:mt-7 md:pt-0 pr-0">
          <hr class="border-bottom bg-olive ml-0 mr-0 md:mt-0" />
        </div>
        <div class="col-md-4 col-sm-12 pl-0 pr-0">
          <div class="card card-default">
            <div class="card-header">
              <h3 class="card-title text-bold">Step</h3><br/>
              <div v-if="useStepStore.step.name !== null" class="">
                <label for="step-name" class="font-weight-normal mb-0"><small>Step name</small></label>
                <div class="row" v-if="pageProps.isStepEdit === false">
                  <div class="col-md-10">
                    <p class="mt-0 text-bold">{{ useStepStore.step.name }}</p>
                  </div>
                  <div class="col-md-2 text-right">
                    <a @click="editStep()"><i class="pi pi-file-edit"></i></a>
                  </div>
                </div>
                <div class="row" v-if="pageProps.isStepEdit">
                  <div class="col-md-12">
                    <input v-model="useStepStore.step.name" type="text" class="form-control form-control-md form-control-custom" id="process-name" placeholder="What do you want to call this step?" :class="{'is-invalid-custom': isInValidStepName()}">
                  </div>
                </div>
              </div>
            </div>
            <!-- /.card-header -->
            <!-- form start -->
            <form class="form-horizontal">
              <div class="card-body">

                <div class="form-group">
                  <label for="step-name" class="font-weight-normal">Title</label>
                  <input v-model="useStepStore.step.title" type="text" class="form-control form-control-md form-control-custom" id="process-name" placeholder="What do you want to call this step?" :class="{'is-invalid-custom': isInValidStepName()}">
                </div>

              </div>
              <!-- /.card-body -->
              <div class="card-footer">
                <button type="submit" class="btn btn-outline-light">Cancel</button>
                <button type="submit" class="btn btn-default float-right">Add Activity</button>
              </div>
            </form>
          </div>
        </div>
        <div class="col-md-1 col-sm-12 pl-0 pr-0 place-items-center md:mt-12 md:pt-12 pr-0" style="vertical-align: middle;">
          <hr class="border-bottom bg-olive ml-0 mr-0 md:mt-9" />
        </div>
        <div class="col-md-2 col-sm-12 md:mt-7 md:pt-12 pl-0">
          <div class="btn-group-vertical btn-block">
            <button type="button" class="btn btn-md btn-outline-light btn-block">Add Standard Step</button>
            <button type="button" class="btn btn-md btn-outline-light btn-block" @click="">Add decision step</button>
            <button type="button" class="btn btn-md btn-outline-light btn-block" @click="">End process</button>
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