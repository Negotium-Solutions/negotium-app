<script setup>
import { AuthenticatedLayout } from '@/Layouts/Adminlte'
import { usePage} from '@inertiajs/vue3';
import { computed } from "vue";
import { FunctionsHelper } from "@/helpers";
import { useProcesStatusReportStore } from "@/stores";

const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);
const props = defineProps({
  processStatusReport: null
});

const processStatusReportStore = useProcesStatusReportStore();
</script>
<template>
    <AuthenticatedLayout>
        <template #header>
            <div class="col-sm-6">
              <h1 class="m-0">Process status report</h1>
            </div><!-- /.col -->
            <div class="col-sm-6 text-right pt-2">
            </div><!-- /.col -->
        </template>

        <div class="content-container pl-4 pr-4" id="" >
          <div class="row mb-4">
            <div class="col-md-12 pt-4">
              <div class="row">
                <div v-for="(profileType, index) in props.processStatusReport.profileTypes" :key="index" class="px-1 mb-1">
                  <a :href="route('report', profileType.id)" :class="['float-right h-[38px] p-3 bg-white rounded border border-neutral-700 justify-center items-center gap-2 inline-flex ml-1 text-xs font-bold', { 'bg-zinc-100 text-white' : props.processStatusReport.report.id === profileType.id }]">{{profileType.name}}</a>
                </div>
              </div>
            </div>
          </div>
            <div class="row">
                <table class="table w-full border-0">
                    <thead>
                        <tr>
                            <td v-if="props.processStatusReport.report.dynamic_model_category_id === 1" class="text-sm font-normal py-1">Name<i class="pi pi-chevron-down text-[0.6rem] pl-2"></i></td>
                            <td v-if="props.processStatusReport.report.dynamic_model_category_id === 1" class="border-t-0 border-l-0 border-b-0 border-r-4 border-r-white text-sm font-normal py-1">Surame<i class="pi pi-chevron-down text-[0.6rem] pl-2"></i></td>
                            <td v-if="props.processStatusReport.report.dynamic_model_category_id === 2" class="border-t-0 border-l-0 border-b-0 border-r-4 border-r-white text-sm font-normal py-1">Profile Name<i class="pi pi-chevron-down text-[0.6rem] pl-2"></i></td>
                            <td class="text-sm font-normal py-1 last2">Assigned<i class="pi pi-chevron-down text-[0.6rem] pl-2"></i></td>
                            <td class="text-sm font-normal py-1">Start Rate</td>
                            <td class="text-sm font-normal py-1">Process Name<i class="pi pi-chevron-down text-[0.6rem] pl-2"></i></td>
                            <td class="text-sm font-normal py-1 last2">Date Started<i class="pi pi-chevron-down text-[0.6rem] pl-2"></i></td>
                            <td class="text-sm font-normal py-1">Started by<i class="pi pi-chevron-down text-[0.6rem] pl-2"></i></td>
                            <td class="text-sm font-normal py-1">Status<i class="pi pi-chevron-down text-[0.6rem] pl-2"></i></td>
                            <td class="text-sm font-normal py-1">Progress (overall/process)</td>
                            <td class="text-sm font-normal py-1 last2">Date Completed<i class="pi pi-chevron-down text-[0.6rem] pl-2"></i></td>
                            <td class="text-sm font-normal py-1 last2"></td>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Parent Row -->
                      <template v-for="(profile, profile_index) in props.processStatusReport.report.profiles" :key="profile_index">
                          <tr class="bg-[#efefef] pb-1">
                              <td v-if="props.processStatusReport.report.dynamic_model_category_id === 1">{{ profile.first_name}}</td>
                              <td v-if="props.processStatusReport.report.dynamic_model_category_id === 1">{{ profile.last_name }}</td>
                              <td v-if="props.processStatusReport.report.dynamic_model_category_id === 2">{{ profile.profile_name }}</td>
                              <td>{{ profile.processes_count }}</td>
                              <td>
                                  <div style="display: flex; align-items: center;">
                                      <span style="min-width: 37px;">{{ profile.processes_start_rate_percentage }}%</span>
                                      <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                      <div :style="{ width: profile.processes_start_rate_percentage+'%' }"
                                          class="progress-bar h-6 rounded" :class="processStatusReportStore.barColor(profile.processes_start_rate_percentage)">
                                      </div>
                                      </div>
                                  </div>
                              </td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                              <td>
                                  <div style="display: flex; align-items: center;">
                                      <span style="min-width: 37px;">{{ profile.progress_overall_process }}%</span>
                                      <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                        <div :style="{ width: profile.progress_overall_process+'%' }"
                                            class="progress-bar h-6 rounded" :class="processStatusReportStore.barColor(profile.progress_overall_process)">
                                        </div>
                                      </div>
                                  </div>
                              </td>
                              <td>-</td>
                              <td><a href="javascript:void(0)" class="rounded px-2 pb-1.5 pt-2 bg-neutral-500"><i class="pi pi-chevron-down" :id="'parent_' + profile.id" @click="processStatusReportStore.toggleChildren(profile.id)"></i></a></td>
                          </tr>
                          <!-- Child Rows -->
                          <tr :class="'child-row child-of-' + profile.id" v-for="(process, process_index) in profile.processes" :key="process_index" style="display: none;">
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                              <td>
                                  <div style="display: flex; align-items: center;">
                                      <span style="min-width: 37px;">0%</span>
                                      <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                      <div :style="{ width: '1%' }"
                                          class="progress-bar h-6 rounded" :class="processStatusReportStore.barColor(1)">
                                      </div>
                                      </div>
                                  </div>
                              </td>
                              <td>{{ process.name }}</td>
                              <td>{{ FunctionsHelper.DateTime(process.created_at) }}</td>
                              <td>{{ profile.profile_name }}</td>
                              <td>{{ process.status }}</td>
                              <td>
                                  <div style="display: flex; align-items: center;">
                                      <span style="min-width: 37px;">0%</span>
                                      <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                      <div :style="{ width: '1%' }"
                                          class="progress-bar h-6 rounded" :class="processStatusReportStore.barColor(0)">
                                      </div>
                                      </div>
                                  </div>
                              </td>
                              <td>-</td>
                          </tr>
                      </template>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- /.row -->
    </AuthenticatedLayout>
</template>
<style scoped>
.table td, .table th{
    border-top:0px !important;
    font-size:0.95rem;
    border-bottom:3px solid white;
}

.table .child-row td{
    border-bottom: 2px solid #efefef !important;
}

.btn-edit {
  color: lawngreen;
}

.btn-delete {
  color: orangered;
}

.progress-bar {
  background-color: green;
  transition: width 0.3s;
}
</style>