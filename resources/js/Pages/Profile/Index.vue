<script setup>

import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import { onMounted, reactive, computed } from "vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import Avatar from 'primevue/avatar';
import { usePage } from "@inertiajs/vue3";
import { useProfilesManagerStore } from "@/stores";

const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);

const confirm = useConfirm();
const toast = useToast();
const profileManagerStore = useProfilesManagerStore();

const props = defineProps({
  profileTypes: Array
});

const pageProps = reactive({

});

onMounted(() =>{
  profileManagerStore.set('profile_types', props.profileTypes);
  profileManagerStore.set('profile_type', props.profileTypes[0]);
});

function selectProfileType(profile) {
  console.log('Profile: ', profile);
}

function isSelectedProfileType(profile) {
  // return profile.id ===
}

</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <div class="d-flex w-100">
      <div class="col-sm-6">
        <h1 class="text-neutral-700 text-4xl font-bold font-['Roboto']">Profiles</h1>
      </div><!-- /.col -->
      <div class="col-sm-6 text-right pt-2 pt-sm-3 pt-md-3 pt-lg-3 pt-xl-3">
        <a :href="route('process.create')" class="px-4 py-2 bg-neutral-700 rounded border border-neutral-700 justify-center items-center text-white">Add Profile</a>
      </div><!-- /.col -->
      </div>
    </template>

    <div class="content-container pl-4 pr-4">
      <div class="row mb-3">
        <div class="col-md-12">
          <div class="row">
            <div v-for="(profile_type, index) in props.profileTypes" :key="index" class="px-1 mb-2">
              <button :class="['flex gap-2 justify-center py-2.5 px-3 text-xs leading-3 rounded border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white', { 'bg-neutral-700 text-white' : profileManagerStore.isSelected('profile_type', profile_type) }]" @click="profileManagerStore.set('profile_type', profile_type)">{{profile_type.name}}</button>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-2 col-sm-12">
          <div v-for="(profile, index) in profileManagerStore.profiles" :key="index" @click="profileManagerStore.set('profile', profile)">
            <Avatar class="p-overlay-badge" image="https://primefaces.org/cdn/primevue/images/organization/walter.jpg" size="small" />
            <span v-if="profileManagerStore.profile_type.name == 'Individual'"> {{ profile.first_name }} {{ profile.last_name }}</span>
            <span v-if="profileManagerStore.profile_type.name == 'Business'"> {{ profile.company_name }}</span>
          </div>
        </div>
        <div class="col-md-4 col-sm-12">
          <div v-if="profileManagerStore.isSelected('profile', profileManagerStore.profile)">
            <Avatar class="p-overlay-badge" image="https://primefaces.org/cdn/primevue/images/organization/walter.jpg" size="small" />
            <span v-if="profileManagerStore.profile_type.name == 'Individual'"> {{ profileManagerStore.profile.first_name }} {{ profileManagerStore.profile.last_name }}</span>
            <span v-if="profileManagerStore.profile_type.name == 'Business'"> {{ profileManagerStore.profile.company_name }}</span>
          </div>
        </div>
        <div class="col-md-6 col-sm-12">Processes</div>
      </div>
    </div>
  </AuthenticatedLayout>
  <Toast/>
  <ConfirmDialog></ConfirmDialog>
</template>

<style scoped>
</style>