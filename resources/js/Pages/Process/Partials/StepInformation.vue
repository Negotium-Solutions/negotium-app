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
        <div class="mb-2 text-neutral-700 text-[1.25rem] font-bold font-['Roboto'] leading-loose">Step</div>
        <div>
          <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Step Name</div>
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
        <div class="card-footer w-100 px-8 py-4 bg-zinc-100 border-l border-r border-b border-zinc-300">
          <button @click="showForm(globalsStore.STEP_FORM)" type="button" class="float-right h-[38px] p-3 bg-white rounded border border-neutral-700 justify-center items-center gap-2 inline-flex ml-2">
            <i class="add-title mr-1"></i>
            <span class="text-blue-400 text-xs font-medium font-['Roboto'] leading-[14px]">Add Step</span>
          </button>
          <button @click="showForm(globalsStore.ACTIVITY_FORM)" type="button" class="float-right h-[38px] p-3 bg-white rounded border border-neutral-700 justify-center items-center gap-2 inline-flex">
            <i class="add-activity mr-1"></i>
            <span class="text-emerald-400 text-xs font-medium font-['Roboto'] leading-[14px]">Add Activity</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>