<script setup>
// Define all imports here
import { useProcessesStore, useStepsStore, useActivityGroupsStore, useActivitiesStore } from "@/stores";
import { computed, onMounted, reactive } from "vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { usePage } from "@inertiajs/vue3";
import ActivityFormFactory from "@/Pages/Process/Partials/ActivityFormFactory.vue";

// Define all the use statements here
const activityStore = useActivitiesStore();
const processStore = useProcessesStore();
const stepStore = useStepsStore();
const activityGroupStore = useActivityGroupsStore();
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
  stepStore.step.model_id = props.model_id;
  stepStore.step.parent_id = processStore.process.id;
  processStore.init(negotium_api_url, user);
  activityStore.init(negotium_api_url, user);
});

function isInValidStepName() {
  return pageProps.isFormSubmitted && (stepStore.step.name === '');
}

async function createActivity() {
  pageProps.isFormSubmitted = true;

  const response = await activityStore.create(stepStore.step.id);

  if(response.code === 201) {
    toast.add({severity: response.status, summary: 'Success', detail: response.message, life: 3000});
    const processResponse = processStore.get(processStore.process.id, null, 'with=category,steps.activities');
  } else if (response.code === 422) {
    toast.add({severity: response.status, summary: 'Error', detail: 'Please check all required fields', life: 3000});
  } else {
    toast.add({severity: response.status, summary: 'Error', detail: response.message, life: 3000});
  }
}

function setActivityGroup(activity_group){
  activityGroupStore.setActivityGroup(activity_group);
  activityStore.clearForm();
}
function setActivityType(activity_type) {
  activityGroupStore.setActivityType(activity_type);
  activityStore.clearForm();
  activityStore.activity.type_id = activity_type.id;
}

function enableSubmit() {
  return (activityStore.activity.name !== '') &&
        (activityStore.activity.label !== '') &&
        (activityStore.activity.step_id > 0) &&
        (activityStore.activity.type_id > 0);
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
          <div class="form-group mb-0">
            <label for="step-name" class="mb-0">New Activity</label>
            <button v-if="activityStore.activity.type_id > 0 && !activityStore.showGuidanceNote" type="button" @click="activityStore.setGuidanceNote(true)" class="float-right font-weight-normal negotium-primary disabled:opacity-50 disabled:cursor-not-allowed">+ Add guidance note</button>
            <button v-if="activityStore.activity.type_id > 0 && activityStore.showGuidanceNote" type="button" @click="activityStore.setGuidanceNote(false)" class="float-right font-weight-normal negotium-red disabled:opacity-50 disabled:cursor-not-allowed"><span class="red">Remove note</span></button>
          </div>
          <p class="mt-3 mb-1 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Select activity type</p>
          <div class="btn-group btn-group-toggle w-100" data-toggle="buttons">
            <label class="btn btn-sm btn-secondary" :class="{ 'active': activityGroupStore.getActivityGroup().id === activity_group.id }" @click="setActivityGroup(activity_group)" v-for="(activity_group, index) in activityGroupStore.getActivityGroups()" :key="index">
              <input type="radio" name="options" :id="'option_'+activity_group.id" autocomplete="off"> {{ activity_group.name }}
            </label>
          </div>
          <p v-if="activityGroupStore.isSetActivityGroup" class="mt-3 mb-1 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Select <span class="font-weight-bold">user input</span></p>
          <div v-if="activityGroupStore.isSetActivityGroup" class="btn-group btn-group-toggle w-100" data-toggle="buttons">
            <label class="btn btn-sm btn-secondary" :class="{ 'active': activityGroupStore.getActivityType().id === activity_type.id }" @click="setActivityType(activity_type)" v-for="(activity_type, index) in activityGroupStore.getActivityTypesByActivityGroup()" :key="index">
              <input type="radio" name="options" :id="'option_'+activity_type.id" autocomplete="off"> {{ activity_type.name }}
            </label>
          </div>
          <activity-form-factory></activity-form-factory>
        </div>
        <!-- /.card-body -->
        <div class="card-footer">
          <button @click="activityStore.resetActivity()" type="button" class="h-[38px] p-3 bg-white rounded border border-neutral-700 justify-center items-center gap-2 inline-flex ml-2 disabled:opacity-50 disabled:cursor-not-allowed">
            Cancel
          </button>
          <button type="button" class="float-right h-[38px] p-3 bg-white rounded border border-neutral-700 justify-center items-center gap-2 inline-flex ml-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            <i class="add-title mr-1"></i>
            <span class="text-blue-400 text-xs font-medium font-['Roboto'] leading-[14px]">Add Title</span>
          </button>
          <button @click="createActivity()" type="button" class="float-right h-[38px] p-3 bg-white rounded border border-neutral-700 justify-center items-center gap-2 inline-flex disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!enableSubmit() || processStore.loading">
            <i class="add-activity mr-1"></i>
            <span class="text-emerald-400 text-xs font-medium font-['Roboto'] leading-[14px]" v-if="!processStore.loading">Add Activity</span>
            <span class="text-emerald-400 text-xs font-medium font-['Roboto'] leading-[14px]" v-if="processStore.loading">Loading ...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
  <Toast/>
</template>