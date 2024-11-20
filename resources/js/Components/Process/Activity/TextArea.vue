<script setup>
import Editor from "primevue/editor";
import { useProfileCommunicationStore } from "@/stores/index.js";

const profileCommunicationStore = useProfileCommunicationStore();
</script>

<template>
  <div class="w-100 mt-2">
    <Editor v-model="profileCommunicationStore.communication.message" editorStyle="height: 120px" />
  </div>
</template>