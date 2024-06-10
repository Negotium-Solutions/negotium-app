<script setup>
// Define all imports here
import { useGlobalsStore, useProcessesStore, useStepsStore } from "@/stores";
import { onMounted, reactive } from "vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

// Define all the use statements here
const useProcessStore = useProcessesStore();
const stepStore = useStepsStore();
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

// Define all functions here
onMounted(() => {
  stepStore.step.model_id = props.model_id;
  stepStore.step.parent_id = useProcessStore.process.id;
});

function showForm(form_id)
{
  globalsStore.activeForm = form_id;
}
</script>

<template>
  <div class="col-md-4 col-sm-12 pl-0 pr-0">
    <div class="card card-default">
      <div class="card-header">
        <h3 class="card-title text-bold">Step</h3><br/>
        <div>
          <p class="text-sm mt-2">Step Name</p>
          <p class="text-bold">
            {{ stepStore.step.name }} <i class="pi pi-file-edit float-right"></i>
          </p>

        </div>
      </div>
      <!-- /.card-header -->
      <!-- form start -->
      <form class="form-horizontal">
        <div class="card-body">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <!-- /.card-body -->
        <div class="card-footer">
          <button @click="showForm(globalsStore.STEP_FORM)" type="button" class="btn btn-sm btn-default float-right mr-2"><i class="pi pi-microchip mr-1"></i> Add Step</button>
          <button @click="showForm(globalsStore.ACTIVITY_FORM)" type="button" class="btn btn-sm btn-default float-right mr-2"><i class="pi pi-microchip-ai mr-1"></i> Add Activity</button>
        </div>
      </form>
    </div>
  </div>
</template>