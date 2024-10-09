<script setup>
import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import { onMounted, computed } from "vue";
import Breadcrumb from 'primevue/breadcrumb';
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useProfileCreatorManager } from "@/stores";
import { usePage } from "@inertiajs/vue3";
import Button from "primevue/button";
import ExtendProfileCreatorLayout from "@/Pages/Admin/ProfileCreation/ProfileCreatorLayout.vue";

const toast = useToast();
const page = usePage();
const user = computed(() => page.props.auth.user);
const messages = computed(() => page.props.messages);
const profile_creator_messages = messages.value;

const negotium_api_url = computed(() => page.props.negotium_api_url);
const breadCrumbs = [{label: 'Home'}, {label: 'Profiles'}, {label: 'Create Profile', class: 'active'}];

const profileCreatorManager = useProfileCreatorManager();

const props = defineProps({
  profile: null,
  categoryTypes: null,
  profileCategory: null,
  quick_capture: null,
  profile_category_id: null
});

onMounted(() => {
  profileCreatorManager.set('profile', props.profile);
  profileCreatorManager.set('categoryTypes', props.categoryTypes);
  profileCreatorManager.set('profileCategory', props.profileCategory);
  profileCreatorManager.set('quick_capture', props.quick_capture);
  profileCreatorManager.set('profile_category_id', props.profile_category_id);
});
</script>

<template>
  <ExtendProfileCreatorLayout>
    <div class="card card-default h-100">
      <div class="card-header border-bottom-0 pb-0">
        <div class="text-neutral-700 text-[1.25rem] font-bold font-['Roboto'] leading-loose">Profile inputs</div>
        <div class="opacity-50 text-neutral-700 text-[0.90rem] font-normal font-['Nunito'] leading-3">Manage inputs or add your own</div>
      </div>
      <div class="card-body">

        <div class="mt-0" v-if="profileCreatorManager.isSet('profileCategory', profileCreatorManager.profileCategory) && profileCreatorManager.profileCategory.templates.length > 0">
          <div class="row m-0"  v-for="(template, index) in profileCreatorManager.profile.steps" :key="index">
            <div class="mt-0 w-full">
              <hr class="opacity-10 bg-neutral-700"/>
            </div>
            <div class="pt-2 text-md font-normal font-['Nunito'] w-full">
              <span class="font-bold">{{ template.name }}</span>
              <button @click="profileCreatorManager.addSection(template)" class="justify-center py-1.5 px-2.5 text-xs leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white float-right">
                <i class="pi pi-plus custom-icon-sm"></i> Add Input
              </button>
            </div>
            <div class="mt-2 w-full">
              <div class="row align-items-center mb-1 py-1.5 border-neutral-700 text-xs">
                <div class="col-md-6">
                  Inputs
                </div>
                <div class="col-md-3 d-flex justify-content-start align-items-center">
                  Actions
                </div>
                <div class="col-md-3 d-flex align-items-center">
                  Quick Capture
                </div>
              </div>
              <div v-for="(field, index) in template.fields" :key="index" class="row align-items-center mb-2 py-1.5 border border-neutral-700 rounded text-[0.9rem]">
                <div class="col-md-6">
                  {{ field.label }}
                </div>
                <div class="col-md-3 d-flex justify-content-start align-items-center">
                </div>
                <div class="col-md-3 d-flex align-items-center">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ExtendProfileCreatorLayout>
</template>