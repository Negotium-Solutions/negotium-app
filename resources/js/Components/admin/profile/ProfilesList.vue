<script setup>
import {computed, reactive} from "vue";
import ConfirmDialog from "primevue/confirmdialog";
import Toast from "primevue/toast";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import axios from "axios";
import {router, usePage} from "@inertiajs/vue3";
import { useStepsStore } from "@/stores";

const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);

const toast = useToast();
const confirm = useConfirm();
const stepsStore = useStepsStore();
defineProps({
  profileTypes: {
    type: Array,
  }
});

const pageProps = reactive({
  selectedID: 0
});

function selectProfileType(profile)
{
  this.pageProps.selectedID = profile.id;
  let steps = stepsStore.fetchSteps(profile.id);
  stepsStore.setEdit(true);
  stepsStore.setProfile(profile);
  console.log('steps', steps);
}

function deleteModelType(id)
{
  const _id = id;
  confirm.require({
    message: 'Are you sure you want to delete this item?',
    header: 'Delete Item',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    accept: () => {
      deleteProfileType(_id);
    },
  });
}

async function deleteProfileType(id)
{
  try {
    let response = await axios.delete(negotium_api_url.value + '/' + user.value.tenant + '/client-type/delete/' + id, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ` + user.value.token,
      },
    });

    if(response.status === 204 ) {
      toast.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Item successfully deleted',
      });
      router.get('/profile-manager'); // TODO: Use loadsh to remove the item rather that reloading the page
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error!',
      detail: error.response.statusText,
    })
  }
}
</script>

<template>
  <div class="card col-md-3" v-if="!false">
    <div class="card-header">
      <span class="left-heading">Profile Creator</span>
    </div>
    <div class="card-body table-responsive table-hover">
      <div v-for="(profileType, index) in profileTypes" class="row profile-types" :class="{ 'is-edit-profile': pageProps.selectedID === profileType.id }">
        <div class="col-md-8" @click="selectProfileType(profileType)">
          {{ profileType.name }}
        </div>
        <div class="col-md-4 text-right align-middle">
          <a @click="deleteModelType(profileType.id)" label="Save" outlined>
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