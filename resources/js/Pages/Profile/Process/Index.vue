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
const messages = computed(() => usePage().props.messages);
const no_processes_assigned_to_profile = messages.value.processes.no_processes_assigned_to_profile;
const stop_process_confirmation = messages.value.processes.stop_process_confirmation;
const resume_process_confirmation = messages.value.processes.resume_process_confirmation;
const remove_process_confirmation = messages.value.processes.remove_process_confirmation;
const success_stopping_process = messages.value.processes.success_stopping_process;
const success_removing_process = messages.value.processes.success_removing_process;
const success_resuming_process = messages.value.processes.success_resuming_process;
const error_stopping_process = messages.value.processes.error_stopping_process;
const error_removing_process = messages.value.processes.error_removing_process;
const error_resuming_process = messages.value.processes.error_resuming_process;

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

function showProcessConfirmation(process, process_log_id, process_status_id, button_label, confirmation_message, success_message, error_message) {
  confirm.require({
    header: 'Confirm stopping of process',
    message: FunctionsHelper.replaceTextVariables(confirmation_message, profileManagerStore.getRemoveProcessVariables),
    acceptLabel: 'Yes, ' + button_label,
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
        const updateProcessLogStatus = profileProcessStore.updateProcessLogStatus(process_log_id, process_status_id);

        updateProcessLogStatus.then((data) => {
          if(data === false) {
            toast.add({ severity: 'error', detail: profileProcessStore.response.message, life: 3000 });
          } else {
            profileProcessStore.checkCondition(
                profileProcessStore.$state,
                (profileManagerStore) => {
                  if (profileManagerStore.response.code === 204) {
                    toast.add({
                      severity: 'success',
                      detail: profileManagerStore.response.message,
                      life: 3000
                    });
                  } else {
                    profileProcessStore.excluded_processes.push(process);
                    toast.add({
                      severity: 'success',
                      detail: process.name + " " + success_message,
                      life: 3000
                    });
                  }
                }
            );

            setTimeout(function() {
              // TODO: Jaco - Please add loader to prevent user from clicking anything
              location.reload();
            }, 3000);
          }
        });
      }catch (error) {
        toast.add({ severity: 'error', detail: FunctionsHelper.replaceTextVariables(error_message, profileManagerStore.getRemoveProcessVariables), life: 3000 });
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
            <th>Select</th><th>Process Name</th><th>Current Posistion</th><th>Last opened</th><th>Date edited</th><th>Actions</th>
          </tr>
          <tr v-for="(process, index) in processesStore.filterByExcludedProcesses(profileManagerStore.processes, profileProcessStore.excluded_processes)" :key="index" :class="{ 'bg-gray-200': profileManagerStore.isSelected('process', process)}">
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
  <Dialog v-model:visible="profileProcessStore.showProcessModal" modal header="Assign Process" :style="{ width: '75vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div>
      <category-filter class="mb-2 ml-1"></category-filter>
      <hr class="mb-3"/>
      <process-block></process-block>
      <hr class="mb-3"/>
      <div class="row">
        <div class="col-12 p-4 text-right">
          <button class="btn btn-sm btn-default mr-2" @click="cancel">Cancel</button>
          <button v-if="!profileProcessStore.status.loading" class="btn btn-sm btn-default" @click="assignProcess()" :disabled="profileProcessStore.selectedProfileProcesses.length === 0 || profileProcessStore.status.loading === true">Add Selected Processes</button>
          <button v-if="profileProcessStore.status.loading" class="btn btn-sm btn-default" disabled><i class="pi pi-spin pi-spinner"></i> Loading ...</button>
        </div>
      </div>
    </div>
  </Dialog>
  <ConfirmDialog>
    <template #message="slotProps">
      <div class="flex flex-col items-center w-full gap-4">
        <p v-html="slotProps.message.message"></p>
      </div>
    </template>
  </ConfirmDialog>
  <Toast/>
</template>