<script setup>

import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import { onMounted, reactive, ref } from "vue";
import Breadcrumb from 'primevue/breadcrumb';
import Dropdown from 'primevue/dropdown';

const props = defineProps({
  processes: Array,
  categories: Object,
  selectedOption: String
});

const pageProps = reactive({
  processes: Array,
  selectedOption: String,
  selectedCategory: 0
});

const sortByOptions = ref([
  { name: 'Process', code: 'p' },
  { name: 'Steps', code: 's' },
  { name: 'Activities', code: 'l' }
]);

const test = onMounted(() =>{
  pageProps.processes = props.processes;
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
        <h1 class="m-0">Processes</h1>
        <ol class="breadcrumb sm">
          <li class="breadcrumb-item"><a href="#">Home</a></li>
          <li class="breadcrumb-item active">Processes</li>
        </ol>
      </div><!-- /.col -->
      <div class="col-sm-6 text-right pt-3">
        <a :href="route('document.create')" class="btn btn-sm btn-dark">Create Process</a>
      </div><!-- /.col -->
    </template>

    <div class="content-container pl-4 pr-4">

      <div class="row mb-3">
        <div class="col-md-1">
          <button class="btn btn-sm btn-block btn-outline-dark w-100" :class="{ active : pageProps.selectedCategory === 0 }" @click="filterByCategory(0)">All</button>
        </div>
        <div v-for="(category, index) in props.categories" :key="index" class="col-md-1 col-sm-12">
          <button class="btn btn-sm btn-block btn-outline-dark" :class="{ active : category.id === pageProps.selectedCategory }" @click="filterByCategory(category.id)"><i class="fa fa-square" :style="'color: '+category.color"></i>&nbsp;&nbsp;{{category.name}}</button>
        </div>
        <div class="col-md-6 text-right">
          <span label-for="sort_by" class="mr-2 col-sm-12">Sort by:</span>
          <Dropdown v-model="pageProps.selectedOption" :options="sortByOptions" optionLabel="name" placeholder="Select a City" checkmark :highlightOnSelect="false" class="col-md-3 col-sm-12 btn-outline-dark" />
        </div>
      </div>

      <div class="row">
        <div class="col-md-3" v-for="(process, index) in pageProps.processes" :key="index">
          <div class="card card-default">
            <div class="card-header">
              <h3 class="card-title font-weight-bold">
                {{ process.name }} <br/>
                <small class="font-medium" :style="'color: '+process.category.color">{{ process.category.name }}</small>
              </h3>
              <div class="card-tools">
                <button type="button" class="btn btn-tool">
                  <i class="pi pi-ellipsis-v"></i>
                </button>
              </div>
            </div>
            <div class="card-body">
              <div>{{ process.steps.length }} Steps | {{ (typeof process.steps.activities !== 'undefined') ? process.steps.activities.length : 0 }} Activities</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </AuthenticatedLayout>
</template>

<style scoped>
</style>