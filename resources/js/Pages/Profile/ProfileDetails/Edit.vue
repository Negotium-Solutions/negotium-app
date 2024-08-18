<script setup>
import { useProfilesManagerStore } from "@/stores/index.js";
import Button from "primevue/button";
import {onMounted} from "vue";
import ExtendProfileLayout from "@/Pages/Profile/ProfileLayout.vue";

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
    <div class="d-flex w-100 pt-3 pl-2 pr-2 pb-3">
      <div class="col-sm-6">
        <h1 class="text-neutral-700 text-[1.5rem] font-bold font-['Roboto']">Profile Details</h1>
      </div>
      <div class="col-sm-6 text-right">
        <a class="gap-2 justify-center py-2 px-4 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white mr-2">Cancel</a>
        <a class="gap-2 justify-center py-2 px-4 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Save</a>
      </div>
    </div>
    <div class="d-flex flex-column w-100 pl-2 pr-2">
      <div class="flex flex-col px-2 py-2 rounded-lg border border-solid border-neutral-700 mb-2">
        <div class="d-flex w-100 pt-2 pl-2 pr-2 pb-1">
          <h6 class="text-neutral-700 text-md mb-1 font-bold font-['Roboto']">Personal Information</h6>
        </div>
        <div class="d-flex w-100 pl-2">

          <div class="flex-1 pr-7 border-top-0 border-bottom-0 border-left-0 border-right-2 border border-solid border-neutral-700 border-opacity-20">
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">First Name</span>
              <input class="form-control" v-model="profileManagerStore.profile.first_name">
            </div>
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">Last Name</span>
              <input class="form-control" v-model="profileManagerStore.profile.last_name">
            </div>
          </div>
          <div class="flex-1 pl-7 border-right-2">
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">Maiden Name</span>
              <input class="form-control" v-model="profileManagerStore.profile.maiden_name">
            </div>
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">ID Number</span>
              <input class="form-control" v-model="profileManagerStore.profile.id">
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col px-2 py-2 rounded-lg border border-solid border-neutral-700 mb-2">
        <div class="d-flex w-100 pt-2 pl-2 pr-2 pb-1">
          <h6 class="text-neutral-700 text-md mb-1 font-bold font-['Roboto']">Contact Details</h6>
        </div>
        <div class="d-flex w-100 pl-2">
          <div class="flex-1 pr-7 border-top-0 border-bottom-0 border-left-0 border-right-2 border border-solid border-neutral-700 border-opacity-20">
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">Email Address</span>
              <input class="form-control" v-model="profileManagerStore.profile.email">
            </div>
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">Mobile Number</span>
              <input class="form-control" v-model="profileManagerStore.profile.cell">
            </div>
          </div>
          <div class="flex-1 pl-10 border-right-2">
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">Work Number</span>
              <input class="form-control" v-model="profileManagerStore.profile.work">
            </div>
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">Home Number</span>
              <input class="form-control" v-model="profileManagerStore.profile.home">
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col px-2 py-2 rounded-lg border border-solid border-neutral-700 mb-2">
        <div class="d-flex w-100 pt-2 pl-2 pr-2 pb-1">
          <h6 class="text-neutral-700 text-md mb-1 font-bold font-['Roboto']">Home Address</h6>
        </div>
        <div class="d-flex w-100 pl-2">
          <div class="flex-1 pr-7 border-top-0 border-bottom-0 border-left-0 border-right-2 border border-solid border-neutral-700 border-opacity-20">
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">Residence type</span>
                <input class="form-control">
            </div>
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">Building Name</span>
              <input class="form-control">
            </div>
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">Unit Number</span>
              <input class="form-control">
            </div>
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">Street Name</span>
              <input class="form-control">
            </div>
          </div>
          <div class="flex-1 pl-10 border-right-2">
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">Suburb</span>
              <input class="form-control">
            </div>
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">City</span>
              <input class="form-control">
            </div>
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">Country</span>
              <input class="form-control">
            </div>
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">Postal Code</span>
              <input class="form-control">
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
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">Building Name</span>
              <input class="form-control">
            </div>
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">Street Address</span>
              <input class="form-control">
            </div>
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">Suburb</span>
              <input class="form-control">
            </div>
          </div>
          <div class="flex-1 pl-10 border-right-2">
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">City</span>
              <input class="form-control">
            </div>
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">Country</span>
              <input class="form-control">
            </div>
            <div class="gap-28 mb-1">
              <span class="mb-1 font-normal text-sm">Postal Code</span>
              <input class="form-control">
            </div>
          </div>
        </div>
      </div>
      <hr/>
    </div>
  </div>
  </ExtendProfileLayout>
</template>