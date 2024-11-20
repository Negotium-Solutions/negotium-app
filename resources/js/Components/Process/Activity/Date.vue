<script setup>
import { useProfileCommunicationStore } from "@/stores/index.js";

const profileCommunicationStore = useProfileCommunicationStore();
</script>

<template>
  <div class="w-100 mt-2">
    <div class="input-group date" id="reservationdate" data-target-input="nearest">
      <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate">
      <div class="input-group-append" data-target="#reservationdate" data-toggle="datetimepicker">
        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
      </div>
    </div>
  </div>
</template>