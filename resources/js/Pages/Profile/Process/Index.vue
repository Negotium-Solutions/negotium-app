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
  <div v-if="profileManagerStore.isSelected('profile', profileManagerStore.profile)" class="col-md-6 col-sm-12 pt-2">
    <div class="card">
      <div class="card-header">
        Processes <button @click="assignProcess()" class="btn-sm btn-dark float-right">Assign Process</button>
      </div>
      <div class="card-body">
        <table v-if="profileManagerStore.processes.length > 0" class="table-sm">
          <tr>
            <td>Select</td><td>Process Name</td><td>Current Posistion</td><td>Last opened</td><td>Date edited</td><td>actions</td>
          </tr>
          <tr v-for="(process, index) in profileManagerStore.processes" :key="index">
            <td><input type="checkbox"></td><td>{{ process.name }}</td><td>Step 12 - Action 11</td><td>2024-07-11 00:00</td><td>2024-07-11 00:00</td>
            <td>
              <button class="btn-sm">View</button>
              <div class="flex flex-col items-center">
              <button type="button" data-toggle="dropdown" class="btn btn-tool mt-0">
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
                  <small>Remove</small>
                </a>
              </div>
          </div>
            </td>

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
  <Dialog v-model:visible="pageProps.showProcessModal" modal header="Assign Process" :style="{ width: '75vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div>
      <category-filter class="mb-2 ml-1"></category-filter>
      <hr class="mb-3"/>
      <process-block></process-block>
    </div>
  </Dialog>
</template>