<script setup>
import { useProfilesManagerStore } from "@/stores/index.js";
import Button from "primevue/button";
import { computed } from "vue";
import {usePage} from "@inertiajs/vue3";

const profileManagerStore = useProfilesManagerStore();
const messages = computed(() => usePage().props.messages);
const no_communications_for_profile = messages.value.processes.no_communications_for_profile;
</script>

<template>
  <div v-if="profileManagerStore.isSelected('profile', profileManagerStore.profile)" class="col-lg-7 col-md-5 col-sm-12 pl-0 pr-0">
    <div class="d-flex w-100 pt-4 pl-2 pr-2 pb-3">
      <div class="col-sm-6">
        <h1 class="text-neutral-700 text-3xl font-bold font-['Roboto']">Communications</h1>
      </div>
      <div class="col-sm-6 text-right">
        <button class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Send email</button>
        <button class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Send message</button>
      </div>
    </div>
    <div class="col-md-12 pl-2 pr-2">
      <!-- <table v-if="profileManagerStore.communications.length > 0" class="table-sm w-100 table-row-spacing table-bg">      </table>-->
      <table class="w-100">
        <tr>
          <td>
            <div class="text-center" v-html="no_communications_for_profile"></div>
            <div class="text-center mt-4">
              <button class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">View Guide</button>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>

</style>