<script setup>
import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import Toast from "primevue/toast";
import Button from "primevue/button";

import { onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { FunctionsHelper } from "@/helpers";
import { useProfileCreatorManager } from "@/stores/index.js";
import ConfirmDialog from "primevue/confirmdialog";

const profileCreatorManagerStore = useProfileCreatorManager();
const toast = useToast();
const confirm = useConfirm();

const props = defineProps({
  profiles: null
});

onMounted(() => {
  profileCreatorManagerStore.set('profiles', props.profiles);
});
</script>

<template>
  <AuthenticatedLayout>
    <template #header2>
      <div class="d-flex w-100">
        <div class="col-sm-6">
          <h1 class="text-neutral-700 text-4xl font-bold font-['Roboto']">
            Profiles
          </h1>
        </div><!-- /.col -->
        <div class="col-sm-6 text-right pt-2 pt-sm-3 pt-md-3 pt-lg-3 pt-xl-3 p-2">
          <a :href="route('profile-creation.create')" class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 bg-neutral-700 text-white cursor-pointer">Create Profile</a>
        </div><!-- /.col -->
      </div>
    </template>
    <template #profile>
      <div class="content-container">
        <div class="row m-4">
          <div class="col-lg-12 col-md-12 col-sm-12">
            <table v-if="profileCreatorManagerStore.profiles && profileCreatorManagerStore.profiles.length > 0" class="table-sm w-100 table-row-spacing table-bg">
              <tr>
                <th>Profile Name</th><th>Quick capture</th><th>Sections</th><th>Fields</th><th>Last edited</th><th>Date added</th><th>Actions</th>
              </tr>
              <tr v-for="(profile, index) in profileCreatorManagerStore.profiles" :key="index" :class="{ 'bg-gray-200': profileCreatorManagerStore.set('profile', profile)}">
                <td>{{ profile.name }}</td>
                <td>{{ profile.quick_capture }}</td>
                <td>{{ profile.sections_count }}</td>
                <td>{{ profile.fields_count }}</td>
                <td>{{ FunctionsHelper.DateTime(profile.updated_at) }}</td>
                <td>{{ FunctionsHelper.DateTime(profile.created_at) }}</td>
                <td class="last pl-2">
                    <a :href="route('profile-creation.edit', { id: profile.id, profile_category_id: 1, quick_capture: 1 })" class="justify-center py-2 px-3 text-xs leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">
                      View
                    </a>
                    <a :href="route('profile-creation.edit', { id: profile.id, profile_category_id: 1, quick_capture: 1 })" class="justify-center py-2 px-3 text-xs leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white ml-2">
                      Edit
                    </a>
                    <button @click="profileCreatorManagerStore.showRemoveProfileConfirmation(toast, confirm, profile)" type="button" class="w-[30px] h-[30px] bg-[#dae3e7] rounded justify-center items-center gap-1 ml-2">
                      <i class="pi pi-trash text-red"></i>
                    </button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </template>
  </AuthenticatedLayout>
  <Toast position="top-center">
    <template #message="slotProps">
      <div class="flex flex-column align-items-start" style="flex: 1">
        <div class="font-medium text-sm my-1 text-900">{{ slotProps.message.detail }}</div>
      </div>
    </template>
  </Toast>
  <ConfirmDialog :style="{ width: '400px' }">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-col w-full gap-4 p-4">
        <span class="text-2xl font-bold font-['Roboto'] leading-loose">{{ message.header }}</span>
        <p class="text-base font-normal font-['Nunito'] leading-normal" v-html="message.message"></p>
      </div>
      <div class="row">
        <div class="col-12 py-3 px-4 text-right">
          <Button label="Cancel" outlined @click="rejectCallback" class="gap-2 justify-center py-2 px-4 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white mr-2"></Button>
          <Button :label="'Yes, Remove'" @click="acceptCallback" class="px-4 py-2 bg-neutral-700 rounded-custom-25 border border-neutral-700 justify-center items-center text-white"></Button>
        </div>
      </div>
    </template>
  </ConfirmDialog>
</template>