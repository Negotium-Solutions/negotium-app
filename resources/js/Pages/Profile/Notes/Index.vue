<script setup>
import { useProfilesManagerStore } from "@/stores/index.js";
import Button from "primevue/button";
import { computed, onMounted, ref } from "vue";
import Dialog from "primevue/dialog";
import ConfirmDialog from "primevue/confirmdialog";
import ExtendProfileLayout from "@/Pages/Profile/ProfileLayout.vue";
import { useToast } from "primevue/usetoast";
import { usePage } from "@inertiajs/vue3";
import { useConfirm } from "primevue/useconfirm";
import {FunctionsHelper} from "../../../helpers/index.js";

const profileManagerStore = useProfilesManagerStore();
const toast = useToast();
const confirm = useConfirm();

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

function showNoteConfirmation(type,heading)
{
  confirm.require({
    header: 'Confirm removal',
    message: 'Are you sure you want to remove the '+type+' named '+heading+'?',
    acceptLabel: 'Yes, Remove',
    acceptClass: 'btn btn-sm btn-default mr-2',
    rejectLabel: 'Cancel',
    rejectClass: 'btn btn-sm btn-default mr-2',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Save'
    },
    accept: () => {
      toast.add({ severity: 'success', detail: 'The '+type+' named '+heading+' successfully removed.', life: 3000 });
    },
    reject: () => {
      //
    }
  
})
}
</script>

