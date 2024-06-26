<script setup>

import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import { computed } from "vue";
import Breadcrumb from 'primevue/breadcrumb';
import { useProcessesStore } from "@/stores";
import { usePage } from "@inertiajs/vue3";

const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);

const processStore = useProcessesStore();

const props = defineProps({
  process: {}
});

const breadCrumbs = [{label: 'processes'}, {label: props.process.category.name}, {label: props.process.name, class: 'active'}];

</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <div class="d-flex w-100">
      <div class="col-sm-6">
        <h1 class="text-neutral-700 text-4xl font-bold font-['Roboto']">{{ props.process.name }}</h1>
        <Breadcrumb :model="breadCrumbs" :class="'p-0 text-sm'">
          <template #separator> <i class="pi pi-arrow-right text-sm"></i></template>
        </Breadcrumb>
      </div><!-- /.col -->
      <div class="col-sm-6 text-right pt-2 pt-sm-3 pt-md-3 pt-lg-3 pt-xl-3">
        <a :href="route('process')" class="px-4 py-2 bg-white rounded border border-neutral-700 justify-center items-center text-black">Back</a>
      </div><!-- /.col -->
      </div>
    </template>

    <div class="content-container pl-4 pr-4">
        <!-- Nav tabs -->
        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Linked Clients</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Profile</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="messages-tab" data-bs-toggle="tab" data-bs-target="#messages" type="button" role="tab" aria-controls="messages" aria-selected="false">Messages</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="settings-tab" data-bs-toggle="tab" data-bs-target="#settings" type="button" role="tab" aria-controls="settings" aria-selected="false">Settings</button>
            </li>
        </ul>

        <!-- Tab panes -->
        <div class="tab-content">
            <div class="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab">1...</div>
            <div class="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab">2...</div>
            <div class="tab-pane" id="messages" role="tabpanel" aria-labelledby="messages-tab">3...</div>
            <div class="tab-pane" id="settings" role="tabpanel" aria-labelledby="settings-tab">4...</div>
        </div>
    </div>
  </AuthenticatedLayout>
</template>