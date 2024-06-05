<script setup>

import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import { onMounted, reactive, ref, computed } from "vue";
import Breadcrumb from 'primevue/breadcrumb';
import Dropdown from 'primevue/dropdown';

const props = defineProps({
  processes: Array,
  categories: Object,
  selectedOption: String
});

const pageProps = reactive({
  processes: Array,
  selectedOption: "d",
  selectedCategory: 0
});

function activitiesCounter(steps) {
  let counter = 0;
  steps.forEach((step) => {
    counter += step.activities.length;
  });
  return counter;
}

const sortByOptions = ref([
  { name: 'Latest First', code: 'd' },
  { name: 'Oldest First', code: 'a' },
  { name: 'Process', code: 'p' },
  { name: 'Steps', code: 's' },
  { name: 'Activities', code: 'l' }
]);

onMounted(() =>{
  pageProps.processes = props.processes;
  for(let v in props.categories){
    console.log(props.categories[v])
  }
});

function filterByCategory(category_id) {
  pageProps.selectedCategory = category_id;
  pageProps.processes = [];
  let counter = 0;
  props.processes.forEach((process, index) => {
    if(process.category.id === category_id) {
      pageProps.processes.push(process);
      counter++;
    } else if (category_id === 0) {
      pageProps.processes.push(process);
    }
  });
}

</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <div class="col-sm-6">
        <h1 class="text-neutral-700 text-4xl font-bold font-['Roboto']">Processes</h1>
        <ol class="breadcrumb sm">
          <li class="breadcrumb-item"><a href="#">Home</a></li>
          <li class="breadcrumb-item active">Processes</li>
        </ol>
      </div><!-- /.col -->
      <div class="col-sm-6 text-right pt-3">
        <a :href="route('process.create')" class="px-4 py-2 bg-neutral-700 rounded border border-neutral-700 justify-center items-center text-white">Create Process</a>
      </div><!-- /.col -->
    </template>

    <div class="content-container pl-4 pr-4">

      <div class="row mb-3">
        <div class="col-md-8">
          <div class="row">
            <div class="pr-1 mb-2">
              <button class="flex gap-2 justify-center py-2.5 px-3 text-xs leading-3 rounded border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white" :class="{ 'bg-neutral-700 text-white' : pageProps.selectedCategory === 0 }" @click="filterByCategory(0)">All</button>
            </div>
            <div v-for="(category, index) in props.categories" :key="index" class="px-1 mb-2">
              <button class="flex gap-2 justify-center py-2.5 px-3 text-xs leading-3 rounded border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white" :class="{ 'bg-neutral-700 text-white' : category.id === pageProps.selectedCategory }" @click="filterByCategory(category.id)"><i class="fa fa-square" :style="'color: '+category.color"></i>&nbsp;&nbsp;{{category.name}}</button>
            </div>
          </div>
        </div>
        <div class="col-md-4 text-right">
          <span label-for="sort_by" class="mr-2 col-sm-12">Sort by:</span>
          <Dropdown v-model="pageProps.selectedOption" :options="sortByOptions" optionLabel="name" placeholder="Please Select" checkmark :highlightOnSelect="false" class="border-neutral-700/opacity-20 text-neutral-700 text-xs font-normal font-['Nunito']" />
        </div>
      </div>

      <div class="row">
        <div class="col-md-3 mb-3" v-for="(process, index) in pageProps.processes" :key="index">
        <div class="flex flex-col px-4 py-6 rounded-lg border border-solid bg-neutral-50 border-neutral-700">
          <div class="flex gap-5">
            <div class="flex-auto text-lg font-bold leading-6 text-neutral-700">
              {{ process.name }}
            </div>
            <div class="flex flex-col items-center">
                <button type="button" class="btn btn-tool mt-0">
                  <i class="pi pi-ellipsis-v"></i>
                </button>
            </div>
          </div>
          <div class="mt-1 text-xs leading-3" :style="'color: '+process.category.color">{{ process.category.name }}</div>
          <div class="shrink-0 mt-3 h-px rounded-sm bg-neutral-700"></div>
          <div class="mt-2.5 text-sm leading-5 text-neutral-700">
            00 Steps | 00 Activities
          </div>
          <div class="mt-2 text-xs leading-3 text-neutral-700">
            000 Profiles linked
          </div>
        </div>
        </div>
        <!-- <div class="col-md-3" v-for="(process, index) in pageProps.processes" :key="index">
          <div class="card card-default">
            <div class="card-header">
              <h3 class="card-title font-weight-bold">
                {{ process.name }} <br/>
                <small v-if="process.category" class="font-medium">{{ process.category.name }}</small>
              </h3>
              <div class="card-tools">
              </div>
            </div>
            <div class="card-body">
              <div>{{ process.steps.length }} Steps | {{ activitiesCounter(process.steps) }} Activities</div>
            </div>
          </div>
        </div> -->
      </div>

    </div>
  </AuthenticatedLayout>
</template>

<style scoped>
</style>