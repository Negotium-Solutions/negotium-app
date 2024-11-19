<script setup>
import { useProfileCommunicationStore } from "@/stores/index.js";

const profileCommunicationStore = useProfileCommunicationStore();
</script>

<template>
  <div class="w-100 mt-2">
    <div class="input-group mb-3">
      <input type="number" class="form-control" >
      <div class="input-group-append">
        <span class="input-group-text">%</span>
      </div>
    </div>
  </div>
</template>