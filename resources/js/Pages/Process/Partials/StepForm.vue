<script setup>
// Define all imports here
import { useGlobalsStore, useProcessesStore, useStepsStore } from "@/stores";
import { computed, onMounted, reactive } from "vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { usePage } from "@inertiajs/vue3";

// Define all the use statements here
const processStore = useProcessesStore();
const useStepStore = useStepsStore();
const globalsStore = useGlobalsStore();
const toast = useToast();

// Define all constants here
const props = defineProps({
  process: {},
  model_id: 0
});
const pageProps = reactive({
  isFormSubmitted: false
});
const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);

// Define all functions here
onMounted(() => {
  useStepStore.step.model_id = props.model_id;
  useStepStore.step.parent_id = processStore.process.id;
  processStore.init(negotium_api_url, user);
});

function isInValidStepName() {
  return pageProps.isFormSubmitted && (useStepStore.step.name === '');
}

function createStep()
{
  pageProps.isFormSubmitted = true;
  const response = useStepStore.create();
  response.then((result) => {
    if(result.status === 'error') {
      toast.add({severity: 'error', summary: 'Error', detail: result.message, life: 3000});
    } else {
      toast.add({severity: 'success', summary: 'Success', detail: result.message, life: 3000});
      processStore.fetchProcesses(processStore.process.id);
    }
  });
}
</script>

<template>
  <div class="col-md-4 col-sm-12 pl-0 pr-0">
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
            <input v-model="useStepStore.step.name" type="text" class="form-control form-control-md form-control-custom" id="process-name" placeholder="What do you want to call this step?" :class="{'is-invalid-custom': isInValidStepName()}">
            <span v-if="isInValidStepName()" id="process-name-error" class="error invalid-feedback">This field is required</span>
          </div>
        </div>
        <!-- /.card-body -->
        <div class="card-footer">
          <button @click="globalsStore.cancel()" class="btn btn-sm btn-outline-light"><i class="pi pi-times mr-1 mt-1"></i> Cancel</button>
          <button @click="createStep()" type="button" class="btn btn-sm btn-default float-right mr-2"><i class="pi pi-save mr-1"></i> Save</button>
        </div>
      </form>
    </div>
  </div>
  <Toast/>
</template>