<script setup>
import { useProfilesManagerStore, useProfileDetailStore } from "@/stores";
import ExtendProfileLayout from "@/Pages/Profile/ProfileLayout.vue";
import { onMounted } from "vue";

const profileManagerStore = useProfilesManagerStore();
const profileDetailStore = useProfileDetailStore();

const props = defineProps({
  profileTypeId: 0,
  profileTypes: Array,
  profile: Object,
  form: null,
  apiUrl: String,
  apiImagesUrl: String,
  navigation: String,
  lookup: null,
  profiles: null,
  schema_id: null,
  profileId: null
});

onMounted(() => {
  profileManagerStore.setProfileData(props);
  profileDetailStore.set('profile', props.profile);
  profileDetailStore.set('profileDetailsFields', props.form.groups);
});
</script>

<template>
  <ExtendProfileLayout>
  <div v-if="profileManagerStore.isSelected('profile', profileManagerStore.profile)" class="col-lg-12 pl-0 pr-0">
    <div class="d-flex w-100 pt-3 pl-3 pr-3 pb-4">
      <div class="col-sm-6 p-0">
        <h1 class="text-neutral-700 text-[1.5rem] font-bold font-['Roboto']">Profile Details</h1>
      </div>
      <div class="col-sm-6 text-right">
        <a :href="route('profile.profile-details.edit', {'id': profileManagerStore.profile.id})+'?s_id='+props.schema_id" class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Edit Details</a>
      </div>
    </div>
    <div class="d-flex flex-column w-100 pl-3 pr-3">

      <div v-for="(profileDetail, index) in profileDetailStore.profileDetailsFields" :key="index" class="flex flex-col w-100 px-2 py-2 rounded-lg border border-solid border-neutral-700 mb-2">

        <div class="d-flex w-100 pt-2 pl-2 pr-2 pb-1">
          <h6 class="text-neutral-700 text-md mb-2 font-bold font-['Roboto']">{{ profileDetail.name }}</h6>
        </div>

        <div class="row">
          <div v-for="(field, _index) in profileDetail.fields" :key="_index" class="col-md-6 pl-3" :class="{ 'border-top-0 border-bottom-0 border-left-0 border-right-2 border border-solid border-neutral-700 border-opacity-20': _index % 2 === 0 }">
            <div class="d-flex flex-row flex-1 align-items-center gap-28 mb-1">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">{{ field.label }}</span>
              <span class="float-right text-right text-sm pr-2">{{ field.value }}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
  </ExtendProfileLayout>
</template>