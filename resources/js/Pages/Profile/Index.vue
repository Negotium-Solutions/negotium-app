<script setup>

import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import { onMounted, reactive, computed } from "vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import Avatar from 'primevue/avatar';
import { usePage } from "@inertiajs/vue3";
import { useProfilesManagerStore } from "@/stores";

const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);

const confirm = useConfirm();
const toast = useToast();
const profileManagerStore = useProfilesManagerStore();

const props = defineProps({
  profileTypes: Array,
  api_url: String
});

const pageProps = reactive({

});

onMounted(() =>{
  profileManagerStore.set('profile_types', props.profileTypes);
  profileManagerStore.set('profile_type', props.profileTypes[0]);
  handleProfileDivHeight()
  // Add a global event listener
  // for window resize
  window.addEventListener
  ('resize', handleProfileDivHeight);
});

function selectProfileType(profile) {
  console.log('Profile: ', profile);
}

function isSelectedProfileType(profile) {
  // return profile.id ===
}

function handleProfileDivHeight(){
  const w = window.innerWidth;
  const h = window.innerHeight;

  var element = document.getElementById('profiles-header');
  var height = element.offsetHeight;
  var newHeight = h -  height
  document.getElementById('profiles-content').style.minHeight = newHeight+'px'
  document.getElementById('profiles-sidebar').style.minHeight = newHeight+'px'
  document.getElementById('profiles-detail').style.minHeight = newHeight+'px'
  if(document.getElementById('profiles-detail-content')){
  document.getElementById('profiles-detail-content').style.minHeight = newHeight+'px'
  }
}

</script>

