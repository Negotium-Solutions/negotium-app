<script setup>
import { useProfilesManagerStore } from "@/stores/index.js";
import Button from "primevue/button";

const profileManagerStore = useProfilesManagerStore();
</script>

<template>
  <div v-if="profileManagerStore.isSelected('profile', profileManagerStore.profile)" class="col-lg-7 col-md-5 col-sm-12 pl-0 pr-0">
    <div class="d-flex w-100 pt-4 pl-2 pr-2 pb-3">
      <div class="col-sm-6">
        <h1 class="text-neutral-700 text-[1.5rem] font-bold font-['Roboto']">Profile Details</h1>
      </div>
      <div class="col-sm-6 text-right">
        <a class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Edit Details</a>
      </div>
    </div>
    <div class="d-flex flex-column w-100 pl-2 pr-2">
      <div class="flex flex-col px-2 py-2 rounded-lg border border-solid border-neutral-700 mb-2">
        <div class="d-flex w-100 pt-2 pl-2 pr-2 pb-1">
          <h6 class="text-neutral-700 text-md mb-1 font-bold font-['Roboto']">Personal Information</h6>
        </div>
        <div class="d-flex w-100 pl-2">

          <div class="flex-1 pr-7 border-top-0 border-bottom-0 border-left-0 border-right-2 border border-solid border-neutral-700 border-opacity-20">
            <div class="d-flex flex-row flex-1 align-items-center gap-28 mb-1">
              <span class="mb-1 d-flex flex-1 font-normal">First Name</span>
              <span class="float-right text-right">{{ profileManagerStore.profile.first_name }}</span>
            </div>
            <div class="d-flex flex-row flex-1 align-items-center gap-28">
              <span class="mb-1 d-flex flex-1">Last Name</span>
              <span class="float-right text-right">{{ profileManagerStore.profile.last_name }}</span>
            </div>
          </div>
          <div class="flex-1 pl-7 border-right-2">
            <div class="d-flex flex-row flex-1 align-items-center gap-28 mb-1">
              <span class="mb-1 d-flex flex-1">Maiden Name</span>
              <span class="float-right text-right">{{ profileManagerStore.profile.maiden_name }}</span>
            </div>
            <div class="d-flex flex-row flex-1 align-items-center gap-28">
              <span class="mb-1 d-flex flex-1">ID Number</span>
              <span class="float-right text-right">{{ profileManagerStore.profile.id }}</span>
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
            <div class="d-flex flex-row flex-1 align-items-center gap-28">
              <span class="mb-1 d-flex flex-1">Email Address</span>
              <span class="float-right text-right">{{ profileManagerStore.profile.email }}</span>
            </div>
            <div class="d-flex flex-row flex-1 align-items-center gap-28">
              <span class="mb-1 d-flex flex-1">Mobile Number</span>
              <span class="float-right text-right">{{ profileManagerStore.profile.cell }}</span>
            </div>
          </div>
          <div class="flex-1 pl-10 border-right-2">
            <div class="d-flex flex-row flex-1 align-items-center gap-28">
              <span class="mb-1 d-flex flex-1">Work Number</span>
              <span class="float-right text-right">{{ profileManagerStore.profile.work }}</span>
            </div>
            <div class="d-flex align-items-center gap-28">
              <span class="mb-1 d-flex flex-1">Home Number</span>
              <span class="float-right text-right">{{ profileManagerStore.profile.home }}</span>
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
            <div class="d-flex align-items-center gap-28">
                <span class="mb-1 d-flex flex-1">Residence type</span>
                <span class="float-right text-right"></span>
            </div>
            <div class="d-flex align-items-center gap-28">
              <span class="mb-1 d-flex flex-1">Building Name</span>
                <span class="float-right text-right"></span>
            </div>
            <div class="d-flex align-items-center gap-28">
              <span class="mb-1 d-flex flex-1">Unit Number</span>
                <span class="float-right text-right"></span>
            </div>
            <div class="d-flex align-items-center gap-28">
              <span class="mb-1 d-flex flex-1">Street Name</span>
                <span class="float-right text-right"></span>
            </div>
          </div>
          <div class="flex-1 pl-10 border-right-2">
            <div class="d-flex align-items-center gap-28">
              <span class="mb-1 d-flex flex-1">Suburb</span>
                <span class="float-right text-right"></span>
            </div>
            <div class="d-flex align-items-center gap-28">
              <span class="mb-1 d-flex flex-1">City</span>
                <span class="float-right text-right"></span>
            </div>
            <div class="d-flex align-items-center gap-28">
              <span class="mb-1 d-flex flex-1">Country</span>
                <span class="float-right text-right"></span>
            </div>
            <div class="d-flex align-items-center gap-28">
              <span class="mb-1 d-flex flex-1">Postal Code</span>
                <span class="float-right text-right"></span>
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
            <div class="d-flex align-items-center gap-28">
              <span class="mb-1 d-flex flex-1">Building Name</span>
              <span class="float-right text-right"></span>
            </div>
            <div class="d-flex align-items-center gap-28">
              <span class="mb-1 d-flex flex-1">Street Address</span>
              <span class="float-right text-right"></span>
            </div>
            <div class="d-flex align-items-center gap-28">
              <span class="mb-1 d-flex flex-1">Suburb</span>
              <span class="float-right text-right"></span>
            </div>
          </div>
          <div class="flex-1 pl-10 border-right-2">
            <div class="d-flex align-items-center gap-28">
              <span class="mb-1 d-flex flex-1">City</span>
              <span class="float-right text-right"></span>
            </div>
            <div class="d-flex align-items-center gap-28">
              <span class="mb-1 d-flex flex-1">Country</span>
              <span class="float-right text-right"></span>
            </div>
            <div class="d-flex align-items-center gap-28">
              <span class="mb-1 d-flex flex-1">Postal Code</span>
              <span class="float-right text-right"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>