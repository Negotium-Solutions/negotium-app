<script setup>
import { useProfilesManagerStore, useProcessesStore, useCategoriesStore, useProfileProcessStore } from "@/stores";
import { computed, onMounted } from "vue";
import Dialog from "primevue/dialog";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import Button from "primevue/button";
import ProcessBlock from "@/Pages/Profile/Partials/ProcessBlock.vue";
import CategoryFilter from "@/Pages/Profile/Partials/CategoryFilter.vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { usePage } from "@inertiajs/vue3";
import { FunctionsHelper } from "@/helpers";

const profileManagerStore = useProfilesManagerStore();
const processesStore = useProcessesStore();
const categoriesStore = useCategoriesStore();
const profileProcessStore = useProfileProcessStore();
const toast = useToast();
const confirm = useConfirm();
const functionsHelper = new FunctionsHelper();
const messages = computed(() => usePage().props.messages);
const no_processes_assigned_to_profile = messages.value.processes.no_processes_assigned_to_profile;

onMounted(() => {
  processesStore.get(null, null, 'category,steps.activities');
  categoriesStore.get();
});

function ShowAssignProcess() {
  profileProcessStore.showProcessModal = true;
}

function assignProcess() {
  profileProcessStore.assignProcesses(toast, setProfileName());
  profileProcessStore.checkCondition(profileProcessStore.status, setProfileProcesses);
}

function cancel() {
  profileProcessStore.selectedProfileProcesses = [];
  profileProcessStore.showProcessModal = false;
}

function setProfileProcesses() {
  profileManagerStore.profile_types.forEach((profile_type, index) => {
    if(profileManagerStore.profile_type.id === profile_type.id) {
      profileManagerStore.profile_types[index].profiles.forEach((profile, profile_index) => {
        if(profileManagerStore.profile.id === profile.id) {
          let assignedProcessesArray = [];
          profileProcessStore.selectedProfileProcesses.forEach((item) => {
            assignedProcessesArray.push(item.process_id);
          });
          const assignedProcesses = processesStore.processes.filter((item) => assignedProcessesArray.includes(item.id));
          const mergedArray = profileManagerStore.profile_types[index].profiles[profile_index].processes.concat(assignedProcesses);
          profileManagerStore.profile_types[index].profiles[profile_index].processes = mergedArray;
          profileManagerStore.set('processes', profileManagerStore.profile_types[index].profiles[profile_index].processes);
        }
      });
    }
  });
  profileProcessStore.selectedProfileProcesses = [];
}

function setProfileName(){
  let profile_name = '';
  if(profileManagerStore.profile.profile_type_id === 1){
    profile_name = profileManagerStore.profile.first_name + " " + profileManagerStore.profile.last_name
  } else {
    profile_name = profileManagerStore.profile.company_name;
  }

  return profile_name;
}

function showRemoveProcessConfirmation() {
  confirm.require({
    header: 'Confirm removal of process',
    message: functionsHelper.replaceTextVariables(messages.value.processes.remove_process_confirmation, profileManagerStore.getRemoveProcessVariables),
    acceptLabel: 'Yes, Remove',
    acceptClass: 'btn btn-sm btn-default mr-2',
    rejectLabel: 'Cancel',
    rejectClass: 'btn btn-sm btn-default mr-2',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Save'
    },
    accept: () => {
      try{
        toast.add({ severity: 'success', detail: profileManagerStore.process.name + " " + messages.value.processes.success_removing_process, life: 3000 });
      }catch (error) {
        toast.add({ severity: 'error', detail: functionsHelper.replaceTextVariables(messages.value.processes.error_removing_process, profileManagerStore.getRemoveProcessVariables), life: 3000 });
      }
    },
    reject: () => {
      //
    }
  });
}

function showStopProcessConfirmation() {
  confirm.require({
    header: 'Confirm stopping of process',
    message: functionsHelper.replaceTextVariables(messages.value.processes.stop_process_confirmation, profileManagerStore.getRemoveProcessVariables),
    acceptLabel: 'Yes, Stop',
    acceptClass: 'btn btn-sm btn-default mr-2',
    rejectLabel: 'Cancel',
    rejectClass: 'btn btn-sm btn-default mr-2',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Save'
    },
    accept: () => {
      try{
        toast.add({ severity: 'success', detail: profileManagerStore.process.name + " " + messages.value.processes.success_stopping_process, life: 3000 });
      }catch (error) {
        toast.add({ severity: 'error', detail: functionsHelper.replaceTextVariables(messages.value.processes.error_stopping_process, profileManagerStore.getRemoveProcessVariables), life: 3000 });
      }
    },
    reject: () => {
      //
    }
  });
}

</script>
<template>
  <div v-if="profileManagerStore.isSelected('profile', profileManagerStore.profile)" class="col-lg-7 col-md-5 col-sm-12 pl-0 pr-0">
    
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
            <td>Step 12 - Task 11</td>
            <td>2024-07-11 00:00</td>
            <td>2024-07-11 00:00</td>
            <td class="last pl-2">
              <div class="d-flex">
                <button class="flex justify-center py-2 px-3 text-xs leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">View</button>
                <div class="flex flex-col items-center pl-2">
                <button @click="profileManagerStore.set('process', process)" type="button" data-toggle="dropdown" class="w-[30px] h-[30px] bg-[#dae3e7] rounded justify-center items-center gap-1 inline-flex">
                  <i class="pi pi-ellipsis-v"></i>
                </button>
                <div class="dropdown-menu dropdown-menu dropdown-menu-right">
                  <a class="dropdown-item">
                    <small>View Process</small>
                  </a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item">
                    <small>Details</small>
                  </a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" @click="showStopProcessConfirmation()">
                    <small>Stop</small>
                  </a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" @click="showRemoveProcessConfirmation()">
                    <small class="text-danger">Remove</small>
                  </a>
                </div>
              </div>
          </div>
            </td>

          </tr>
        </table>
        <table v-else class="w-100">
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
            <button v-if="!profileProcessStore.status.loading"  class="px-4 py-2 bg-neutral-700 rounded-custom-25 border border-neutral-700 justify-center items-center text-white" @click="assignProcess()" :disabled="profileProcessStore.selectedProfileProcesses.length === 0 || profileProcessStore.status.loading === true">Add Selected Processes</button>
            <button v-if="profileProcessStore.status.loading"  class="px-4 py-2 bg-neutral-700 rounded-custom-25 border border-neutral-700 justify-center items-center text-white" disabled><i class="pi pi-spin pi-spinner"></i> Loading ...</button>
          </div>
        </div>
      </template>
  </Dialog>
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
</template>