<template>
  <AuthenticatedLayout>
    <template #header2>
      <div class="d-flex w-100">
        <div class="col-sm-6">
          <h1 class="text-neutral-700 text-4xl font-bold font-['Roboto']">
            Profiles
          </h1>
        </div><!-- /.col -->
        <div class="col-sm-6 text-right pt-2 pt-sm-3 pt-md-3 pt-lg-3 pt-xl-3">
          <a :href="route('process.create')" class="px-4 py-2 bg-neutral-700 rounded-custom-25 border border-neutral-700 justify-center items-center text-white">Add Profile</a>
        </div><!-- /.col -->
      </div>
      <div class="row mb-3">
        <div class="col-md-12">
          <div class="row">
            <div v-for="(profile_type, index) in props.profileTypes" :key="index" class="px-1 mb-2">
              <button :class="['float-right h-[38px] p-3 bg-white rounded border border-neutral-700 justify-center items-center gap-2 inline-flex ml-1 text-xs font-bold', { 'bg-zinc-100' : profileManagerStore.isSelected('profile_type', profile_type) }]" @click="profileManagerStore.set('profile_type', profile_type)">{{profile_type.name}}</button>
            </div>
          </div>
        </div>
        </div>
    </template>
    <template #profile>
    <div class="content-container pr-4">

      <div class="row" id="profiles-sidebar">
        <div class="col-lg-2 col-md-3 col-sm-12 border-right pr-0 mr-2">
          <div v-for="(profile, index) in profileManagerStore.profiles" :key="index" @click="profileManagerStore.set('profile', profile);handleProfileDivHeight()" class="w-100 py-2 h-14 border-b border-gray-200 justify-start items-center gap-3 inline-flex">
            <div class="w-100 pl-6 pr-2 d-flex">
            <Avatar class="p-overlay-badge align-middle mr-2 w-[40px]" size="large" :image="props.api_url + profile.avatar"  />
            <span v-if="profileManagerStore.profile_type.name == 'Individual'"  class="flex items-center justify-center text-neutral-700 text-sm font-medium font-['Roboto'] leading-tight"> {{ profile.first_name }} {{ profile.last_name }} </span>
            <span v-if="profileManagerStore.profile_type.name == 'Business'" class="flex items-center justify-center text-neutral-700 text-sm font-medium font-['Roboto'] leading-tight"> {{ profile.company_name }} </span>
            <div class="row mb-2"></div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-12 profile-info" id="profiles-detail">
          <div v-show="profileManagerStore.isSelected('profile', profileManagerStore.profile)" class="pt-4 border-right pr-3 pl-3" id="profiles-detail-content">
            <div class="row mb-2 pl-4">
              <table class="w-100">
                <tr>
                  <td rowspan="3" class="w-[60px]">
                    <Avatar class="align-top" :image="props.api_url + profileManagerStore.profile.avatar" />
                  </td>
                  <td class="pl-2">
                    <span v-if="profileManagerStore.profile_type.name == 'Individual'" >
                      <div class="w-60 h-10 text-neutral-700 text-[28px] font-bold font-['Roboto'] leading-loose">{{ profileManagerStore.profile.first_name }} {{ profileManagerStore.profile.last_name }} </div>
                    </span>
                    <span v-if="profileManagerStore.profile_type.name == 'Business'">
                      <div class="w-60 h-10 text-neutral-700 text-[28px] font-bold font-['Roboto'] leading-loose">{{ profileManagerStore.profile.company_name }} </div>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="pl-2">
                    {{ profileManagerStore.profile.email }}
                  </td>
                </tr>
                <tr>
                  <td class="pl-2">
                    <button class="btn-sm btn-light text-left justify-right pl-2">New Client</button>
                  </td>
                </tr>
              </table>
            </div>

            <div class="row mb-3 d-flex-none w-100">
              <button class="flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Send email</button>
              <button class="ml-auto flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Send message</button>
              <button class="ml-1 flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">+ Add Note</button>
            </div>

            <div class="row mb-3"></div>
            <h2 class="font-bold">Profile navigation</h2>
            <div class="row mb-3"></div>
            <div><button class="w-100 px-4 py-2 rounded justify-between items-center inline-flex border border-neutral-200 bg-slate-500 text-white">Processes <i class="fa fa-chevron-right float-right"></i></button></div>
            <div><button class="w-100 px-4 py-2 rounded justify-between items-center inline-flex border border-neutral-200 mt-1">Communications <i class="fa fa-chevron-right float-right"></i></button></div>
            <div><button class="w-100 px-4 py-2 rounded justify-between items-center inline-flex border border-neutral-200 mt-1">Documents <i class="fa fa-chevron-right float-right"></i></button></div>
            <div><button class="w-100 px-4 py-2 rounded justify-between items-center inline-flex border border-neutral-200 mt-1">Notes & Reminders <i class="fa fa-chevron-right float-right"></i></button></div>
            <div><button class="w-100 px-4 py-2 rounded justify-between items-center inline-flex border border-neutral-200 mt-1">Profile Details <i class="fa fa-chevron-right float-right"></i></button></div>

            <div class="row mb-28"></div>

            <h2 class="font-bold">Client view</h2>
            <div class="row mb-3"></div>
            <div><button class="w-100 px-4 py-2 rounded justify-between items-center inline-flex border border-neutral-200">Requested information <i class="fa fa-chevron-right float-right"></i></button></div>
            <div><button class="w-100 px-4 py-2 rounded justify-between items-center inline-flex border border-neutral-200 mt-1">Profile Access <i class="fa fa-chevron-right float-right"></i></button></div>

          </div>
        </div>
        <div v-if="profileManagerStore.isSelected('profile', profileManagerStore.profile)" class="col-md-6 col-sm-12 pt-2">
          <div class="card">
            <div class="card-header">
              Processes <button class="btn-sm btn-dark float-right">Assign Process</button>
            </div>
            <div class="card-body">
              <table class="table-sm">
                <tr>
                  <td>Select</td><td>Process Name</td><td>Current Posistion</td><td>Last opened</td><td>Date edited</td><td>actions</td>
                </tr>
                <tr v-for="(process, index) in profileManagerStore.processes" :key="index">
                  <td><checkbox></checkbox></td><td>{{ process.name }}</td><td>Step 12 - Action 11</td><td>2024-07-11 00:00</td><td>2024-07-11 00:00</td>
                  <td><button class="btn-sm">View</button></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </template>
  </AuthenticatedLayout>
  <Toast/>
  <ConfirmDialog></ConfirmDialog>
</template>

<style scoped>
</style>