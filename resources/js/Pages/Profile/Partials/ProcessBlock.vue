<script setup>
  import { useProcessesStore } from "@/stores";

  const processStore = useProcessesStore();
</script>

<template>
  <div class="row">
    <div class="col-md-4 col-sm-12 mb-3" v-for="(process, index) in processStore.getProcesses()" :key="index">
      <div class="flex flex-col px-4 py-6 rounded-lg border border-solid bg-neutral-50 border-neutral-700">
        <div class="flex gap-5">
          <div class="flex-auto text-lg font-bold leading-6 text-neutral-700">
            {{ process.name }}
          </div>
        </div>
        <div v-if="process.category" class="mt-1 text-xs leading-3" :style="'color: '+process.category.color">{{ process.category.name }}</div>
        <div class="shrink-0 mt-3 h-px rounded-sm bg-neutral-700"></div>
        <div class="mt-2.5 text-sm leading-5 text-neutral-700">
          <div>{{ process.steps.length }} Steps | {{ (typeof process.steps.activities !== 'undefined') ? process.steps.activities.length : 0 }} Activities</div>
        </div>
      </div>
    </div>
  </div>
</template>