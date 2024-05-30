<script setup>

import { AuthenticatedLayout } from "@/Layouts/Adminlte/index.js";
import Breadcrumb from 'primevue/breadcrumb';

const props = defineProps({
  'processes': Object,
  'categories': Object
});

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
        <a :href="route('document.create')" class="btn btn-sm btn-cs-dark">Create Process</a>
      </div><!-- /.col -->
    </template>

    <div class="row content-container pl-4 pr-4">

      <div class="row mb-3" style="width: 100%;">
        <span class="mr-2">
          <button class="btn-sm btn-outline-secondary">All</button>
        </span>
        <span v-for="(category, index) in props.categories" :key="index" class="mr-2">
          <button class="btn-sm btn-outline-secondary"><i class="fa fa-square" :style="'color: '+category.color"></i>&nbsp;&nbsp;{{category.name}}</button>
        </span>
      </div>

      <div class="row">
        <div class="col-md-3" v-for="(process, index) in props.processes" :key="index">

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