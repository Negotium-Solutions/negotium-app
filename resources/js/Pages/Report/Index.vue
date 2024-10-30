<script setup>
import { AuthenticatedLayout } from '@/Layouts/Adminlte'
import axios from 'axios';
import {router, usePage} from '@inertiajs/vue3';
import { ref,computed,onMounted } from "vue";
import { useToastr } from "@/toastr.js";
import { useReport } from "@/stores/index.js";
import {FunctionsHelper} from "@/helpers";

const toastr = useToastr();
const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);
const reportStore = useReport();

const visibleChildren = ref([])
const processStatus = ref([
{showChildren:true,id:1,name:'Nico',surname:'van der Meulen',assigned:'15',start_rate:'33',process_name:'-',date_started:'-',started_by:'-',status:'-',progress:'80',date_completed:'-',parent_id:0},
        {id:2,name:'-',surname:'-',assigned:'-',start_rate:'0',process_name:'-',date_started:'00/00/0000',started_by:'Erin Dias',status:'-',progress:'40',date_completed:'-',parent_id:1},
        {id:3,name:'-',surname:'-',assigned:'-',start_rate:'11',process_name:'-',date_started:'00/00/0000',started_by:'Randy Rosser',status:'-',progress:'25',date_completed:'-',parent_id:1},
        {id:4,name:'-',surname:'-',assigned:'-',start_rate:'5',process_name:'-',date_started:'00/00/0000',started_by:'-',status:'-',progress:'10',date_completed:'-',parent_id:1}
])



onMounted(async () => {
 reportStore.profileTypes = await reportStore.getProfiles();
 console.log('profileTyeps', reportStore.profileTypes);
})

        function toggleChildren(parentId) {

            const parent = document.getElementById(`parent_${parentId}`)
            const childRows = document.querySelectorAll(`.child-of-${parentId}`);
            console.log("Profiles", reportStore.profileTypes);
            //console.log("Children", childRows);
            if(parent.classList.contains('pi-chevron-down')){
                parent.classList.remove('pi-chevron-down')
                parent.classList.add('pi-chevron-up')
            } else {
                parent.classList.add('pi-chevron-down')
                parent.classList.remove('pi-chevron-up')
            }
            childRows.forEach(row => {
                row.style.display = row.style.display === 'none' ? 'table-row' : 'none';
            });
        }

        function barColor(num){
            if(num < 30){
                return 'bg-danger-500'
            }
            if(num < 70){
                return 'bg-warning-500'
            }
            if(num <= 100){
                return 'bg-success-500'
            }
        }

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

        <div class="content-container pl-4 pr-4" id="" v-for="(profileType, index) in reportStore.profileTypes" :key="index">
            <div class="row">
                <table class="table w-full border-0">
                    <thead>
                        <tr>
                            <td colspan="2" class="border-t-0 border-l-0 border-b-0 border-r-4 bg-neutral-500 border-r-white text-['Roboto']">
                              {{ profileType.name }}
                            </td>
                            <!-- <td colspan="9" class="bg-neutral-500 text-['Roboto']">Process information</td> -->
                        </tr>
                        <tr>
                            <td v-if="profileType.dynamic_model_category_id === 1" class="text-sm font-normal py-1">Name<i class="pi pi-chevron-down text-[0.6rem] pl-2"></i></td>
                            <td v-if="profileType.dynamic_model_category_id === 1" class="border-t-0 border-l-0 border-b-0 border-r-4 border-r-white text-sm font-normal py-1">Surame<i class="pi pi-chevron-down text-[0.6rem] pl-2"></i></td>
                            <td v-if="profileType.dynamic_model_category_id === 2" class="border-t-0 border-l-0 border-b-0 border-r-4 border-r-white text-sm font-normal py-1">Profile Name<i class="pi pi-chevron-down text-[0.6rem] pl-2"></i></td>
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

                        <tr v-for="(profile, profile_index) in profileType.profiles" :key="profile_index">
                            <td v-if="profileType.dynamic_model_category_id === 1">{{ profile.first_name}}</td>
                            <td v-if="profileType.dynamic_model_category_id === 1">{{ profile.last_name }}</td>
                            <td v-if="profileType.dynamic_model_category_id === 2">{{ profile.profile_name }}</td>
                            <td>{{ profile.processes_count }}</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;">{{ profile.processes_start_rate_percentage }}%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '33%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(profile.processes_start_rate_percentage)">
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
                                    <span style="min-width: 37px;">80%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '80%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(80)">
                                    </div>
                                    </div>
                                </div></td>
                            <td>-</td>
                            <td><a href="javascript:void(0)" class="rounded px-2 pb-1.5 pt-2 bg-neutral-500">
                              <i class="pi pi-chevron-down" @click="reportStore.setProfileProcesses(profile)" :style="{ transform: reportStore.showProcesses ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }"></i>
                            </a></td>
                        </tr>
                        <!-- Child Rows -->
                        <tr v-if="reportStore.showProcesses"  v-for="(process, process_index) in reportStore.profileProcesses" :key="process_index" >
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;">0%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '1%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(1)">
                                    </div>
                                    </div>
                                </div>
                            </td>
                            <td>{{ process.name }}</td>
                            <td>{{ FunctionsHelper.DateTime(process.created_at) }}</td>
                            <td>{{ reportStore.profileName }}</td>
                            <td>{{ process.status }}</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;">0%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '1%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(0)">
                                    </div>
                                    </div>
                                </div>
                            </td>
                            <td>-</td>
                            <td></td>
                        </tr>