<template>
  <ExtendProfileLayout>
  <div v-if="profileManagerStore.isSelected('profile', profileManagerStore.profile)" class="col-lg-12 pl-0 pr-0">
    <div class="d-flex w-100 pt-3 pl-3 pr-3 pb-3">
      <div class="col-sm-6 p-0">
        <h1 class="text-neutral-700 text-[1.5rem] font-bold font-['Roboto']">Notes & Reminders</h1>
      </div>
      <div class="col-sm-6 text-right">
        <button @click="show_add_note = true" class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">Add Note or Reminder</button>
      </div>
    </div>
    <div class="col-md-12 pl-3 pr-3">
      <div v-if="profileManagerStore"></div>
      <div v-if="show_default_page === false">

        <div v-for="(note, index) in profileManagerStore.profile.notes" :index="index" class="flex items-start border-b border-gray-300 pb-4 bg-white mb-4">
          <div class="flex-1 flex flex-col">
            <div class="flex items-center justify-between mb-1">
              <div class="text-neutral-700 text-base font-medium font-['Roboto'] leading-normal">
                <div  class="h-7 p-2 bg-[#f2f6f7] rounded-lg flex justify-center items-center gap-2 inline-flex">
                  <div class="text-neutral-700 text-xs font-medium font-['Roboto'] leading-3">Note</div>
                </div>
                {{ note.subject }}
              </div>
              <div class="flex items-center">
                <div class="input-group rounded-custom-25">
                  <input type="text" class="h-7 w-[50px] text-xs reminder-date-input" aria-label="Reminder Date" :value="FunctionsHelper.DateTime(note.reminder_datetime)" disabled>
                  <div class="input-group-append">
                    <span class="input-group-text h-7 text-[.75rem] reminder-date-icon"><i class="fa fa-calendar-day"></i></span>
                  </div>
                </div>
                <button class="h-7 w-7 p-1 bg-[#f57a7a] rounded flex-col justify-center items-center gap-2 inline-flex text-white ml-2" @click="showNoteConfirmation('Note','Note Heading')">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div class="mt-1 ">
              <span class="text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">
                {{ note.note }}
              </span>
            </div>
            <div class="flex items-center justify-between mt-1">
              <div class="font-bold">
                <span class="text-neutral-700 text-sm font-normal font-['Roboto'] leading-tight">Added by: <span class="text-neutral-700 text-sm font-medium font-['Roboto'] leading-tight">{{ note.user.first_name+' '+note.user.last_name }}</span></span>
              </div>
              <div class="flex items-center">
                <span class="text-right text-neutral-400 text-sm font-normal font-['Roboto'] leading-tight">{{ FunctionsHelper.DateTime(note.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>


        <div class="flex items-start border-b border-gray-300 pb-4 pt-4 bg-white">
          <div class="flex-1 flex flex-col">
            <div class="flex items-center justify-between mb-1">
              <div class="text-neutral-700 text-base font-medium font-['Roboto'] leading-normal">
                <div  class="h-7 p-2 bg-[#f2f6f7] rounded-lg flex justify-center items-center gap-2 inline-flex">
                  <div class="text-neutral-700 text-xs font-medium font-['Roboto'] leading-3">Reminder</div>
                </div>
                Reminder Heading
              </div>
              <div class="flex items-center">
                <div class="input-group rounded-custom-25">
                  <input type="text" class="h-7 w-[50px] text-xs reminder-date-input" aria-label="Reminder Date" value="12/06/2024 - 13:00">
                  <div class="input-group-append">
                    <span class="input-group-text h-7 text-[.75rem] reminder-date-icon"><i class="fa fa-calendar-day"></i></span>
                  </div>
                </div>
                <button class="h-7 w-7 p-1 bg-[#f57a7a] rounded flex-col justify-center items-center gap-2 inline-flex text-white ml-2" @click="showNoteConfirmation('Reminder','Reminder Heading')">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div class="mt-1 ">
              <span class="text-neutral-400 text-sm font-normal font-['Nunito'] leading-tight">Lorem ipsum dolor sit amet consectetur. Elit dui tortor id erat sed. Malesuada quam sed nec enim. Et tincidunt imperdiet egestas at massa. Ut in fames ut blandit nam maecenas consequat egestas. Quam vitae elementum nisl venenatis tellus sed. Non cum sit quis.</span>
            </div>
            <div class="flex items-center justify-between mt-1">
              <div class="font-bold">
                <span class="text-neutral-700 text-sm font-normal font-['Roboto'] leading-tight">Added by: <span class="text-neutral-700 text-sm font-medium font-['Roboto'] leading-tight">Benjamin Button</span></span>
              </div>
              <div class="flex items-center">
                <span class="text-right text-neutral-400 text-sm font-normal font-['Roboto'] leading-tight">12/05/2024 - 13:12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table v-else class="w-100 mt-4 pt-4">
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
  <Dialog v-model:visible="show_add_note" :draggable="false" modal header="Add note or reminder" :style="{ width: '40vw' }" :class="'notes-dialog'" :breakpoints="{ '1199px': '75vw', '575px': '90vw' } ">
    <template #header>
      <div class="row m-0 p-0 pb-2">
        <div class="text-neutral-700 text-[1.5rem] font-bold font-['Roboto'] leading-loose w-100">Add note or reminder</div>
      </div>
    </template>
    <div>
      <span class="text-neutral-700 text-sm font-normal font-['Nunito'] leading-3 pb-2">Note Subject</span>
      <div class="w-100">
        <input type="text" class="form-control">
      </div>
    </div>
    <div class="mt-2">
      <span class="text-neutral-700 text-sm font-normal font-['Nunito'] leading-3 pb-2">Note</span>
      <div class="form-control-border rounded-sm bg-zinc-100">
        <div class="flex flex-wrap gap-2">
          <button @click="formatText('bold')" class="p-2 text-neutral-700 hover:bg-neutral-700 hover:text-white text-sm">
            <i class="fas fa-bold"></i>
          </button>
          <button @click="formatText('italic')" class="p-2 text-neutral-700 hover:bg-neutral-700 hover:text-white text-sm">
            <i class="fas fa-italic"></i>
          </button>
          <button @click="formatText('underline')" class="p-2 text-neutral-700 hover:bg-neutral-700 hover:text-white text-sm">
            <i class="fas fa-underline"></i>
          </button>
          <button @click="formatText('strikeThrough')" class="p-2 text-neutral-700 hover:bg-neutral-700 hover:text-white text-sm">
            <i class="fas fa-strikethrough"></i>
          </button>
          <button @click="formatText('justifyLeft')" class="p-2 text-neutral-700 hover:bg-neutral-700 hover:text-white text-sm">
            <i class="fas fa-align-left"></i>
          </button>
          <button @click="formatText('justifyCenter')" class="p-2 text-neutral-700 hover:bg-neutral-700 hover:text-white text-sm">
            <i class="fas fa-align-center"></i>
          </button>
          <button @click="formatText('justifyRight')" class="p-2 text-neutral-700 hover:bg-neutral-700 hover:text-white text-sm">
            <i class="fas fa-align-right"></i>
          </button>
          <button @click="formatText('insertOrderedList')" class="p-2 text-neutral-700 hover:bg-neutral-700 hover:text-white text-sm">
            <i class="fas fa-list-ol"></i>
          </button>
          <button @click="formatText('insertUnorderedList')" class="p-2 text-neutral-700 hover:bg-neutral-700 hover:text-white text-sm">
            <i class="fas fa-list-ul"></i>
          </button>
        </div>
        <div class="p-2 bg-white min-h-[200px] notes-editor" contenteditable="true" ref="editor" @input="updateContent">
          <p>Type your content here...</p>
        </div>
      </div>
    </div>
    <div class="mt-2">
      <span class="text-neutral-700 text-sm font-normal font-['Nunito'] leading-3 mb-4">Set Reminder</span>
      <div class="d-flex gap-2 w-100">
        <input type="date" class="form-control">
        <input type="time" class="form-control">
      </div>
    </div>
    <template #footer>
      <div class="row">
        <div class="col-12 p-4 pr-0 text-right">
          <button class="gap-2 justify-center py-2 px-4 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white mr-2" @click="cancel">Cancel</button>
          <button class="gap-2 justify-center py-2 px-4 rounded-custom-25 border border-solid bg-neutral-700 border-neutral-700 border-opacity-20 text-white hover:bg-neutral-700 hover:text-white">Add Note</button>
        </div>
      </div>
    </template>
  </Dialog>

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
  </ExtendProfileLayout>
</template>