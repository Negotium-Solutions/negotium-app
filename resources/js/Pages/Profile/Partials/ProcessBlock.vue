<script setup>
  import { useProcessesStore, useProfilesManagerStore } from "@/stores";
  import { reactive } from "vue";

  const processStore = useProcessesStore();
  const profilesManagerStore = useProfilesManagerStore();
  const pageProps = reactive( {
    selectedProcesses: []
  });

  function selectProcess(id){
    if(pageProps.selectedProcesses.includes(id)) {
      pageProps.selectedProcesses = pageProps.selectedProcesses.filter((item) => item !== id);
    } else {
      pageProps.selectedProcesses.push(id);
    }
  }

  function isSelectedProcess(id) {
    return pageProps.selectedProcesses.includes(id);
  }

  function addSelectedProcess() {
    pageProps.selectedProcesses.forEach((process_id) => {
      console.log('Profile ID: ', profilesManagerStore.profile.id);
      console.log('Process ID: ', process_id);
      processStore.assignProcessToProfile(profilesManagerStore.profile.id, process_id);
    });
  }
</script>

<template>
  <div class="row">
    <div class="col-md-4 col-sm-12 mb-3" v-for="(process, index) in processStore.filterByCategory" :key="index">
      <div class="flex flex-col px-4 py-6 rounded-lg border border-solid bg-neutral-50 border-neutral-700">
        <table class="table table-sm table-borderless">
          <tr>
            <td style="width: 70%;">
              <div class="flex gap-5">
                <div class="flex-auto text-lg font-bold leading-6 text-neutral-700">
                  {{ process.name }}
                </div>
              </div>
              <div v-if="process.category" class="mt-1 text-xs leading-3" :style="'color: '+process.category.color">{{ process.category.name }}</div>
              <div class="mt-2.5 text-sm leading-5 text-neutral-700">
                <div>{{ process.steps.length }} Steps | {{ (typeof process.steps.activities !== 'undefined') ? process.steps.activities.length : 0 }} Activities</div>
              </div>
            </td>
            <td class="align-middle text-right">
              <button @click="selectProcess(process.id)" class="btn btn-default btn-sm" :class="{ 'isSelected': isSelectedProcess(process.id) }">Select</button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
  <hr/>
  <div class="row">
    <div class="col-12 p-4 text-right">
      <button class="btn btn-sm btn-default mr-2" @click="">Cancel</button>
      <button class="btn btn-sm btn-default" @click="addSelectedProcess()">Add Selected Processes</button>
    </div>
  </div>
</template>
<style scoped>
  .isSelected {
    background-color: grey;
    color: white;
  }
</style>