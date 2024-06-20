<script setup>
// Imports
import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import {onMounted, reactive, computed, ref} from "vue";
import Breadcrumb from 'primevue/breadcrumb';
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useProcessesStore, useStepsStore, useGlobalsStore, useActivityGroupsStore } from "@/stores";
import { usePage } from "@inertiajs/vue3";
import ProcessInformation from "@/Pages/Process/Partials/ProcessInformation.vue";
import StepInformation from "@/Pages/Process/Partials/StepInformation.vue";
import HorizontalLine from "@/Pages/Process/Partials/HorizontalLine.vue";
import StepForm from "@/Pages/Process/Partials/StepForm.vue";
import DecisionSteps from "@/Pages/Process/Partials/decisionSteps.vue";
import ActivityForm from "@/Pages/Process/Partials/ActivityForm.vue";

// Use statements
const stepStore = useStepsStore();
const processStore = useProcessesStore();
const globalsStore = useGlobalsStore();
const activityGroupsStore = useActivityGroupsStore();

// Constants
const toast = useToast();
const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);
const props = defineProps({
  process: {},
  model_id: null,
  parent_id: null,
  step_id: 0,
  activity_groups: {}
});
const pageProps = reactive({
  activiveForm: null
});

const breadcrumbItems = ref([
  { label: 'Process Information' },
  { label: 'Step & Activities', class: 'active font-semibold' }
]);

// Initialise objects
processStore.process = props.process;

// Functions
onMounted(() => {
  stepStore.init(negotium_api_url, user.value);
  stepStore.step.model_id = props.model_id;
  stepStore.steps = props.process.steps;
  activityGroupsStore.setActivityGroups(props.activity_groups);
});
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <div class="col-sm-6">
        <h1 class="m-0">Processes</h1>
        <Breadcrumb :model="breadcrumbItems" :class="'p-0 text-sm'">
          <template #separator> <i class="pi pi-arrow-right text-sm"></i></template>
        </Breadcrumb>
      </div><!-- /.col -->
      <div class="col-sm-6 text-right pt-2 pt-sm-3 pt-md-3 pt-lg-3 pt-xl-3">
        <a :href="route('process')" class="px-4 py-2 rounded border border-neutral-700 justify-center items-center border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Cancel</a>
        <a :href="route('process.create')" class="ml-2 px-4 py-2 bg-neutral-700 rounded border border-neutral-700 justify-center items-center text-white">Save Draft</a>
      </div><!-- /.col -->
    </template>

    <div class="content-container pl-4 pr-4">

      <div class="row">
        <process-information :process="processStore.process" :step_id="props.step_id"></process-information>
        <horizontal-line></horizontal-line>
        <step-form v-if="globalsStore.getActiveForm === globalsStore.STEP_FORM" :model_id="props.model_id" :process="processStore.process"></step-form>
        <activity-form v-if="globalsStore.getActiveForm === globalsStore.ACTIVITY_FORM" :model_id="props.model_id" :process="processStore.process"></activity-form>
        <step-information v-if="globalsStore.getActiveForm === globalsStore.STEP_INFORMATION" :model_id="props.model_id" :process="processStore.process"></step-information>
        <horizontal-line class="md:mt-16 md:pt-16"></horizontal-line>
        <decision-steps></decision-steps>
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