<!--
                        <tr v-if="reportStore.showProcesses" >
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;">100%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '100%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(100)">
                                    </div>
                                    </div>
                                </div>
                            </td>
                            <td>Client Review</td>
                            <td>00/00/0000</td>
                            <td>Randy Rosser</td>
                            <td>Started</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;">100%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '100%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(100)">
                                    </div>
                                    </div>
                                </div>
                            </td>
                            <td>00/00/0000</td>
                            <td></td>
                        </tr>
                        <tr class="child-row child-of-1" style="display: none;">
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;max-width: 37px;">50%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '50%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(50)">
                                    </div>
                                    </div>
                                </div>
                            </td>
                            <td>Withdrawal</td>
                            <td>00/00/0000</td>
                            <td>Tiana Donin</td>
                            <td>In-Progress</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;max-width: 37px;">70%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '70%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(70)">
                                    </div>
                                    </div>
                                </div>
                            </td>
                            <td>-</td>
                            <td></td>
                        </tr>  -->
                        <!-- Parent Row -->
                        <!--
                        <tr class="bg-[#efefef] pb-1">
                            <td>Brook</td>
                            <td>Haley</td>
                            <td>45</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;max-width: 37px;">90%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '90%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(90)">
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
                                    <span style="min-width: 37px;max-width: 37px;">40%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '40%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(40)">
                                    </div>
                                    </div>
                                </div></td>
                            <td>-</td>
                            <td><a href="javascript:void(0)" class="rounded px-2 pb-1.5 pt-2 bg-neutral-500"><i class="pi pi-chevron-down" :id="'parent_2'" @click="toggleChildren(2)"></i></a></td>
                        </tr>
                        -->
                        <!-- Child Rows -->
                        <!--
                        <tr class="child-row child-of-2" style="display: none;">
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;max-width: 37px;">75%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '75%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(75)">
                                    </div>
                                    </div>
                                </div>
                            </td>
                            <td>Withdrawal</td>
                            <td>00/00/0000</td>
                            <td>Randy Rosser</td>
                            <td>In-Progress</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;max-width: 37px;">73%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '73%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(73)">
                                    </div>
                                    </div>
                                </div>
                            </td>
                            <td>-</td>
                            <td></td>
                        </tr>
                        -->
                        <!-- Parent Row -->
                        <!--
                        <tr class="bg-[#efefef] pb-1">
                            <td>Gilbert</td>
                            <td>O'Conner</td>
                            <td>12</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;max-width: 37px;">20%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '20%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(20)">
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
                                    <span style="min-width: 37px;max-width: 37px;">20%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '20%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(20)">
                                    </div>
                                    </div>
                                </div></td>
                            <td>-</td>
                            <td><a href="javascript:void(0)" class="rounded px-2 pb-1.5 pt-2 bg-neutral-500"><i class="pi pi-chevron-down" :id="'parent_3'" @click="toggleChildren(3)"></i></a></td>
                        </tr>
                        -->
                        <!-- Child Rows -->
                        <!--
                        <tr class="child-row child-of-3" style="display: none;">
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;max-width: 37px;">10%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '10%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(10)">
                                    </div>
                                    </div>
                                </div>
                            </td>
                            <td>Client Onboarding</td>
                            <td>00/00/0000</td>
                            <td>Brandon Korsgaard</td>
                            <td>Started</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;max-width: 37px;">50%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '50%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(50)">
                                    </div>
                                    </div>
                                </div>
                            </td>
                            <td>-</td>
                            <td></td>
                        </tr>
                        <tr class="child-row child-of-3" style="display: none;">
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;max-width: 37px;">50%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '50%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(50)">
                                    </div>
                                    </div>
                                </div>
                            </td>
                            <td>Client Review</td>
                            <td>00/00/0000</td>
                            <td>Brandon Korsgaard</td>
                            <td>In-Progress</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;max-width: 37px;">70%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '70%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(70)">
                                    </div>
                                    </div>
                                </div>
                            </td>
                            <td>-</td>
                            <td></td>
                        </tr>
                        -->
                        <!-- Parent Row -->
                        <!--
                        <tr class="bg-[#efefef] pb-1">
                            <td>Yazmin</td>
                            <td>Carter</td>
                            <td>4</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;max-width: 37px;">50%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '50%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(50)">
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
                                    <span style="min-width: 37px;max-width: 37px;">70%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '70%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(70)">
                                    </div>
                                    </div>
                                </div></td>
                            <td>-</td>
                            <td><a href="javascript:void(0)" class="rounded px-2 pb-1.5 pt-2 bg-neutral-500"><i class="pi pi-chevron-down" :id="'parent_4'" @click="toggleChildren(4)"></i></a></td>
                        </tr>
                        -->
                        <!-- Child Rows -->
                        <!--
                        <tr class="child-row child-of-4" style="display: none;">
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;max-width: 37px;">10%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '10%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(10)">
                                    </div>
                                    </div>
                                </div>
                            </td>
                            <td>Client Onboarding</td>
                            <td>00/00/0000</td>
                            <td>Tiana Donin</td>
                            <td>In-Progress</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;max-width: 37px;">50%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '50%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(50)">
                                    </div>
                                    </div>
                                </div>
                            </td>
                            <td>-</td>
                            <td></td>
                        </tr>
                        <tr class="child-row child-of-4" style="display: none;">
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;max-width: 37px;">0%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '1%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(0)">
                                    </div>
                                    </div>
                                </div>
                            </td>
                            <td>Withdrawal</td>
                            <td>00/00/0000</td>
                            <td>Tiana Donin</td>
                            <td>Assigned</td>
                            <td>
                                <div style="display: flex; align-items: center;">
                                    <span style="min-width: 37px;max-width: 37px;">0%</span>
                                    <div style="background-color: #fff; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-left: 10px;border:1px solid #efefef">
                                    <div :style="{ width: '1%' }" 
                                        class="progress-bar h-6 rounded" :class="barColor(0)">
                                    </div>
                                    </div>
                                </div>
                            </td>
                            <td>-</td>
                            <td></td>
                        </tr>
                        -->
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