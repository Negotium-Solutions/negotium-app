<script setup>
import { useProfilesManagerStore } from "@/stores/index.js";
import Button from "primevue/button";
import { computed, onMounted, ref } from "vue";
import { usePage } from "@inertiajs/vue3";
import Dialog from "primevue/dialog";
import ExtendProfileLayout from "@/Pages/Profile/ProfileLayout.vue";

const profileManagerStore = useProfilesManagerStore();
const messages = computed(() => usePage().props.messages);
const no_notes_for_profile = messages.value.note.no_notes_for_profile;
const show_default_page = false;
const show_add_note = ref(false);

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
    <div class="d-flex w-100 pt-4 pl-2 pr-2 pb-3">
      <div class="col-sm-6">
        <h1 class="text-neutral-700 text-3xl font-bold font-['Roboto']">Notes & Reminders</h1>
      </div>
      <div class="col-sm-6 text-right">
        <button @click="show_add_note = true" class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Add Note or Reminder</button>
      </div>
    </div>
    <div class="col-md-12 pl-2 pr-2">
      <div v-if="profileManagerStore"></div>
      <div v-if="show_default_page === false" class="flex items-start border-b border-gray-300 p-4 bg-white">
        <div class="flex w-10 h-8 bg-blue-200 rounded-sm justify-center items-center">
          <span class="font-bold">Note</span>
        </div>
        <div class="flex-1 flex flex-col pl-4">
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center">
              <span class="font-semibold mr-2">Note Heading</span>
            </div>
            <div class="flex items-center">
              <span class="font-semibold pr-2">Reminder Date</span>
              <span class="fa fa-calendar-day"></span>
              <button class="btn btn-red text-right">X</button>
            </div>
          </div>
          <div class="mt-1 ">
            <span>You haven't send any communications to this profile.
                  Easily send messages or email to this profile by clicking on
                  'Send Email' or 'Send Message' in the top right corner.</span>
          </div>
          <div class="flex items-center justify-between mt-1">
            <div class="font-bold">
              <span>Added by: Benjamin Button</span>
            </div>
            <div class="flex items-center">
              <span class="text-right">Date Created</span>
            </div>
          </div>
        </div>
      </div>
      <table v-else class="w-100">
        <tr>
          <td>
            <div class="text-center" v-html="no_notes_for_profile"></div>
            <div class="text-center mt-4">
              <button class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">View Guide</button>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
  <Dialog v-model:visible="show_add_note" modal header="Add note or reminder" :style="{ width: '40vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' } ">
    <hr/>
    <div class="mt-2">
      <span>Note Subject</span>
      <div class="w-100">
        <input type="text">
      </div>
    </div>
    <div class="mt-2">
      <span>Note</span>
      <div class="border-1 rounded-sm">
        <div class="mb-2 flex flex-wrap gap-2">
          <button @click="formatText('bold')" class="p-2 text-neutral-700 hover:bg-neutral-700 hover:text-white">
            <i class="fas fa-bold"></i>
          </button>
          <button @click="formatText('italic')" class="p-2 text-neutral-700 hover:bg-neutral-700 hover:text-white">
            <i class="fas fa-italic"></i>
          </button>
          <button @click="formatText('underline')" class="p-2 text-neutral-700 hover:bg-neutral-700 hover:text-white">
            <i class="fas fa-underline"></i>
          </button>
          <button @click="formatText('strikeThrough')" class="p-2 text-neutral-700 hover:bg-neutral-700 hover:text-white">
            <i class="fas fa-strikethrough"></i>
          </button>
          <button @click="formatText('justifyLeft')" class="p-2 text-neutral-700 hover:bg-neutral-700 hover:text-white">
            <i class="fas fa-align-left"></i>
          </button>
          <button @click="formatText('justifyCenter')" class="p-2 text-neutral-700 hover:bg-neutral-700 hover:text-white">
            <i class="fas fa-align-center"></i>
          </button>
          <button @click="formatText('justifyRight')" class="p-2 text-neutral-700 hover:bg-neutral-700 hover:text-white">
            <i class="fas fa-align-right"></i>
          </button>
          <button @click="formatText('insertOrderedList')" class="p-2 text-neutral-700 hover:bg-neutral-700 hover:text-white">
            <i class="fas fa-list-ol"></i>
          </button>
          <button @click="formatText('insertUnorderedList')" class="p-2 text-neutral-700 hover:bg-neutral-700 hover:text-white">
            <i class="fas fa-list-ul"></i>
          </button>
        </div>
        <div class="border rounded-sm p-4 bg-white min-h-[200px]" contenteditable="true" ref="editor" @input="updateContent">
          <p>Type your content here...</p>
        </div>
      </div>
    </div>
    <div class="mt-2">
      <span>Set Reminder</span>
      <div class="w-100">
        <input type="datetime-local" class="col-sm-6  gap-2">
        <input type="time" class="col-sm-6  pl-2">
      </div>
    </div>
    <div class="d-flex w-100 pt-4 pl-2 pr-2 pb-3">
      <div class="col-sm-6 text-right">
        <button class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Cancel</button>
        <button class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Add Note</button>
      </div>
    </div>
  </Dialog>
  </ExtendProfileLayout>
</template>