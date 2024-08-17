<script setup>

import ExtendProfileLayout from "@/Pages/Profile/ProfileLayout.vue";
import { onMounted } from "vue";
import { useProfilesManagerStore, useProfileProcessStore } from "@/stores";
import { FunctionsHelper } from "@/helpers";
import Dialog from "primevue/dialog";
import CategoryFilter from "@/Pages/Profile/Partials/CategoryFilter.vue";
import ProcessBlock from "@/Pages/Profile/Partials/ProcessBlock.vue";
import NegotiumButton from "@/Components/negotium/Button.vue";
import { useToast } from "primevue/usetoast";

const profileManagerStore = useProfilesManagerStore();
const profileProcessStore = useProfileProcessStore();
const toast = useToast();

const props = defineProps({
  profileTypeId: 0,
  profileTypes: Array,
  profile: Object,
  apiUrl: String,
  apiImagesUrl: String,
  navigation: String,
  lookup: null
});

onMounted(() => {
  // Get selected profile type
  const profileType = props.profileTypes.filter((item) => parseInt(item.id) === parseInt(props.profileTypeId))[0];
  profileManagerStore.set('profileTypes', props.profileTypes);
  profileManagerStore.set('profileType', profileType);
  profileManagerStore.set('profiles', profileType.profiles);
  profileManagerStore.set('profile', props.profile);
  profileManagerStore.set('processes', props.profile.processes);
  profileManagerStore.set('apiUrl', props.apiUrl);
  profileManagerStore.set('apiImagesUrl', props.apiImagesUrl);
  profileManagerStore.set('navigation', props.navigation);
  profileManagerStore.setLookUp('processes', props.lookup.processes);
  profileManagerStore.setLookUp('processCategories', props.lookup.processCategories);
});

function ShowAssignProcess() {
  profileProcessStore.showProcessModal = true;
}

function assignProcess() {
  profileProcessStore.assignProcesses(toast, profileManagerStore.getProfileName(profileManagerStore.profile));
}

</script>

