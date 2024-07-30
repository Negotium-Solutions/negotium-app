<script setup>
import { useProfilesManagerStore, useProcessesStore, useCategoriesStore } from "@/stores";
import { computed, onMounted, reactive } from "vue";
import { usePage } from "@inertiajs/vue3";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import ProcessBlock from "@/Pages/Profile/Partials/ProcessBlock.vue";
import CategoryFilter from "@/Pages/Profile/Partials/CategoryFilter.vue";

const profileManagerStore = useProfilesManagerStore();
const processesStore = useProcessesStore();
const categoriesStore = useCategoriesStore();
const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);

const props = defineProps({
  process_messages: Object
});

const pageProps = reactive({
  showProcessModal: false
});

onMounted(() => {
  processesStore.init(negotium_api_url, user);
  const processes = processesStore.get(null, null, 'category,steps.activities');
  categoriesStore.init(negotium_api_url, user);
  const categories = categoriesStore.get();
  console.log('categories: ', categories);
  console.log('categoriess2: ', categoriesStore.getCategories());
});

function assignProcess() {
  pageProps.showProcessModal = true;
}
</script>
<template>
  <div v-if="profileManagerStore.isSelected('profile', profileManagerStore.profile)" class="col-lg-7 col-md-5 col-sm-12 pl-0 pr-0">
    
    <div class="d-flex w-100 pt-3 pl-2 pr-2 pb-3">
        <div class="col-sm-6">
          <h1 class="text-neutral-700 text-3xl font-bold font-['Roboto']">Processes</h1>
        </div>
        <div class="col-sm-6 text-right">
          <button @click="assignProcess()" class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Assign Process</button>
        </div>
    </div>
    <div class="col-md-12 pl-2 pr-2">      
        <table v-if="profileManagerStore.processes.length > 0" class="table-sm w-100 table-row-spacing table-bg">
          <tr>
            <th>Select</th><th>Process Name</th><th>Current Posistion</th><th>Last opened</th><th>Date edited</th><th>Actions</th>
          </tr>
          <tr v-for="(process, index) in profileManagerStore.processes" :key="index">
            <td><input type="checkbox"></td><td>{{ process.name }}</td><td>Step 12 - Action 11</td><td>2024-07-11 00:00</td><td>2024-07-11 00:00</td>
            <td class="last pl-2">
              <div class="d-flex">
              <button class="flex justify-center py-2 px-3 text-xs leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">View</button>
              <div class="flex flex-col items-center pl-2">
              <button type="button" data-toggle="dropdown" class="w-[30px] h-[30px] bg-[#dae3e7] rounded justify-center items-center gap-1 inline-flex">
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
                <a class="dropdown-item">
                  <small>Stop</small>
                </a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item">
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
              <div class="text-center" v-html="process_messages.no_processes_assigned_to_profile"></div>
              <div class="text-center mt-4" >
                <button class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">View Guide</button>
              </div>
          </td>
          </tr>
        </table>
      </div>
  </div>
  <Dialog v-model:visible="pageProps.showProcessModal" modal header="Assign Process" :style="{ width: '75vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div>
      <category-filter class="mb-2 ml-1"></category-filter>
      <hr class="mb-3"/>
      <process-block></process-block>
    </div>
  </Dialog>
</template>