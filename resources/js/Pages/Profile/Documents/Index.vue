<script setup>
import { useProfilesManagerStore, useProfileDocumentStore } from "@/stores/index.js";
import Button from "primevue/button";
import { computed, onMounted } from "vue";
import { usePage } from "@inertiajs/vue3";
import ExtendProfileLayout from "@/Pages/Profile/ProfileLayout.vue";
import {FunctionsHelper} from "@/helpers/index.js";

const profileManagerStore = useProfilesManagerStore();
const profileDocumentStore = useProfileDocumentStore();
const messages = computed(() => usePage().props.messages);
const no_documents_for_profile = messages.value.document.no_documents_for_profile;

const props = defineProps({
  profileTypeId: 0,
  profileTypes: Array,
  profile: Object,
  apiUrl: String,
  apiImagesUrl: String,
  lookup: null
});

onMounted(() => {
  profileManagerStore.setProfileData(props);
});
</script>

<template>
  <ExtendProfileLayout>
  <div v-if="profileManagerStore.isSelected('profile', profileManagerStore.profile)" class="col-lg-12 pl-0 pr-0">
    <div class="d-flex w-100 pt-3 pl-3 pr-3 pb-3">
      <div class="col-sm-6">
        <h1 class="text-neutral-700 text-[1.5rem] font-bold font-['Roboto']">Documents</h1>
      </div>
      <div class="col-sm-6 text-right">
        <button class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Upload Document</button>
      </div>
    </div>
    <div class="col-md-12 pl-3 pr-3">
      <table v-if="profileManagerStore.profile.documents && profileManagerStore.profile.documents.length > 0" class="table-sm w-100 table-row-spacing table-bg">
        <tr>
          <th>Type</th><th>File Name</th><th>Uploader</th><th>Date Added</th><th>Actions</th>
        </tr>
        <tr v-for="(document, index) in profileManagerStore.profile.documents" :key="index">
          <td>
            <i :class="profileDocumentStore.getIconByDocumentType(document.type)" style="font-size: 1.5em;"></i>
          </td>
          <td>{{ document.name }}</td>
          <td>{{ document.user.first_name }} {{ document.user.last_name}}</td>
          <td>{{ FunctionsHelper.DateTime(document.created_at) }}</td>
          <td class="last pl-2">
            <div class="d-flex">
              <button class="flex justify-center py-2 px-3 text-xs leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">View</button>
              <div class="flex flex-col items-center pl-2">
                <button @click="profileDocumentStore.downloadDocument(document.path)" type="button" class="w-[30px] h-[30px] bg-[#dae3e7] rounded justify-center items-center gap-1 inline-flex">
                  <i class="pi pi-download"></i>
                </button>
              </div>
              <div class="flex flex-col items-center pl-2">
                <button @click="profileManagerStore.set('document', document)" type="button" data-toggle="dropdown" class="w-[30px] h-[30px] bg-[#dae3e7] rounded justify-center items-center gap-1 inline-flex">
                  <i class="pi pi-ellipsis-v"></i>
                </button>
              </div>
            </div>
          </td>
        </tr>
      </table>
      <table v-else class="w-100 mt-4 pt-4">
        <tr>
          <td>
            <div class="text-center" v-html="no_documents_for_profile"></div>
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