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
        <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Manage inputs or add your own</div>
      </div>
      <div class="card-body">
        <div class="mt-3">
          <hr class="opacity-10 bg-neutral-700"/>
        </div>
        <div class="mt-3">
          <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3 mb-3">Profile sections</div>
        </div>

        <div class="mt-3" v-if="profileCreatorManager.isSet('profileCategory', profileCreatorManager.profileCategory) && profileCreatorManager.profileCategory.templates.length > 0">
          <div class="p-3 mt-3 text-md font-normal font-['Nunito']" v-for="(template, index) in profileCreatorManager.getSections" :key="index">
            <span class="font-bold">{{ template.name }}</span>
            <button @click="profileCreatorManager.addSection(template)" class="justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white float-right">
              <i class="pi pi-plus text-sm custom-icon-sm"></i> Add Input
            </button>
          </div>
        </div>
      </div>
    </div>
  </ExtendProfileCreatorLayout>
</template>