<script setup>
import { useProfilesManagerStore, useProfileDocumentStore } from "@/stores/index.js";
import Button from "primevue/button";
import { computed, onMounted } from "vue";
import { usePage } from "@inertiajs/vue3";
import ExtendProfileLayout from "@/Pages/Profile/ProfileLayout.vue";
import {FunctionsHelper} from "@/helpers/index.js";
import NegotiumButton from "@/Components/negotium/Button.vue";
import FileUpload from "primevue/fileupload";
import Dialog from "primevue/dialog";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";

const profileManagerStore = useProfilesManagerStore();
const profileDocumentStore = useProfileDocumentStore();
const messages = computed(() => usePage().props.messages);
const no_documents_for_profile = messages.value.document.no_documents_for_profile;
const toast = useToast();
const imagesUrl = computed(() => usePage().props.apiImagesUrl);
const confirm = useConfirm();

const props = defineProps({
  profileTypes: null,
  profileTypeId: null,
  schemaId: null,
  profileId: null,
  apiUrl: null,
  apiImagesUrl: null,
  profiles: null,
  profile: null,
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
        <button @click="profileDocumentStore.show_document_upload = true" class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Upload Document</button>
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
              <button @click="profileDocumentStore.viewDocument(document)" class="flex justify-center py-2 px-3 text-xs leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">View</button>
              <div class="flex flex-col items-center pl-2">
                <a :href="imagesUrl+'/'+document.path" :download="document.path" type="button" class="w-[30px] h-[30px] bg-[#dae3e7] rounded justify-center items-center gap-1 inline-flex">
                  <i class="pi pi-download"></i>
                </a>
              </div>
              <div class="flex flex-col items-center pl-2">
                <button @click="profileManagerStore.set('document', document)" type="button" data-toggle="dropdown" class="w-[30px] h-[30px] bg-[#dae3e7] rounded justify-center items-center gap-1 inline-flex">
                  <i class="pi pi-ellipsis-v"></i>
                </button>
                <div class="dropdown-menu dropdown-menu dropdown-menu-right">
                  <button class="dropdown-item cursor-pointer" @click="profileDocumentStore.showDocumentConfirmation(toast, confirm, document)">
                    <small>Delete</small>
                  </button>
                </div>
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

    <Dialog v-model:visible="profileDocumentStore.show_document_upload" :draggable="false" modal header="Send Email" :style="{ width: '45vw' }" :class="'notes-dialog'" :breakpoints="{ '1199px': '75vw', '575px': '90vw' } ">
      <template #header>
        <div class="row m-0 p-0 pb-2">
          <div class="text-neutral-700 text-[1.5rem] font-bold font-['Roboto'] leading-loose w-100">Upload File</div>
        </div>
      </template>
      <div class="w-100 mt-2">
        <input v-model="profileDocumentStore.document.name" type="text" class="form-control" placeholder="File name: ">
        <div class="input-validation-error" v-if="typeof profileDocumentStore.documentErrors?.name !== 'undefined'">
          <span v-for="(error, index) in profileDocumentStore.documentErrors?.name" :key="index" class="error invalid-feedback">{{ error }}</span>
        </div>
      </div>
      <div class="upload-button-group mt-2">
        <FileUpload  @select="profileDocumentStore.onFileSelect" name="files[]" :customUpload="true" accept="image/*,.pdf,.doc,.docx" :maxFileSize="1000000">
          <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
            <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
              <div class="flex gap-2">
                <Button class="ml-2 mr-9" @click="chooseCallback()" icon="pi pi-images" rounded outlined severity="secondary"><i class="pi pi-plus mr-2"></i> Choose</Button>
                <Button @click="clearCallback()" icon="pi pi-times" rounded outlined severity="danger" :disabled="!files || files.length === 0"><i class="pi pi-times mr-1"></i> Remove</Button>
              </div>
            </div>
          </template>
          <template #empty>
            <span>Drag and drop files to here to upload.</span>
          </template>
        </FileUpload>
        <div class="input-validation-error" v-if="typeof profileDocumentStore.documentErrors?.files !== 'undefined'">
          <span v-for="(error, index) in profileDocumentStore.documentErrors?.files" :key="index" class="error invalid-feedback">{{ error }}</span>
        </div>
      </div>
      <template #footer>
        <div class="row">
          <div class="col-12 p-4 pr-0 text-right">
            <button class="gap-2 justify-center py-2 px-4 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white mr-2" @click="profileDocumentStore.show_document_upload = false; profileDocumentStore.resetDocument()">Cancel</button>
            <negotium-button v-if="!profileDocumentStore.loading"  @click="profileDocumentStore.create(toast, profileManagerStore.profile)" :value="'Save'" :disabled="!profileDocumentStore.isValidForm"></negotium-button>
            <button v-if="profileDocumentStore.loading" class="px-4 py-2 bg-neutral-700 rounded-custom-25 border border-neutral-700 justify-center items-center text-white" disabled><i class="pi pi-spin pi-spinner"></i> Loading ...</button>
          </div>
        </div>
      </template>
    </Dialog>

    <ConfirmDialog :style="{ width: '400px' }">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="flex flex-col w-full gap-4 p-4">
          <span class="text-2xl font-bold font-['Roboto'] leading-loose">{{ message.header }}</span>
          <p class="text-base font-normal font-['Nunito'] leading-normal" v-html="message.message"></p>
        </div>
        <div class="row">
          <div class="col-12 py-3 px-4 text-right">
            <Button label="Cancel" outlined @click="rejectCallback" class="gap-2 justify-center py-2 px-4 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white mr-2"></Button>
            <Button :label="'Yes, Remove'" @click="acceptCallback" class="px-4 py-2 bg-neutral-700 rounded-custom-25 border border-neutral-700 justify-center items-center text-white"></Button>
          </div>
        </div>
      </template>
    </ConfirmDialog>
  </div>
  </ExtendProfileLayout>
</template>