<script setup>
// Define all imports here
import { useGlobalsStore, useProcessesStore, useStepsStore, useActivityGroupsStore, useActivitiesStore } from "@/stores";
import {computed, onMounted, reactive} from "vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { usePage } from "@inertiajs/vue3";

// Define all the use statements here
const activityStore = useActivitiesStore();
const processStore = useProcessesStore();
const stepStore = useStepsStore();
const globalsStore = useGlobalsStore();
const activityGroupsStore = useActivityGroupsStore();
const toast = useToast();

// Define all constants here
const props = defineProps({
  process: {},
  model_id: 0
});
const pageProps = reactive({
  isFormSubmitted: false,
  isShowGuidanceNote: false
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

function createActivity() {
  pageProps.isFormSubmitted = true;
  // const response = activityStore.fetch(stepStore.step.id);
  const response = activityStore.create();

  response.then((result) => {
    console.log('result: ', result);
    if(result.status === 'error') {
      toast.add({severity: 'error', summary: 'Error', detail: result.message, life: 3000});
    } else {
      toast.add({severity: 'success', summary: 'Success', detail: result.message, life: 3000});
      processStore.fetchProcesses(processStore.process.id);
    }
  });
}

function showGuidnanceNote() {
  this.pageProps.isShowGuidanceNote = true;
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
            <button type="button" @click="showGuidnanceNote()" class="float-right font-weight-normal negotium-primary disabled:opacity-50 disabled:cursor-not-allowed" :disabled="pageProps.isShowGuidanceNote">+ Add guidance note</button>
          </div>
          <p class="mt-3 mb-1 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Select activity type</p>
          <div class="btn-group btn-group-toggle w-100" data-toggle="buttons">
            <label class="btn btn-sm btn-secondary" :class="{ 'active': activityGroupsStore.getActivityGroup === activity_group.id }" @click="activityGroupsStore.setActivityGroup(activity_group.id)" v-for="(activity_group, index) in activityGroupsStore.getActivityGroups" :key="index">
              <input type="radio" name="options" :id="'option_'+activity_group.id" autocomplete="off"> {{ activity_group.name }}
            </label>
          </div>
          <p class="mt-3 mb-1 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Select <span class="font-weight-bold">user input</span></p>
          <div class="btn-group btn-group-toggle w-100" data-toggle="buttons">
            <label class="btn btn-sm btn-secondary" :class="{ 'active': activityGroupsStore.getActivityType === activity_type.id }" @click="activityGroupsStore.setActivityType(activity_type.id)" v-for="(activity_type, at_index) in activityGroupsStore.getActivityTypesByActivityGroup" :key="at_index">
              <input type="radio" name="options" :id="'option_'+activity_type.id" autocomplete="off"> {{ activity_type.name }}
            </label>
          </div>

          <form class="mt-3">
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group">
                  <label class="text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Activity Name</label>
                  <input type="text" v-model="activityStore.activity.name" class="form-control form-control-custom" placeholder="Name">
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <label class="text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Activity Label</label>
                  <input type="text" v-model="activityStore.activity.label" class="form-control form-control-custom" placeholder="Label">
                </div>
              </div>
            </div>
            <div class="form-group" v-if="pageProps.isShowGuidanceNote">
              <label class="text-neutral-700 text-xs font-normal font-['Nunito'] leading-3" for="inputWarning">Guidance note</label>
              <input type="text"  v-model="activityStore.activity.guidance_note" class="form-control form-control-custom" id="inputWarning" placeholder="Type the guidance note">
            </div>
          </form>

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
          <button @click="createActivity()" type="button" class="float-right h-[38px] p-3 bg-white rounded border border-neutral-700 justify-center items-center gap-2 inline-flex disabled:opacity-50 disabled:cursor-not-allowed">
            <i class="add-activity mr-1"></i>
            <span class="text-emerald-400 text-xs font-medium font-['Roboto'] leading-[14px]">Add Activity</span>
          </button>
        </div>
      </form>
    </div>
  </div>
  <Toast/>
</template>