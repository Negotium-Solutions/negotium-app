<script setup>
import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import Toast from "primevue/toast";
</script>

<template>
  <AuthenticatedLayout>
    <template #header2>
      <div class="d-flex w-100">
        <div class="col-sm-6">
          <h1 class="text-neutral-700 text-4xl font-bold font-['Roboto']">
            Profiles
          </h1>
        </div><!-- /.col -->
        <div class="col-sm-6 text-right pt-2 pt-sm-3 pt-md-3 pt-lg-3 pt-xl-3 p-2">
          <a class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white cursor-pointer">Create Profile</a>
        </div><!-- /.col -->
      </div>
    </template>
    <template #profile>
      <div class="content-container">
        <div class="row" id="profiles">

        </div>
      </div>
    </template>
  </AuthenticatedLayout>
  <Toast position="top-center">
    <template #message="slotProps">
      <div class="flex flex-column align-items-start" style="flex: 1">
        <div class="font-medium text-sm my-1 text-900">{{ slotProps.message.detail }}</div>
      </div>
    </template>
  </Toast>
</template>