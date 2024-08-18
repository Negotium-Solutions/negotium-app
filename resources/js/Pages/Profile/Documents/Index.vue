<script setup>
import { useProfilesManagerStore } from "@/stores/index.js";
import Button from "primevue/button";
import { computed, onMounted } from "vue";
import { usePage } from "@inertiajs/vue3";
import ExtendProfileLayout from "@/Pages/Profile/ProfileLayout.vue";

const profileManagerStore = useProfilesManagerStore();
const messages = computed(() => usePage().props.messages);

const props = defineProps({
  profileTypeId: 0,
  profileTypes: Array,
  profile: Object,
  apiUrl: String,
  apiImagesUrl: String,
  navigation: String,
  lookup: null
});

onMounted(() => {
  profileManagerStore.setProfileData(props);
});
</script>

<template>
  <ExtendProfileLayout>
  <div v-if="profileManagerStore.isSelected('profile', profileManagerStore.profile)" class="col-lg-12 pl-0 pr-0">
    <div class="d-flex w-100 pt-3 pl-3 pr-3 pb-3">
      <div class="col-sm-6">
        <h1 class="text-neutral-700 text-[1.5rem] font-bold font-['Roboto']">Documents</h1>
      </div>
      <div class="col-sm-6 text-right">
      </div>
    </div>
  </div>
  </ExtendProfileLayout>
</template>