<script setup>
import { useActivitiesStore } from "@/stores/index.js";

const activityStore = useActivitiesStore();
</script>

<template>
  <form class="mt-3" v-if="activityStore.activity.type_id > 0">
    <div class="row">
      <div class="col-sm-6">
        <div class="form-group">
          <label class="text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Activity Name</label>
          <input type="text" v-model="activityStore.activity.name" class="form-control form-control-custom" placeholder="Name">
        </div>
      </div>
      <div class="col-sm-6">
        <div class="form-group">
          <label class="text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Activity Label</label>
          <input type="text" v-model="activityStore.activity.label" class="form-control form-control-custom" placeholder="Label">
        </div>
      </div>
    </div>
    <div class="form-group" v-if="activityStore.showGuidanceNote">
      <label class="text-neutral-700 text-xs font-normal font-['Nunito'] leading-3" for="inputWarning">Guidance note</label>
      <input type="text"  v-model="activityStore.activity.guidance_note" class="form-control form-control-custom" id="inputWarning" placeholder="Type the guidance note">
    </div>
  </form>
</template>

<style scoped>

</style>