<script setup>
import { useProfilesManagerStore } from "@/stores/index.js";
import ExtendProfileLayout from "@/Pages/Profile/ProfileLayout.vue";
import { onMounted } from "vue";

const profileManagerStore = useProfilesManagerStore();

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
    <div class="d-flex w-100 pt-3 pl-3 pr-3 pb-4">
      <div class="col-sm-6">
        <h1 class="text-neutral-700 text-[1.5rem] font-bold font-['Roboto']">Profile Details</h1>
      </div>
      <div class="col-sm-6 text-right">
        <a :href="route('profile.details.edit', {'id': profileManagerStore.profile.id})+'?pt='+profileManagerStore.profileType.id" class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Edit Details</a>
      </div>
    </div>
    <div class="d-flex flex-column w-100 pl-3 pr-3">
      <div class="flex flex-col px-2 py-2 rounded-lg border border-solid border-neutral-700 mb-2">
        <div class="d-flex w-100 pt-2 pl-2 pr-2 pb-1">
          <h6 class="text-neutral-700 text-md mb-2 font-bold font-['Roboto']">Personal Information</h6>
        </div>
        <div class="d-flex w-100 pl-2">
          <div class="flex-1 pr-7 border-top-0 border-bottom-0 border-left-0 border-right-2 border border-solid border-neutral-700 border-opacity-20">
            <div class="d-flex flex-row flex-1 align-items-center gap-28 mb-1">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">First Name</span>
              <span class="float-right text-right text-sm">{{ profileManagerStore.profile.first_name }}</span>
            </div>
            <div class="d-flex flex-row flex-1 align-items-center gap-28">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">Last Name</span>
              <span class="float-right text-right text-sm">{{ profileManagerStore.profile.last_name }}</span>
            </div>
          </div>
          <div class="flex-1 pl-7 border-right-2">
            <div class="d-flex flex-row flex-1 align-items-center gap-28 mb-1">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">Maiden Name</span>
              <span class="float-right text-right text-sm">{{ profileManagerStore.profile.maiden_name }}</span>
            </div>
            <div class="d-flex flex-row flex-1 align-items-center gap-28">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">ID Number</span>
              <span class="float-right text-right text-sm">{{ profileManagerStore.profile.id }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col px-2 py-2 rounded-lg border border-solid border-neutral-700 mb-2">
        <div class="d-flex w-100 pt-2 pl-2 pr-2 pb-1">
          <h6 class="text-neutral-700 text-md mb-2 font-bold font-['Roboto']">Contact Details</h6>
        </div>
        <div class="d-flex w-100 pl-2">
          <div class="flex-1 pr-7 border-top-0 border-bottom-0 border-left-0 border-right-2 border border-solid border-neutral-700 border-opacity-20">
            <div class="d-flex flex-row flex-1 align-items-center gap-28 mb-1">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">Email Address</span>
              <span class="float-right text-right text-sm">{{ profileManagerStore.profile.email }}</span>
            </div>
            <div class="d-flex flex-row flex-1 align-items-center gap-28">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">Mobile Number</span>
              <span class="float-right text-right text-sm">{{ profileManagerStore.profile.cell }}</span>
            </div>
          </div>
          <div class="flex-1 pl-10 border-right-2">
            <div class="d-flex flex-row flex-1 align-items-center gap-28 mb-1">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">Work Number</span>
              <span class="float-right text-right text-sm">{{ profileManagerStore.profile.work }}</span>
            </div>
            <div class="d-flex align-items-center gap-28">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">Home Number</span>
              <span class="float-right text-right text-sm">{{ profileManagerStore.profile.home }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col px-2 py-2 rounded-lg border border-solid border-neutral-700 mb-2">
        <div class="d-flex w-100 pt-2 pl-2 pr-2 pb-1">
          <h6 class="text-neutral-700 text-md mb-2 font-bold font-['Roboto']">Home Address</h6>
        </div>
        <div class="d-flex w-100 pl-2">
          <div class="flex-1 pr-7 border-top-0 border-bottom-0 border-left-0 border-right-2 border border-solid border-neutral-700 border-opacity-20">
            <div class="d-flex align-items-center gap-28 mb-1">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">Residence type</span>
                <span class="float-right text-right text-sm"></span>
            </div>
            <div class="d-flex align-items-center gap-28 mb-1">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">Building Name</span>
                <span class="float-right text-right text-sm"></span>
            </div>
            <div class="d-flex align-items-center gap-28 mb-1">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">Unit Number</span>
                <span class="float-right text-right text-sm"></span>
            </div>
            <div class="d-flex align-items-center gap-28">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">Street Name</span>
                <span class="float-right text-right text-sm"></span>
            </div>
          </div>
          <div class="flex-1 pl-10 border-right-2">
            <div class="d-flex align-items-center gap-28 mb-1">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">Suburb</span>
                <span class="float-right text-right text-sm"></span>
            </div>
            <div class="d-flex align-items-center gap-28 mb-1">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">City</span>
                <span class="float-right text-right text-sm"></span>
            </div>
            <div class="d-flex align-items-center gap-28 mb-1">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">Country</span>
                <span class="float-right text-right text-sm"></span>
            </div>
            <div class="d-flex align-items-center gap-28">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">Postal Code</span>
                <span class="float-right text-right text-sm"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col px-2 py-2 rounded-lg border border-solid border-neutral-700 mb-2">
        <div class="d-flex w-100 pt-2 pl-2 pr-2 pb-1">
          <h6 class="text-neutral-700 text-md mb-1 font-bold font-['Roboto']">Work Address</h6>
        </div>
        <div class="d-flex w-100 pl-2">
          <div class="flex-1 pr-7 border-top-0 border-bottom-0 border-left-0 border-right-2 border border-solid border-neutral-700 border-opacity-20">
            <div class="d-flex align-items-center gap-28 mb-1">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">Building Name</span>
              <span class="float-right text-right text-sm"></span>
            </div>
            <div class="d-flex align-items-center gap-28 mb-1">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">Street Address</span>
              <span class="float-right text-right text-sm"></span>
            </div>
            <div class="d-flex align-items-center gap-28">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">Suburb</span>
              <span class="float-right text-right text-sm"></span>
            </div>
          </div>
          <div class="flex-1 pl-10 border-right-2">
            <div class="d-flex align-items-center gap-28 mb-1">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">City</span>
              <span class="float-right text-right text-sm"></span>
            </div>
            <div class="d-flex align-items-center gap-28 mb-1">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">Country</span>
              <span class="float-right text-right"></span>
            </div>
            <div class="d-flex align-items-center gap-28">
              <span class="mb-1 d-flex flex-1 text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">Postal Code</span>
              <span class="float-right text-right text-sm"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </ExtendProfileLayout>
</template>