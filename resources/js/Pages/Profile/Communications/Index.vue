<script setup>
import { useProfilesManagerStore, useProfileCommunicationStore } from "@/stores/index.js";
import Button from "primevue/button";
import {computed, onMounted} from "vue";
import { usePage } from "@inertiajs/vue3";
import ExtendProfileLayout from "@/Pages/Profile/ProfileLayout.vue";
import {FunctionsHelper} from "@/helpers/index.js";

const profileManagerStore = useProfilesManagerStore();
const messages = computed(() => usePage().props.messages);
const no_communications_for_profile = messages.value.communication.no_communications_for_profile;
const profileCommunicationStore = useProfileCommunicationStore();

const props = defineProps({
  profileTypes: Array,
  profileTypeId: 0,
  profileId: 0,
  apiUrl: String,
  apiImagesUrl: String,
  profile: Object,
  lookup: null
});

onMounted(() => {
  profileManagerStore.setProfileData(props);
  profileCommunicationStore.setLookUp('communicationTypes', props.lookup.communicationTypes);
  console.log(profileCommunicationStore);
});


</script>

<template>
  <ExtendProfileLayout>
  <div v-if="profileManagerStore.isSelected('profile', profileManagerStore.profile)" class="col-lg-12 pl-0 pr-0">
    <div class="d-flex w-100 pt-3 pl-3 pr-3 pb-3">
      <div class="col-sm-6">
        <h1 class="text-neutral-700 text-[1.5rem] font-bold font-['Roboto']">Communication</h1>
      </div>
      <div class="col-sm-6 text-right">
        <button class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Send email</button>
        <button class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white ml-2">Send message</button>
      </div>
    </div>

    <div class="col-md-12 pl-3 pr-3">
      <div v-if="profileManagerStore.profile.communications.length > 0">
        <div class="d-flex gap-2 pr-2 ml-3 mb-2">
          <button :class="['flex gap-2 justify-center py-2.5 px-3 text-xs leading-3 rounded border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white', { 'bg-neutral-700 text-white' : profileCommunicationStore.isSelectedCommunication(0) }]" @click="profileCommunicationStore.toogleCommunication(0)">All</button>
          <button v-for="(communicationType, id) in profileCommunicationStore.lookup.communicationTypes" :key="id" :class="['flex gap-2 justify-center py-2.5 px-3 text-xs leading-3 rounded border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white', { 'bg-neutral-700 text-white' : profileCommunicationStore.isSelectedCommunication(id) }]" @click="profileCommunicationStore.toogleCommunication(id)"><i class="fa fa-square" :style="'color:LightBlue'"></i>{{ communicationType }}</button>
         </div>
        <div v-for="(communication, index) in profileCommunicationStore.filterByCommunicationType(profileManagerStore.profile.communications)" :key="index" class="flex items-start border-b border-gray-300 p-4 bg-white">
          <div class="flex w-[68px] h-[68px] p-2 bg-[#f2f6f7] rounded-custom-50 justify-center items-center">
            <span class="text-sm font-bold">{{ communication.communication_type.name }}</span>
          </div>
          <div class="flex-1 flex flex-col pl-4"><div class="flex items-center justify-between mb-1">
            <div class="flex items-center">
              <div class="text-neutral-400 text-sm font-normal font-['Roboto'] leading-tight">{{ communication.user.first_name }} {{ communication.user.last_name }} </div>
              <div class="text-neutral-400 text-sm font-normal font-['Roboto'] leading-tight text-red">{{ communication.communication_type_id === 1 ? ' (4)' : '' }} </div>
            </div>
              <div class="flex items-center">
                <span class="text-right text-sm font-normal font-['Roboto'] leading-tight text-neutral-400">{{ FunctionsHelper.DateTime(communication.created_at) }}</span>
              </div>
            </div>
            <div class="flex items-center justify-between mb-1">
              <div class="text-neutral-700 text-sm font-medium font-['Roboto'] leading-tight">{{ communication.subject }}</div>
            </div>
            <div class="flex items-end justify-between mt-1">
              <div class="text-sm font-normal font-['Nunito'] leading-tight text-neutral-400 mr-2">
                <span>{{ communication.message }}</span>
              </div>
              <div class="flex items-end">
                <span class="text-right text-sm font-bold font-['Roboto'] leading-tight text-orange-1">{{ communication.status_id === 2 ? communication.status.name : ''}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table v-else class="w-100 mt-4 pt-4">
        <tr>
          <td>
            <div class="text-center" v-html="no_communications_for_profile"></div>
            <div class="text-center mt-4">
              <button class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">View Guide</button>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
  </ExtendProfileLayout>
</template>

<style scoped>

</style>