<script setup>
import NegotiumButton from "@/Components/negotium/Button.vue";
import Button from "primevue/button";
import Editor from "primevue/editor";
import FileUpload from "primevue/fileupload";
import Dialog from "primevue/dialog";
import { useProfilesManagerStore, useProfileCommunicationStore } from "@/stores/index.js";
import { useToast } from "primevue/usetoast";

const profileManagerStore = useProfilesManagerStore();
const profileCommunicationStore = useProfileCommunicationStore();
const toast = useToast();
</script>

<template>
  <Dialog v-model:visible="profileCommunicationStore.show_send_email" :draggable="false" modal header="Send Email" :style="{ width: '63vw' }" :class="'notes-dialog'" :breakpoints="{ '1199px': '75vw', '575px': '90vw' } ">
    <template #header>
      <div class="row m-0 p-0 pb-2">
        <div class="text-neutral-700 text-[1.5rem] font-bold font-['Roboto'] leading-loose w-100">Send Email</div>
      </div>
    </template>
    <div class="w-100 mb-2">
      <div class="input-group date" id="to-email">
        <input v-model="profileCommunicationStore.communication.to" type="text" class="form-control" placeholder="To:" disabled>
        <div class="input-group-append">
          <div @click="profileCommunicationStore.toogleCc()" class="input-group-text cursor-pointer hover:underline border-0">Cc</div>
          <div @click="profileCommunicationStore.toogleBcc()" class="input-group-text cursor-pointer hover:underline border-0">Bcc</div>
        </div>
      </div>
    </div>
    <div v-if="profileCommunicationStore.show_cc" class="w-100 mt-2 email-container">
      <div v-for="(email, index) in profileCommunicationStore.communication.cc" :key="index" class="email-tag">
        <span>{{ email }}</span>
        <i class="pi pi-times-circle" @click="profileCommunicationStore.removeEmail(profileCommunicationStore.communication.cc, index)"></i>
      </div>
      <div class="flex-1">
        <input
            type="text"
            class="emails-input m-0 w-full border-0 rounded-custom-10 h-9 focus:outline-none focus:border-transparent"
            v-model="profileCommunicationStore.currentEmailInputCc"
            @keyup.enter="profileCommunicationStore.addEmail('cc', profileCommunicationStore.communication.cc, toast)"
            placeholder="Type an email and press Enter"
        />
      </div>
    </div>
    <div v-if="profileCommunicationStore.show_bcc" class="w-100 mt-2 email-container">
      <div v-for="(email, index) in profileCommunicationStore.communication.bcc" :key="index" class="email-tag">
        <span>{{ email }}</span>
        <i class="pi pi-times-circle" @click="profileCommunicationStore.removeEmail(profileCommunicationStore.communication.bcc, index)"></i>
      </div>
      <div class="flex-1">
        <input
            type="text"
            class="emails-input m-0 w-full border-0 rounded-custom-10 h-9"
            v-model="profileCommunicationStore.currentEmailInputBcc"
            @keyup.enter="profileCommunicationStore.addEmail('bcc', profileCommunicationStore.communication.bcc, toast)"
            placeholder="Type an email and press Enter"
        />
      </div>
    </div>
    <div class="w-100 mt-2">
      <input v-model="profileCommunicationStore.communication.subject" type="text" class="form-control" placeholder="Subject: ">
    </div>
    <div class="mt-2">
      <span class="text-neutral-700 text-sm font-normal font-['Nunito'] leading-3 pb-2">Message</span>
      <Editor v-model="profileCommunicationStore.communication.message" editorStyle="height: 120px" />
    </div>
    <div class="upload-button-group mt-2">
      <FileUpload name="demo[]" url="/api/upload" @upload="onAdvancedUpload($event)" :multiple="true" accept="image/*" :maxFileSize="1000000">
        <template #empty>
          <span>Drag and drop files to here to upload.</span>
        </template>
      </FileUpload>
    </div>
    <template #footer>
      <div class="row">
        <div class="col-12 p-4 pr-0 text-right">
          <button class="gap-2 justify-center py-2 px-4 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white mr-2" @click="profileCommunicationStore.show_send_email = false; profileCommunicationStore.resetCommunication()">Cancel</button>
          <negotium-button v-if="!profileCommunicationStore.loading"  @click="profileCommunicationStore.sendEmail(toast, profileManagerStore.profile)" :value="'Send'"></negotium-button>
          <button v-if="profileCommunicationStore.loading"  class="px-4 py-2 bg-neutral-700 rounded-custom-25 border border-neutral-700 justify-center items-center text-white" disabled><i class="pi pi-spin pi-spinner"></i> Loading ...</button>
        </div>
      </div>
    </template>
  </Dialog>

</template>

<style scoped>
.email-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border: 1px solid #ccc;
  padding: 0px;
  border-radius: 4px;
}

.email-tag {
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
  background-color: #e0f7fa;
  padding: 4px 8px;
  border-radius: 9px;
  height: 25px;
}

.email-tag .pi {
  margin-left: 4px;
  cursor: pointer;
}

.email-tag:hover {
  background-color: #b2ebf2;
}

.emails-input {
  border: none;
  outline: none;
  flex-grow: 1;
  padding: 4px;
}

.emails-input::placeholder {
  color: #ccc;
}

.emails-input:focus {
  outline: none;
  border-color: transparent;
  border: none;
}

.p-fileupload-buttonbar {
  margin: -10px !important;
}

.p-fileupload-content {
  margin: -10px !important;
}

.p-fileupload-choose {
  color: #334155;
  background: transparent;
  border: 0px;
}

.p-focus {
  border: 0px;
}

input {
  outline: 0px;
}

.p-fileupload .p-fileupload-buttonbar .p-button.p-fileupload-choose.p-focus {
  outline: 0px;
  outline-offset: 2px;
  box-shadow: none;
}

.p-fileupload-file-name {
  display: none;
}

.p-fileupload-file {
  margin: 0px;
  padding: 0px;
}
</style>