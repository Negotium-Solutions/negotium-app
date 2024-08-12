<script setup>
import { useProfilesManagerStore } from "@/stores/index.js";
import Button from "primevue/button";

const profileManagerStore = useProfilesManagerStore();
</script>

<template>
  <div v-if="profileManagerStore.isSelected('profile', profileManagerStore.profile)" class="col-lg-7 col-md-5 col-sm-12 pl-0 pr-0">
    <div class="d-flex w-100 pt-4 pl-2 pr-2 pb-3">
      <div class="col-sm-6">
        <h1 class="text-neutral-700 text-3xl font-bold font-['Roboto']">Profile Details</h1>
      </div>
      <div class="col-sm-6 text-right">
        <button class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Add Details</button>
      </div>
    </div>
    <div class="d-flex w-100 pt-2 pl-2 pr-2 pb-1">
      <h6 class="text-neutral-700 text-md mb-3 font-bold font-['Roboto']">Personal Information</h6>
    </div>
    <div class="d-flex w-100 pl-2">

      <div class="flex-1 pr-10 border-left-2 border-primary">
        <div class="d-flex align-items-center gap-28">
          <label class="mb-1" for="first_name">First Name</label>
          <input class="w-100 p-1 text-right" type="text" id="first_name" v-model="profileManagerStore.profile.first_name">
        </div>
        <div class="d-flex align-items-center gap-28">
          <label class="mb-1" for="first_name">Last Name</label>
          <input class="w-100 p-1 text-right" type="text" id="first_name" v-model="profileManagerStore.profile.last_name">
        </div>
      </div>
      <div class="bg-gray w-1"></div>
      <div class="flex-1 pl-10 border-right-2">
        <div class="d-flex align-items-center gap-28">
          <label class="d-block mb-1" for="middle_name">Maiden Name</label>
          <input class="w-100 p-1 mr-3 text-right" type="text" id="middle_name" >
        </div>
        <div class="d-flex align-items-center gap-28">
          <label class="d-block mb-1" for="id_number">ID Number</label>
          <input class="w-100 p-1 mr-3 text-right" type="text" id="id_number" v-model="profileManagerStore.profile.id">
        </div>
      </div>
    </div>
    <hr>
    <div class="d-flex w-100 pt-2 pl-2 pr-2 pb-1">
      <h6 class="text-neutral-700 text-md mb-3 font-bold font-['Roboto']">Contact Details</h6>
    </div>
    <div class="d-flex w-100 pl-2">

      <div class="flex-1 pr-10 border-left-2 border-primary">
        <div class="d-flex align-items-center gap-28">
          <label class="mb-1" for="email">Email Address</label>
          <input class="w-100 p-1 text-right" type="text" id="email" v-model="profileManagerStore.profile.email">
        </div>
        <div class="d-flex align-items-center gap-28">
          <label class="mb-1" for="mobile_number">Mobile Number</label>
          <input class="w-100 p-1 text-right" type="text" id="mobile_number" >
        </div>
      </div>
      <div class="bg-gray w-1"></div>
      <div class="flex-1 pl-10 border-right-2">
        <div class="d-flex align-items-center gap-28">
          <label class="d-block mb-1" for="work_number">Work Number</label>
          <input class="w-100 p-1 mr-3 text-right" type="text" id="work_number" >
        </div>
        <div class="d-flex align-items-center gap-28">
          <label class="d-block mb-1" for="home_number">Home Number</label>
          <input class="w-100 p-1 mr-3 text-right" type="text" id="home_number">
        </div>
      </div>
    </div>
    <hr/>
    <div class="d-flex w-100 pt-2 pl-2 pr-2 pb-1">
      <h6 class="text-neutral-700 text-md mb-3 font-bold font-['Roboto']">Home Address</h6>
    </div>
    <div class="d-flex w-100 pl-2">
      <div class="flex-1 pr-10 border-left-2 border-primary">
        <div class="d-flex align-items-center gap-28">
          <label class="mb-1" for="residence_type">Residence type</label>
          <input class="w-100 p-1 text-right" type="text" id="residence_type">
        </div>
        <div class="d-flex align-items-center gap-28">
          <label class="mb-1" for="building_name">Building Name</label>
          <input class="w-100 p-1 text-right" type="text" id="building_name" >
        </div>
        <div class="d-flex align-items-center gap-28">
          <label class="mb-1" for="unit_number">Unit Number</label>
          <input class="w-100 p-1 text-right" type="text" id="unit_number">
        </div>
        <div class="d-flex align-items-center gap-28">
          <label class="mb-1" for="street_address">Street Name</label>
          <input class="w-100 p-1 text-right" type="text" id="street_address" >
        </div>
      </div>
      <div class="bg-gray w-1"></div>
      <div class="flex-1 pl-10 border-right-2">
        <div class="d-flex align-items-center gap-20">
          <label class="mb-1" for="suburb">Suburb</label>
          <input class="w-100 p-1 mr-3 text-right" type="text" id="suburb" >
        </div>
        <div class="d-flex align-items-center gap-28">
          <label class="mb-1" for="city">City</label>
          <input class="w-100 p-1 mr-3 text-right" type="text" id="city">
        </div>
        <div class="d-flex align-items-center gap-28">
          <label class="mb-1" for="country">Country</label>
          <input class="w-100 p-1 text-right" type="text" id="country">
        </div>
        <div class="d-flex align-items-center gap-28">
          <label class="mb-1" for="postal_code">Postal Code</label>
          <input class="w-100 p-1 text-right" type="text" id="postal_code" >
        </div>
      </div>
    </div>
    <hr/>
    <div class="d-flex w-100 pt-2 pl-2 pr-2 pb-1">
      <h6 class="text-neutral-700 text-md mb-3 font-bold font-['Roboto']">Work Address</h6>
    </div>
    <div class="d-flex w-100 pl-2">

      <div class="flex-1 pr-10 border-left-2 border-primary">
        <div class="d-flex align-items-center gap-28">
          <label class="mb-1" for="building_name">Building Name</label>
          <input class="w-100 p-1 text-right" type="text" id="building_name" >
        </div>
        <div class="d-flex align-items-center gap-28">
          <label class="mb-1" for="work_street_address">Street Address</label>
          <input class="w-100 p-1 text-right" type="text" id="work_street_address">
        </div>
        <div class="d-flex align-items-center gap-28">
          <label class="mb-1" for="work_suburb">Suburb</label>
          <input class="w-100 p-1 text-right" type="text" id="work_suburb" >
        </div>
      </div>
      <div class="bg-gray w-1"></div>
      <div class="flex-1 pl-10 border-right-2">
        <div class="d-flex align-items-center gap-28">
          <label class="d-block mb-1" for="work_city">City</label>
          <input class="w-100 p-1 mr-3 text-right" type="text" id="work_city">
        </div>
        <div class="d-flex align-items-center gap-28">
          <label class="mb-1" for="work_country">Country</label>
          <input class="w-100 p-1 text-right" type="text" id="work_country">
        </div>
        <div class="d-flex align-items-center gap-28">
          <label class="mb-1" for="work_postal_code">Postal Code</label>
          <input class="w-100 p-1 text-right" type="text" id="work_postal_code" >
        </div>
      </div>
      <hr/>
    </div>
  </div>
</template>

<style scoped>

</style>