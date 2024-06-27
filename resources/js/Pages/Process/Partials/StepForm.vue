<script setup>
// Define all imports here
import { useFactoryWorkerStore, useProcessesStore, useStepsStore } from "@/stores";
import { ApiHelper } from "@/helpers";
import { computed, onMounted, reactive } from "vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { usePage } from "@inertiajs/vue3";

// Define all the use statements here
const processStore = useProcessesStore();
const stepStore = useStepsStore();
const factoryWorkerStore = useFactoryWorkerStore();
const toast = useToast();

// Pass by referenceform
let form = factoryWorkerStore.getForm(factoryWorkerStore.STEP_FORM);

// Define all constants here
const props = defineProps({
  model_id: 0
});
const pageProps = reactive({
  isFormSubmitted: false
});
const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);
const apiHelper = new ApiHelper(negotium_api_url.value, user.value, factoryWorkerStore.STEP_FORM);

// Define all functions here
onMounted(() => {
  form.input.model_id = props.model_id;
  form.input.parent_id = factoryWorkerStore.process.id;;
  // processStore.init(negotium_api_url, user);
});

function createStep()
{
  if(!form.validate()) {
    form.validationErrors().forEach((error) => {
      toast.add({severity: 'error', summary: 'Error', detail: error, life: 3000});
    });
  } else {
    const response = apiHelper.create(form.get(factoryWorkerStore.STEP_FORM));

    response.then((result) => {
      if(result.status === 'error') {
        toast.add({severity: 'error', summary: 'Error', detail: result.message, life: 3000});
      } else {
        toast.add({severity: 'success', summary: 'Success', detail: result.message, life: 3000});
        factoryWorkerStore.setActiveForm(factoryWorkerStore.ACTIVITY_FORM)
        // processStore.fetchProcesses(processStore.process.id);
        // this.isDoneLoadingProcessStore(result, setStep);
      }
    });
  }
  /*
  pageProps.isFormSubmitted = true;
  const response = stepStore.create();
  response.then((result) => {
    if(result.status === 'error') {
      toast.add({severity: 'error', summary: 'Error', detail: result.message, life: 3000});
    } else {
      toast.add({severity: 'success', summary: 'Success', detail: result.message, life: 3000});

      processStore.fetchProcesses(processStore.process.id);
      this.isDoneLoadingProcessStore(result, setStep);
    }
  });
  */
}

// Wait for the loading on the process to be set to true before calling the setStep
function isDoneLoadingProcessStore(result = null, callback = null) {
  const checkCondition = () => {
      if (processStore.loading) {
        setTimeout(checkCondition, 100); // Check the condition every 100ms
      } else {
        callback(result);
      }
  };
  checkCondition();
}

</script>

<template>
  <div class="col-md-3 col-sm-12 pl-0 pr-0">
    <div class="card card-default">
      <div class="card-header">
        <h3 class="card-title text-bold">Step</h3><br/>
      </div>
      <!-- /.card-header -->
      <!-- form start -->
      <form class="form-horizontal">
        <div class="card-body">
          <div class="form-group">
            <label for="step-name" class="font-weight-normal">Step Name</label>
            <input v-model="form.input.name" type="text" class="form-control form-control-md form-control-custom" id="process-name" placeholder="What do you want to call this step?" :class="{'is-invalid-custom': form.isInValid('name')}" required>
            <span v-if="form.isInValid('name')" id="process-name-error" class="error invalid-feedback">This field is required</span>
          </div>
        </div>
        <!-- /.card-body -->
        <div class="card-footer">
          <button @click="createStep()" type="button" class="float-right h-[38px] p-3 bg-white rounded border border-neutral-700 justify-center items-center gap-2 inline-flex ml-2 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="stepStore.loading">
            <i class="add-title mr-1"></i>
            <span class="text-blue-400 text-xs font-medium font-['Roboto'] leading-[14px]">Add Title</span>
          </button>
          <button type="button" class="float-right h-[38px] p-3 bg-white rounded border border-neutral-700 justify-center items-center gap-2 inline-flex disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            <i class="add-activity mr-1"></i>
            <span class="text-emerald-400 text-xs font-medium font-['Roboto'] leading-[14px]">Add Activity</span>
          </button>
        </div>
      </form>
    </div>
  </div>
  <Toast/>
</template>