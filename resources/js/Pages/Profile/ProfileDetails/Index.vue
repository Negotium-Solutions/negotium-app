<script setup>
import { useProfilesManagerStore } from "@/stores/index.js";

const profileManagerStore = useProfilesManagerStore();
</script>

<template>
  <div v-if="profileManagerStore.isSelected('profile', profileManagerStore.profile)" class="col-lg-7 col-md-5 col-sm-12 pl-0 pr-0">
    <div class="d-flex w-100 pt-1 pl-2 pr-2 pb-1">
      <div class="col-sm-12">
        <h1 class="text-neutral-700 text-3xl font-bold font-['Roboto']">Profile Details</h1>
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
          <label class="mb-1" for="mobile_number">Mobile1 Number</label>
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
  </div>
</template>

<style scoped>

</style>