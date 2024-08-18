<script setup>
import { useProfilesManagerStore } from "@/stores/index.js";
import Button from "primevue/button";
import {computed, onMounted} from "vue";
import { usePage } from "@inertiajs/vue3";
import ExtendProfileLayout from "@/Pages/Profile/ProfileLayout.vue";

const profileManagerStore = useProfilesManagerStore();
const messages = computed(() => usePage().props.messages);
const no_communications_for_profile = messages.value.communication.no_communications_for_profile;
const show_default_page = false;

const props = defineProps({
  profileTypeId: 0,
  profileTypes: Array,
  profile: Object,
  apiUrl: String,
  apiImagesUrl: String,
  navigation: String,
  lookup: null
});

onMounted(() => {
  profileManagerStore.setProfileData(props);
});
</script>

<template>
  <ExtendProfileLayout>
  <div v-if="profileManagerStore.isSelected('profile', profileManagerStore.profile)" class="col-lg-12 pl-0 pr-0">
    <div class="d-flex w-100 pt-3 pl-2 pr-2 pb-3">
      <div class="col-sm-6">
        <h1 class="text-neutral-700 text-[1.5rem] font-bold font-['Roboto']">Communication</h1>
      </div>
      <div class="col-sm-6 text-right">
        <button class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Send email</button>
        <button class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white ml-2">Send message</button>
      </div>
    </div>

    <div class="col-md-12 pl-2 pr-2">
      <div v-if="show_default_page === false">
      <div class="d-flex gap-2 pr-2 ml-3 mb-2">
        <button :class="['flex gap-2 justify-center py-2.5 px-3 text-xs leading-3 rounded border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white']">All</button>
        <button :class="['flex gap-2 justify-center py-2.5 px-3 text-xs leading-3 rounded border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white']"><i class="fa fa-square" :style="'color:LightBlue'"></i>Email</button>
        <button :class="['flex gap-2 justify-center py-2.5 px-3 text-xs leading-3 rounded border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white']"><i class="fa fa-square" :style="'color:LightGray'"></i>WhatsApp</button>
        <button :class="['flex gap-2 justify-center py-2.5 px-3 text-xs leading-3 rounded border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white']"><i class="fa fa-square" :style="'color:Gray'"></i>SMS</button>
        <button :class="['flex gap-2 justify-center py-2.5 px-3 text-xs leading-3 rounded border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white']"><i class="fa fa-square" :style="'color:DarkGrey'"></i>In-System</button>
      </div>
      <!-- <table v-if="profileManagerStore.communications.length > 0" class="table-sm w-100 table-row-spacing table-bg">      </table>-->
      <div class="flex items-start border-b border-gray-300 p-4 bg-white">
        <!-- Icon Container -->
        <div class="flex w-[68px] h-[68px] p-2 bg-[#f2f6f7] rounded-custom-50 justify-center items-center">
          <span class="text-sm font-bold">Email</span>
        </div>

        <!-- Details Container -->
        <div class="flex-1 flex flex-col pl-4">
          <!-- Header -->
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center">
              <div class="text-neutral-400 text-sm font-normal font-['Roboto'] leading-tight">Alfredo, Benjamin (4)</div>
            </div>
            <div class="flex items-center">
              <span class="text-right text-sm font-normal font-['Roboto'] leading-tight text-neutral-400">12/05/2024 - 13:12</span>
            </div>
          </div>

          <!-- Subject -->
          <div class="flex items-center justify-between mb-1">
            <div class="text-neutral-700 text-sm font-medium font-['Roboto'] leading-tight">Subject: Lorem ipsum</div>
          </div>

          <!-- Body -->
          <div class="flex items-end justify-between mt-1">
            <div class="text-sm font-normal font-['Nunito'] leading-tight text-neutral-400 mr-2">
              <span>Lorem ipsum dolor sit amet consectetur. Id blandit sed consequat nunc condimentum sem nunc ullamcorper cursus. Viverra commodo duis gravida pellentesque.</span>
            </div>
            <div class="flex items-end">
              <span class="text-right text-sm font-bold font-['Roboto'] leading-tight text-orange-1">Unread</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-start border-b border-gray-300 p-4 bg-white">
          <!-- Icon Container -->
          <div class="flex w-[68px] h-[68px] p-2 bg-[#dae3e7] rounded-custom-50 justify-center items-center">
            <span class="text-sm font-bold">WA</span>
          </div>

          <!-- Details Container -->
          <div class="flex-1 flex flex-col pl-4">
            <!-- Header -->
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center">
                <div class="text-neutral-700 text-sm font-normal font-['Roboto'] leading-tight">Sent by: Benjamin Button</div>
              </div>
              <div class="flex items-center">
                <span class="text-right text-sm font-normal font-['Roboto'] leading-tight text-neutral-400">12/05/2024 - 13:12</span>
              </div>
            </div>
            <!-- Body -->
            <div class="flex items-end justify-between mt-1 gap-1">
              <div class="flex text-sm font-normal font-['Nunito'] leading-tight text-neutral-400 mr-2">
                <span>Lorem ipsum dolor sit amet consectetur. Id blandit sed consequat nunc condimentum sem nunc ullamcorper cursus. Viverra commodo duis gravida pellentesque.</span>
              </div>
              <div class="flex items-end">
                <span class="text-right text-sm font-bold font-['Roboto'] leading-tight text-orange-1">Unread</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex items-start border-b border-gray-300 p-4 bg-white">
          <!-- Icon Container -->
          <div class="flex w-[68px] h-[68px] p-2 bg-[#c1d0d7] rounded-custom-50 justify-center items-center">
            <span class="text-sm font-bold">SMS</span>
          </div>

          <!-- Details Container -->
          <div class="flex-1 flex flex-col pl-4">
            <!-- Header -->
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center">
                <div class="text-neutral-700 text-sm font-normal font-['Roboto'] leading-tight">Sent by: Paityn Passaquindici Arcand</div>
              </div>
              <div class="flex items-center">
                <span class="text-right text-sm font-normal font-['Roboto'] leading-tight text-neutral-400">12/05/2024 - 13:12</span>
              </div>
            </div>
            <!-- Body -->
            <div class="flex items-end justify-between mt-1 gap-1">
              <div class="flex text-sm font-normal font-['Nunito'] leading-tight text-neutral-400 mr-2">
                <span>Lorem ipsum dolor sit amet consectetur. Id blandit sed consequat nunc condimentum sem nunc ullamcorper cursus. Viverra commodo duis gravida pellentesque.</span>
              </div>
              <div class="flex items-end">
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex items-start border-b border-gray-300 p-4 bg-white">
          <!-- Icon Container -->
          <div class="flex w-[68px] h-[68px] p-2 bg-[#a8bdc7] rounded-custom-50 justify-center items-center">
            <span class="text-sm font-bold">I-S</span>
          </div>

          <!-- Details Container -->
          <div class="flex-1 flex flex-col pl-4">
            <!-- Header -->
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center">
                <div class="text-neutral-700 text-sm font-normal font-['Roboto'] leading-tight">Sent by: Lydia Schleifer</div>
              </div>
              <div class="flex items-center">
                <span class="text-right text-sm font-normal font-['Roboto'] leading-tight text-neutral-400">12/05/2024 - 13:12</span>
              </div>
            </div>
            <!-- Body -->
            <div class="flex items-end justify-between mt-1 gap-1">
              <div class="flex text-sm font-normal font-['Nunito'] leading-tight text-neutral-400 mr-2">
                <span>Lorem ipsum dolor sit amet consectetur. Id blandit sed consequat nunc condimentum sem nunc ullamcorper cursus. Viverra commodo duis gravida pellentesque.</span>
              </div>
              <div class="flex items-end">
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