<template>
  <ExtendProfileLayout>
    <div v-if="profileManagerStore.isSelected('profile', profileManagerStore.profile)" class="col-lg-12 pl-0 pr-0">
      <div class="d-flex w-100 pt-3 pl-2 pr-2 pb-3">
        <div class="col-sm-6">
          <h1 class="text-neutral-700 text-3xl font-bold font-['Roboto']">Processes</h1>
        </div>
        <div class="col-sm-6 text-right">
          <button @click="ShowAssignProcess()" class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Assign Process</button>
        </div>
      </div>
      <div class="col-md-12 pl-2 pr-2">
        <table v-if="profileManagerStore.processes.length > 0" class="table-sm w-100 table-row-spacing table-bg">
          <tr>
            <th>Select</th><th>Process Name</th><th>Current Posistion</th><th>Last Opened</th><th>Date Added</th><th>Actions</th>
          </tr>
          <tr v-for="(process, index) in profileManagerStore.processes" :key="index" :class="{ 'bg-gray-200': profileManagerStore.isSelected('process', process)}">
            <td><input type="checkbox"></td>
            <td>{{ process.name }}</td>
            <td>{{ process.log.step.name }}</td>
            <td>{{ FunctionsHelper.DateTime(process.log.updated_at) }}</td>
            <td>{{ FunctionsHelper.DateTime(process.log.created_at) }}</td>
            <td class="last pl-2">
              <div class="d-flex">
                <button class="flex justify-center py-2 px-3 text-xs leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">View</button>
                <div class="flex flex-col items-center pl-2">
                  <button @click="profileManagerStore.set('process', process)" type="button" data-toggle="dropdown" class="w-[30px] h-[30px] bg-[#dae3e7] rounded justify-center items-center gap-1 inline-flex">
                    <i class="pi pi-ellipsis-v"></i>
                  </button>
                  <div class="dropdown-menu dropdown-menu dropdown-menu-right">
                    <a class="dropdown-item cursor-pointer">
                      <small>View Process</small>
                    </a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item cursor-pointer">
                      <small>Details</small>
                    </a>
                    <div class="dropdown-divider"></div>
                    <a v-if="process.log.status.name === 'stopped'" class="dropdown-item cursor-pointer" @click="showProcessConfirmation(process, process.log.id, profileProcessStore.PROCESS_STATUS_ACTIVE, 'Resume', resume_process_confirmation, success_resuming_process, error_resuming_process)">
                      <small>Resume</small>
                    </a>
                    <a v-if="process.log.status.name === 'active'" class="dropdown-item cursor-pointer" @click="showProcessConfirmation(process, process.log.id, profileProcessStore.PROCESS_STATUS_STOPPED, 'Stop', stop_process_confirmation, success_stopping_process, error_stopping_process)">
                      <small>Stop</small>
                    </a>
                    <a v-if="process.log.status.name === 'assigned'" class="dropdown-item" @click="showProcessConfirmation(process, process.log.id, profileProcessStore.PROCESS_STATUS_ARCHIVED, 'Remove', remove_process_confirmation, success_removing_process, error_removing_process)">
                      <small class="text-danger cursor-pointer">Remove</small>
                    </a>
                    <a v-if="process.log.status.name === 'completed'" class="dropdown-item cursor-pointer" @click="showProcessConfirmation(process, process.log.id, profileProcessStore.PROCESS_STATUS_ARCHIVED, 'Archive', remove_process_confirmation, success_removing_process, error_removing_process)">
                      <small class="text-danger">Archive</small>
                    </a>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </table>
        <table v-else class="w-100 mt-4 pt-4">
          <tr>
            <td>
              <div class="text-center" v-html="no_processes_assigned_to_profile"></div>
              <div class="text-center mt-4">
                <button class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">View Guide</button>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <Dialog v-model:visible="profileProcessStore.showProcessModal" :draggable="false" modal header="Assign Process" :style="{ width: '75vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <template #header>
        <div class="row m-0 p-0 pb-2">
          <div class="text-[#353535] text-2xl font-bold font-['Roboto'] leading-loose w-100">Assign process</div>
          <category-filter class="mb-2 ml-1"></category-filter>
        </div>
      </template>
      <process-block></process-block>
      <template #footer>
        <div class="row">
          <div class="col-12 p-4 text-right">
            <button class="gap-2 justify-center py-2 px-4 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white mr-2" @click="cancel">Cancel</button>
            <negotium-button v-if="!profileProcessStore.status.loading" @click="assignProcess()" :disabled="profileProcessStore.isDisabledAssignProcess" :value="'Add Selected Processes'"></negotium-button>
            <button v-if="profileProcessStore.status.loading"  class="px-4 py-2 bg-neutral-700 rounded-custom-25 border border-neutral-700 justify-center items-center text-white" disabled><i class="pi pi-spin pi-spinner"></i> Loading ...</button>
          </div>
        </div>
      </template>
    </Dialog>

    <!--
    <ConfirmDialog>
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="flex flex-col w-full gap-4 p-4">
          <span class="text-2xl font-bold font-['Roboto'] leading-loose">{{ message.header }}</span>
          <p class="text-base font-normal font-['Nunito'] leading-normal" v-html="message.message"></p>
        </div>
        <div class="row">
          <div class="col-12 py-3 px-4 text-right">
            <Button label="Cancel" outlined @click="rejectCallback" class="gap-2 justify-center py-2 px-4 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white mr-2"></Button>
            <Button v-if="message.message.includes('remove')" label="Yes, Remove" @click="acceptCallback" class="px-4 py-2 bg-neutral-700 rounded-custom-25 border border-neutral-700 justify-center items-center text-white"></Button>
            <Button v-if="message.message.includes('stop')" label="Yes, Stop" @click="acceptCallback" class="px-4 py-2 bg-neutral-700 rounded-custom-25 border border-neutral-700 justify-center items-center text-white"></Button>
          </div>
        </div>
      </template>
    </ConfirmDialog>
    -->








  </ExtendProfileLayout>
</template>