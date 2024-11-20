<script setup>
import FileUpload from "primevue/fileupload";
import { useToast } from "primevue/usetoast";
import { useProfileCommunicationStore } from "@/stores/index.js";

const toast = useToast();
const profileCommunicationStore = useProfileCommunicationStore();

</script>

<template>
  <div class="upload-button-group mt-2">
    <FileUpload name="demo[]" url="/api/upload" @upload="onAdvancedUpload($event)" :multiple="true" accept="image/*" :maxFileSize="1000000">
      <template #empty>
        <span>Drag and drop files to here to upload.</span>
      </template>
    </FileUpload>
  </div>
</template>

<style scoped>
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