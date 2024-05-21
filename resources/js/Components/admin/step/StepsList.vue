<script setup>
import {computed, reactive} from "vue";
import ConfirmDialog from "primevue/confirmdialog";
import Toast from "primevue/toast";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import axios from "axios";
import { usePage} from "@inertiajs/vue3";
import { useStepsStore, useActivitiesStore } from "@/stores";

const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);

const toast = useToast();
const confirm = useConfirm();
const stepsStore = useStepsStore();
const activitiesStore = useActivitiesStore();
activitiesStore.init(negotium_api_url, user);
const pageProps = reactive({
  selectedID: 0,
  profile: Object
});

function selectStep(step)
{
  stepsStore.selectStep(step);
  activitiesStore.fetchActities(step.id);
  activitiesStore.step = step;
}

function deleteStep(id)
{
  const _id = id;
  confirm.require({
    message: 'Are you sure you want to delete this item?',
    header: 'Delete Item',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    accept: () => {
      stepsStore.delete(_id);
    },
  });
}
</script>

<template>
  <div class="card col-md-3" v-if="stepsStore.isEdit">
    <div class="card-header">
      <span class="left-heading">Profile Creator</span>
      <span v-if="stepsStore.isEdit" class="float-right"><a :href="route('profile-manager')">
        <i class="pi pi-arrow-left"></i>
      </a></span>
      <div class="mt-2">
        <small>Profile name</small>
        <p><small class="font-weight-bold">{{ stepsStore.profile.name }}</small></p>
      </div>
    </div>
    <div class="card-body table-responsive table-hover" v-if="(stepsStore.steps.length > 0) == false">
      <div class="col-md-12">
        No steps found
      </div>
    </div>
    <div class="card-body table-responsive table-hover" v-if="stepsStore.steps.length > 0">
      <div v-for="step in stepsStore.steps" class="row profile-types">
        <div class="col-md-8" v-on:click="selectStep(step)">
          {{ step.name }}
        </div>
        <div class="col-md-4 text-right align-middle">
          <a @click="deleteStep(step.id)" label="Save" outlined>
            <i class="pi pi-times"></i>
          </a>
        </div>
      </div>
    </div>

  </div>

  <ConfirmDialog></ConfirmDialog>
  <Toast />
</template>

<style scoped>
  .left-heading {
    /* font-family: Roboto; */
    font-size: 18px;
    font-weight: 550;
    text-align: left;
  }

  .profile-types {
    border: 1px solid #DADADA;
    border-radius: 4px;
    margin-bottom: 7px;
    padding: 7px;
  }

  .profile-types:hover {
    background-color: #DADADA;
    opacity: 0.4;
    cursor: pointer;
  }

  .is-edit-profile {
    background-color: #8FADB7;
    opacity: 0.8;
    cursor: pointer;
  }
</style>