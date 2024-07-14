<script setup>

import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import { onMounted, reactive, computed } from "vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import { usePage } from "@inertiajs/vue3";

const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);

const confirm = useConfirm();
const toast = useToast();

const props = defineProps({
  profileTypes: Array,
  profiles: [],
});

const pageProps = reactive({

});

onMounted(() =>{

});

function selectProfileType(id) {

}

function isSelectedProfileType(id) {

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
            <div v-for="(profileType, index) in props.profileTypes" :key="index" class="px-1 mb-2">
              <button :class="['flex gap-2 justify-center py-2.5 px-3 text-xs leading-3 rounded border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white', { 'bg-neutral-700 text-white' : isSelectedProfileType(profileType.id) }]" @click="selectProfileType(profileType.id)">{{profileType.name}}</button>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-2 col-sm-12">Profiles</div>
        <div class="col-md-4 col-sm-12">Profile View</div>
        <div class="col-md-6 col-sm-12">Processes</div>
      </div>
    </div>
  </AuthenticatedLayout>
  <Toast/>
  <ConfirmDialog></ConfirmDialog>
</template>

<style scoped>
</style>