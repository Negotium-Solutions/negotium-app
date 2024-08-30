<script setup>
import { AuthenticatedLayout } from "@/Layouts/Adminlte/index.js";
import { onMounted, computed } from "vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import Avatar from 'primevue/avatar';
import { usePage } from "@inertiajs/vue3";
import { useProfileNoteStore, useProfilesManagerStore, useProfileCommunicationStore } from "@/stores/index.js";
import { FunctionsHelper } from "@/helpers/index.js";
import Editor from "primevue/editor";
import NegotiumButton from "@/Components/negotium/Button.vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);

const toast = useToast();
const profileManagerStore = useProfilesManagerStore();
const profileNoteStore = useProfileNoteStore();
const profileCommunicationStore = useProfileCommunicationStore();

onMounted(() => {
  profileManagerStore.handleProfileDivHeight()
  document.addEventListener('DOMContentLoaded',profileManagerStore.handleProfileMenuDivHeight);
  window.addEventListener('resize', profileManagerStore.handleProfileDivHeight);
  window.addEventListener('resize', profileManagerStore.handleProfileMenuDivHeight);
});

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
          <a class="px-4 py-2 header-btn rounded-custom-25 border justify-center items-center text-white">Add Profile</a>
        </div><!-- /.col -->
      </div>
      <div class="row mb-0 mt-1">
        <div class="col-md-12 pt-4">
          <div class="row">
            <div v-for="(profileType, index) in profileManagerStore.profileTypes" :key="index" class="px-1 mb-1">
              <button @click="FunctionsHelper.navigateTo(route(route().current(), {'id': profileType.profiles[0].id})+'?pt='+profileType.id)" :class="['float-right h-[38px] p-3 bg-white rounded border border-neutral-700 justify-center items-center gap-2 inline-flex ml-1 text-xs font-bold cursor-pointer', { 'bg-zinc-100 text-yellow-100' : profileManagerStore.isSelected('profileType', profileType) }]">{{profileType.name}}</button>
            </div>
          </div>
        </div>
        </div>
    </template>
    <template #profile>
    <div class="content-container">

      <div class="row" id="profiles-sidebar">
        <div class="col-lg-2 col-md-3 col-sm-12 border-right pr-0">
          <div v-for="(profile, index) in profileManagerStore.profiles" :key="index" @click="FunctionsHelper.navigateTo(route(route().current(), {'id': profile.id})+'?pt='+profileManagerStore.profileType.id)" :class="{ 'bg-slate-500': profileManagerStore.profile.id === profile.id }" class="w-100 py-2 h-14 border-b border-gray-200 justify-start items-center gap-3 inline-flex cursor-pointer">
            <div class="w-100 pl-6 pr-2 d-flex">
            <Avatar class="p-overlay-badge align-middle mr-2 w-[40px]" size="large" :image="profileManagerStore.apiImagesUrl+profile.avatar"  />
            <span :class="profileManagerStore.profile.id === profile.id ? 'text-white' : 'text-neutral-700'" class="flex items-center justify-center text-sm font-medium font-['Roboto'] leading-tight"> {{ profile.profile_name }} </span>
            <div class="row mb-2"></div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-12 pl-0 pr-0 profile-info" id="profiles-detail" style="position:relative">
          <div v-show="profileManagerStore.isSelected('profile', profileManagerStore.profile)" class="pt-3 border-right pr-3 pl-3 col-md-12" id="profiles-detail-content">
            <div class="row mb-2 pl-2">
              <table class="w-100">
                <tr>
                  <td rowspan="3" class="w-[60px] align-top">
                    <Avatar class="align-top fit-hw" :image="profileManagerStore.apiImagesUrl+profileManagerStore.profile.avatar" />
                  </td>
                  <td class="pl-2">
                    <span class="w-60 text-neutral-700 text-[1.5rem] font-bold font-['Roboto'] leading-tight">{{ profileManagerStore.profile.profile_name }} </span>
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
              <button @click="profileCommunicationStore.showSendEmail(profileManagerStore.profile.id)" class="flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Send email</button>
              <button class="ml-auto flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Send message</button>
              <button @click="profileNoteStore.showAddNote(profileManagerStore.profile.id)" class="ml-1 flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">+ Add Note</button>
            </div>

            <div class="row mb-3"></div>
            <div id="profile-view-menu">
            <h2 class="font-bold mb-2">Profile navigation</h2>
            <div><a :href="route('profile.processes', {'id': profileManagerStore.profile.id})+'?pt='+profileManagerStore.profileType.id" :class="{' bg-slate-500 text-white' : route().current('profile.processes')}" class="w-100 px-4 py-2 rounded rounded-lg justify-between items-center inline-flex border border-neutral-200 hover:text-gray-700">Processes <i class="fa fa-chevron-right float-right"></i></a></div>
            <div><a :href="route('profile.profile-details', {'id': profileManagerStore.profile.id})+'?pt='+profileManagerStore.profileType.id" :class="{' bg-slate-500 text-white' : route().current('profile.profile-details') || route().current('profile.profile-details.edit')}" class="w-100 px-4 py-2 rounded rounded-lg justify-between items-center inline-flex border border-neutral-200 mt-1 hover:text-gray-700">Profile Details <i class="fa fa-chevron-right float-right"></i></a></div>
            <div><a :href="route('profile.communications', {'id': profileManagerStore.profile.id})+'?pt='+profileManagerStore.profileType.id" :class="{' bg-slate-500 text-white' : route().current('profile.communications')}" class="w-100 px-4 py-2 rounded rounded-lg justify-between items-center inline-flex border border-neutral-200 mt-1 hover:text-gray-700">Communications <i class="fa fa-chevron-right float-right"></i></a></div>
            <div><a :href="route('profile.documents', {'id': profileManagerStore.profile.id})+'?pt='+profileManagerStore.profileType.id" :class="{' bg-slate-500 text-white' : route().current('profile.documents')}" class="w-100 px-4 py-2 rounded rounded-lg justify-between items-center inline-flex border border-neutral-200 mt-1 hover:text-gray-700">Documents <i class="fa fa-chevron-right float-right"></i></a></div>
            <div><a :href="route('profile.notes', {'id': profileManagerStore.profile.id})+'?pt='+profileManagerStore.profileType.id" :class="{' bg-slate-500 text-white' : route().current('profile.notes')}" class="w-100 px-4 py-2 rounded rounded-lg justify-between items-center inline-flex border border-neutral-200 mt-1 hover:text-gray-700">Notes & Reminders <i class="fa fa-chevron-right float-right"></i></a></div>
            <div class="row mb-7"></div>
          </div>
          <div class="row col-md-12 p-0 m-0" id="client-view-menu">
            <h2 class="font-bold mb-2 col-md-12 p-0">Client view</h2>
            <div class="col-md-12 p-0"><a href="" class=" col-md-12 px-4 py-2 rounded rounded-lg justify-between items-center inline-flex border border-neutral-200 hover:text-gray-700">Requested information <i class="fa fa-chevron-right float-right"></i></a></div>
            <div class="col-md-12 p-0"><a href="" class=" col-md-12 px-4 py-2 rounded rounded-lg justify-between items-center inline-flex border border-neutral-200 mt-1 hover:text-gray-700">Profile Access <i class="fa fa-chevron-right float-right"></i></a></div>
          </div>
          </div>
        </div>
        <!-- Profile Page Start -->
        <div class="col-lg-7 col-md-5 col-sm-12 pl-0 pr-0">
          <slot/>
        </div>
        <!-- Profile Page End -->
      </div>
    </div>
    </template>
  </AuthenticatedLayout>
  <Dialog v-model:visible="profileNoteStore.show_add_note" :draggable="false" modal header="Add note or reminder" :style="{ width: '40vw' }" :class="'notes-dialog'" :breakpoints="{ '1199px': '75vw', '575px': '90vw' } ">
    <template #header>
      <div class="row m-0 p-0 pb-2">
        <div class="text-neutral-700 text-[1.5rem] font-bold font-['Roboto'] leading-loose w-100">Add note or reminder</div>
      </div>
    </template>
    <div>
      <span class="text-neutral-700 text-sm font-normal font-['Nunito'] leading-3 pb-2">Note Subject</span>
      <div class="w-100">
        <input v-model="profileNoteStore.note.subject" type="text" class="form-control">
      </div>
    </div>
    <div class="mt-2">
      <span class="text-neutral-700 text-sm font-normal font-['Nunito'] leading-3 pb-2">Note</span>
      <Editor v-model="profileNoteStore.note.note" editorStyle="height: 120px" />
    </div>
    <div class="mt-2">
      <span class="text-neutral-700 text-sm font-normal font-['Nunito'] leading-3 mb-4">Set Reminder</span>
      <div class="d-flex gap-2 w-100">
        <input v-model="profileNoteStore.note.reminder_date" type="date" class="form-control">
        <input v-model="profileNoteStore.note.reminder_time" type="time" class="form-control">
      </div>
    </div>
    <template #footer>
      <div class="row">
        <div class="col-12 p-4 pr-0 text-right">
          <button class="gap-2 justify-center py-2 px-4 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white mr-2" @click="profileNoteStore.show_add_note = false">Cancel</button>
          <negotium-button v-if="!profileNoteStore.loading"  @click="profileNoteStore.create(toast)" :value="'Add Note'"></negotium-button>
          <button v-if="profileNoteStore.loading"  class="px-4 py-2 bg-neutral-700 rounded-custom-25 border border-neutral-700 justify-center items-center text-white" disabled><i class="pi pi-spin pi-spinner"></i> Loading ...</button>
        </div>
      </div>
    </template>
  </Dialog>
  <!-- Email Dialog -->
  <Dialog v-model:visible="profileCommunicationStore.show_send_email" :draggable="false" modal header="Send Email" :style="{ width: '63vw' }" :class="'notes-dialog'" :breakpoints="{ '1199px': '75vw', '575px': '90vw' } ">
    <template #header>
      <div class="row m-0 p-0 pb-2">
        <div class="text-neutral-700 text-[1.5rem] font-bold font-['Roboto'] leading-loose w-100">Send Email</div>
      </div>
    </template>
    <div class="w-100 mb-2">
      <input v-model="profileCommunicationStore.communication._to" type="text" class="form-control" placeholder="To:">
    </div>
    <div class="w-100">
      <input v-model="profileCommunicationStore.communication.subject" type="text" class="form-control" placeholder="Subject: ">
    </div>
    <div class="mt-2">
      <span class="text-neutral-700 text-sm font-normal font-['Nunito'] leading-3 pb-2">Message</span>
      <Editor v-model="profileCommunicationStore.communication.message" editorStyle="height: 120px" />
    </div>
    <template #footer>
      <div class="row">
        <div class="col-12 p-4 pr-0 text-right">
          <button class="gap-2 justify-center py-2 px-4 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white mr-2" @click="profileCommunicationStore.show_send_email = false; this.profileCommunicationStore.resetCommunication()">Cancel</button>
          <negotium-button v-if="!profileCommunicationStore.loading"  @click="profileCommunicationStore.create(toast, profileManagerStore.profile)" :value="'Send'"></negotium-button>
          <button v-if="profileCommunicationStore.loading"  class="px-4 py-2 bg-neutral-700 rounded-custom-25 border border-neutral-700 justify-center items-center text-white" disabled><i class="pi pi-spin pi-spinner"></i> Loading ...</button>
        </div>
      </div>
    </template>
  </Dialog>
  <Toast position="top-center">
    <template #message="slotProps">
        <div class="flex flex-column align-items-start" style="flex: 1">
            <div class="font-medium text-sm my-1 text-900">{{ slotProps.message.detail }}</div>
        </div>
    </template>
  </Toast>
</template>