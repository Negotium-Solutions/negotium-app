<script setup>
import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import { onMounted, computed } from "vue";
import Breadcrumb from 'primevue/breadcrumb';
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useProfileCreatorManager } from "@/stores";
import { usePage } from "@inertiajs/vue3";
import Button from "primevue/button";

const toast = useToast();
const page = usePage();
const user = computed(() => page.props.auth.user);
const messages = computed(() => page.props.messages);
const profile_creator_messages = messages.value;

const negotium_api_url = computed(() => page.props.negotium_api_url);
const breadCrumbs = [{label: 'Home'}, {label: 'Profiles'}, {label: 'Create Profile', class: 'active'}];

const profileCreatorManager = useProfileCreatorManager();

const props = defineProps({
  profile: null,
  categoryTypes: null,
  profileCategory: null,
  quick_capture: null,
  profile_category_id: null
});

onMounted(() => {
  profileCreatorManager.set('profile', props.profile);
  profileCreatorManager.set('categoryTypes', props.categoryTypes);
  profileCreatorManager.set('profileCategory', props.profileCategory);
  profileCreatorManager.set('quick_capture', props.quick_capture);
  profileCreatorManager.set('profile_category_id', props.profile_category_id);
});
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <div class="col-sm-6">
        <h1 class="m-0">Profiles</h1>
        <Breadcrumb :model="breadCrumbs" :class="'p-0 text-sm'">
          <template #separator> <i class="pi pi-arrow-right text-sm"></i></template>
        </Breadcrumb>
      </div><!-- /.col -->
      <div class="col-sm-6 text-right pt-3">
        <a :href="route('profile-creation')" class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 w-24 text-neutral-700 hover:text-neutral-700 cursor-pointer mr-2">Cancel</a>
        <a href="javascript:void(0)" @click="profileCreatorManager.create(toast)" class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 bg-neutral-700 text-white cursor-pointer">Save Draft</a>
      </div><!-- /.col -->
    </template>

    <div class="content-container pl-4 pr-4">

      <div class="row" id="profile-creator-content">

        <div class="col-lg-3 col-md-3 col-sm-12 pr-0 h-100">
          <div class="card card-default h-100">
            <div class="card-header border-bottom-0 pb-0">
              <div class="text-neutral-700 text-[1.25rem] font-bold font-['Roboto'] leading-loose">Profile Info</div>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Profile name</div>
                <input v-model="profileCreatorManager.profile.name" type="text" class="mt-2 form-control form-control-md form-control-custom" id="profile-name" placeholder="What do you want to call this profile?">
                <div class="input-validation-error" v-if="typeof profileCreatorManager.createProfileErrors?.name !== 'undefined'">
                  <span v-for="(error, index) in profileCreatorManager.createProfileErrors?.name" :key="index" class="error invalid-feedback">{{ error }}</span>
                </div>
              </div>
              <div class="mb-2">
                <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Create quick capture for this profile?</div>
                <div v-if="profileCreatorManager.isSet('profile', props.profile)" class="btn-group btn-group-toggle w-100 mt-2" data-toggle="buttons">
                  <a :href="route('profile-creation.edit', { id: profileCreatorManager.profile.id, profile_category_id: profileCreatorManager.profile_category_id, quick_capture: profileCreatorManager.getQuickCaptureId('Yes') })" class="btn btn-sm btn-outline-secondary border-neutral-700 border-opacity-20"  :class="{ 'bg-zinc-100' : parseInt(profileCreatorManager.quick_capture) === 1 }">
                    <input type="radio" name="options" id="option_1" autocomplete="off">
                    <span class="text-neutral-700 font-normal" :class="{ 'text-white' : parseInt(profileCreatorManager.quick_capture) === 1 }">Yes</span>
                  </a>
                  <a :href="route('profile-creation.edit', { id: profileCreatorManager.profile.id, profile_category_id: profileCreatorManager.profile_category_id, quick_capture: profileCreatorManager.getQuickCaptureId('No') })" class="btn btn-sm btn-outline-secondary border-neutral-700 border-opacity-20"  :class="{ 'bg-zinc-100' : parseInt(profileCreatorManager.quick_capture) === 2 }">
                    <input type="radio" name="options" id="option_2" autocomplete="off">
                    <span class="text-neutral-700 font-normal" :class="{ 'text-white' : parseInt(profileCreatorManager.quick_capture) === 2 }">No</span>
                  </a>
                </div>
              </div>
              <div class="mt-3">
                <div class="h-0.5 opacity-10 bg-neutral-700 rounded-[1px]"></div>
              </div>
              <div class="mt-3">
                <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3 mb-3">Profile sections</div>
              </div>
              <div class="input-validation-error" v-if="typeof profileCreatorManager.createSectionErrors?.steps !== 'undefined'">
                <span v-for="(error, index) in profileCreatorManager.createSectionErrors?.steps" :key="index" class="error invalid-feedback">{{ error }}</span>
              </div>

              <div class="mt-3" v-if="profileCreatorManager.isSet('profile', profileCreatorManager.profile)">
                <div class="p-3 mt-3 border rounded text-xs font-normal font-['Nunito'] leading-3" v-for="(step, index) in profileCreatorManager.profile.steps" :key="index">
                  <span class="font-bold">{{ step.name }}</span>
                  <span @click="profileCreatorManager.removeSection(step)" class="cursor-pointer float-right">
                    <i class="pi pi-times text-sm custom-icon-sm text-red"></i>
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div class="col-lg-1 col-md-1 col-sm-12 pr-0 h-100">
        </div>

        <div class="col-lg-5 col-md-5 col-sm-12 pr-0 h-100">
          <div class="card card-default h-100">
            <div class="card-header border-bottom-0 pb-0">
              <div class="text-neutral-700 text-[1.25rem] font-bold font-['Roboto'] leading-loose">Profile sections</div>
              <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Add section templates or create your own</div>
            </div>
            <div class="card-body">
              <div class="mt-3">
                <hr class="opacity-10 bg-neutral-700"/>
              </div>
              <div class="mt-3">
                <div class="btn-group btn-group-toggle rounded-custom-25" data-toggle="buttons">
                  <a :href="route('profile-creation.edit', { id: profileCreatorManager.profile.id, profile_category_id: categoryType.id, quick_capture: profileCreatorManager.quick_capture })" v-for="(categoryType, index) in profileCreatorManager.categoryTypes" :key="index" @click="profileCreatorManager.set('profileCategory', profileCategory)" class="btn btn-sm btn-outline-secondary text-xs border-neutral-700 border-opacity-20 py-2 px-4 font-['Roboto']"  :class="{ 'bg-zinc-100' : profileCreatorManager.profileCategory.id === categoryType.id }">
                    <input type="radio" name="options" :id="'option_'+categoryType.id" autocomplete="off">
                    <span class="text-neutral-700 font-normal text-xs" :class="{ 'text-white' : profileCreatorManager.profileCategory.id === categoryType.id }">{{ categoryType.name }}</span>
                  </a>
                </div>
              </div>
              <div class="mt-3" v-if="profileCreatorManager.isSet('profileCategory', profileCreatorManager.profileCategory) && profileCreatorManager.profileCategory.templates.length === 0">
                <hr class="opacity-10 bg-neutral-700"/>
              </div>
              <div class="mt-3">
                <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3 mb-3" v-if="profileCreatorManager.isSet('profileCategory', profileCreatorManager.profileCategory) && profileCreatorManager.profileCategory.templates.length === 0">Profile sections</div>
              </div>

              <div class="mt-3" v-if="profileCreatorManager.isSet('profileCategory', profileCreatorManager.profileCategory) && profileCreatorManager.profileCategory.templates.length > 0">
                <div class="p-3 mt-3 border rounded text-xs font-normal font-['Nunito'] leading-3" v-for="(template, index) in profileCreatorManager.getSections" :key="index">
                  <span class="font-bold">{{ template.name }}</span>
                  <button @click="profileCreatorManager.addSection(template)" class="justify-center py-1.5 px-2.5 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white float-right">
                    <i class="pi pi-plus custom-icon-sm"></i> Add
                  </button>
                  <span class="flex mt-1 text-neutral-700 opacity-50">{{ template.sample }}</span>
                </div>
              </div>
              <div v-html="profile_creator_messages.profile_creator.all_templates_added" class="mt-3 p-4 text-center" v-if="profileCreatorManager.isSet('profileCategory', profileCreatorManager.profileCategory) && profileCreatorManager.profileCategory.templates.length === 0"></div>

            </div>
            <div class="card-footer bg-white pt-0">
              <hr class="opacity-10 bg-neutral-700"/>
              <div class="mt-3 mb-3">
                <button class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white">
                  Add custom section
                </button>
                <button @click="profileCreatorManager.createSections(toast)" class="justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 bg-neutral-700 text-white float-right">
                  Next - Manage inputs
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <Toast position="top-center">
      <template #message="slotProps">
        <div class="flex flex-column align-items-start" style="flex: 1">
          <div class="font-medium text-sm my-1 text-900">{{ slotProps.message.detail }}</div>
        </div>
      </template>
    </Toast>
  </AuthenticatedLayout>
</template>

<style scoped>
.bg-olive:hover {
  background-color: #2e7555 !important;
  border-color: #2b6b4f;
}
</style>