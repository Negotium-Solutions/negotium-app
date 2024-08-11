<script setup>
  import { useProcessesStore, useProfileProcessStore, useProfilesManagerStore } from "@/stores";

  const processStore = useProcessesStore();
  const profileProcessStore = useProfileProcessStore();
  const profilesManagerStore = useProfilesManagerStore();
</script>

<template>
  <div class="row my-3">
    <div class="col-md-4 col-sm-12 mb-3" v-for="(process, index) in processStore.filterByCategoryExcluding(profilesManagerStore.profile.processes)" :key="index">
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
              <button v-if="profileProcessStore.isSelectedProcess(profilesManagerStore.profile.id, process.id)" @click="profileProcessStore.selectProcess(profilesManagerStore.profile.id, process.id)"  class="w-[90px] leading-3 gap-2 justify-center py-2.5 px-3 text-sm rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white mr-2" :class="{ 'isSelected': profileProcessStore.isSelectedProcess(profilesManagerStore.profile.id, process.id) }">Unselect</button>
              <button v-else @click="profileProcessStore.selectProcess(profilesManagerStore.profile.id, process.id)"  class="w-[90px] leading-3 gap-2 justify-center py-2.5 px-3 text-sm rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white mr-2" :class="{ 'isSelected': profileProcessStore.isSelectedProcess(profilesManagerStore.profile.id, process.id) }">Select</button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .isSelected {
    background-color: grey;
    color: white;
  }
</style>