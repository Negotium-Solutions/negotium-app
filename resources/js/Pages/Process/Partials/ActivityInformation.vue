<script setup>
import { useActivitiesStore } from "@/stores";
import { onMounted } from "vue";

const activityStore = useActivitiesStore();

const props = defineProps({

});

onMounted(() => {

});
</script>

<template>
  <div class="col-md-2 col-sm-12 pr-0">
    <div class="card card-default">
      <div class="card-header border-bottom-0 pb-0">
        <div class="text-neutral-700 text-[1.25rem] font-bold font-['Roboto'] leading-loose">Activities</div>
      </div>
      <!-- /.card-header -->
      <div class="card-body">
        <div class="mb-3" v-for="(activity, index) in activityStore.activities" :key="index">
          <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Title & Description</div>
          <p class="mt-1 text-sm font-medium font-['Roboto'] leading-tight text-bold mb-2">
            {{ activity.label }}
            <i class="pi pi-times float-right"></i>
          </p>
          <hr/>
        </div>
      </div>
      <!-- /.card-body -->
    </div>
  </div>
</template>