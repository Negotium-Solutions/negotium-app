<script setup>
// Define all imports here
import { useGlobalsStore, useProcessesStore, useStepsStore, useActivityGroupsStore } from "@/stores";
import {computed, onMounted, reactive} from "vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { usePage } from "@inertiajs/vue3";

// Define all the use statements here
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
});

function isInValidStepName() {
  return pageProps.isFormSubmitted && (stepStore.step.name === '');
}

function createActivity()
{
  this.pageProps.isFormSubmitted = true;
  const response = stepStore.create();
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
                  <input type="text" class="form-control form-control-custom" placeholder="Name">
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <label class="text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Activity Label</label>
                  <input type="text" class="form-control form-control-custom" placeholder="Label">
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="text-neutral-700 text-xs font-normal font-['Nunito'] leading-3" for="inputWarning">Guidance note</label>
              <input type="text" class="form-control form-control-custom" id="inputWarning" placeholder="Type the guidance note">
            </div>
          </form>

        </div>
        <!-- /.card-body -->
        <div class="card-footer">
          <button @click="globalsStore.cancel()" type="button" class="btn btn-sm btn-outline-light"><i class="pi pi-times mr-1 mt-1"></i> Cancel</button>
          <button @click="createActivity()" type="button" class="btn btn-sm btn-default float-right mr-2"><i class="pi pi-save mr-1"></i> Save</button>
        </div>
      </form>
    </div>
  </div>
  <Toast/>
</template>