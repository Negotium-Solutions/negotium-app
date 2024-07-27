<script setup>
import { useProfilesManagerStore } from "@/stores";
const profileManagerStore = useProfilesManagerStore();

const props = defineProps({
  process_messages: Array
});
</script>
<template>
    <div v-if="profileManagerStore.isSelected('profile', profileManagerStore.profile)" class="col-md-6 col-sm-12 pt-2">
      <div class="card">
        <div class="card-header">
          Processes <button class="btn-sm btn-dark float-right">Assign Process</button>
        </div>
        <div class="card-body">
          <table v-if="profileManagerStore.processes.length > 0" class="table-sm">
            <tr>
              <td>Select</td><td>Process Name</td><td>Current Posistion</td><td>Last opened</td><td>Date edited</td><td>actions</td>
            </tr>
            <tr v-for="(process, index) in profileManagerStore.processes" :key="index">
              <td><checkbox></checkbox></td><td>{{ process.name }}</td><td>Step 12 - Action 11</td><td>2024-07-11 00:00</td><td>2024-07-11 00:00</td>
              <td><button class="btn-sm">View</button></td>
            </tr>
          </table>
          <div v-else>
            <div class="text-center" v-html="process_messages.no_processes_assigned_to_profile"></div>
            <div class="text-center mt-4" >
              <button class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">View Page</button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>