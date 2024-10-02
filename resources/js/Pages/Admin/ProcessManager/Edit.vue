<script setup>

import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import { onMounted, ref } from "vue";
import Breadcrumb from 'primevue/breadcrumb';
import Dropdown from 'primevue/dropdown';
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useProcessManagerStore } from "@/stores";
import { usePage } from "@inertiajs/vue3";
import Button from "primevue/button";
import NegotiumButton from "@/Components/negotium/Button.vue";
import Dialog from "primevue/dialog";
import Carousel from "@/Components/negotium/Carousel.vue"
import {useConfirm} from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
// import Carousel from 'primevue/carousel';

const page = usePage();
const breadCrumbs = [{label: 'Process Information'}, {label: 'Steps & Activities', class: 'active'}, {label: 'Team Access'}];

const confirm = useConfirm();
const toast = useToast();
const processManagerStore = useProcessManagerStore();

const props = defineProps({
  step_id: null,
  lookup: null,
  process: null,
  dynamicModelFieldTypeGroup: null
});

onMounted(() => {
  processManagerStore.handleProcessDivHeight()
  window.addEventListener('resize', processManagerStore.handleProcessDivHeight);
  processManagerStore.setLookUp('categories', props.lookup.categories);
  processManagerStore.set('process', props.process);
  processManagerStore.set('dynamicModelFieldTypeGroups', props.dynamicModelFieldTypeGroup);
  processManagerStore.setStep(parseInt(props.step_id));
  processManagerStore.lookup.categories.forEach((category, index) => {
    if(category.id === processManagerStore.process.process_category_id) {
      processManagerStore.selectedCategory = props.lookup.categories[index];
    }
  });

  // Get the current URL
  const urlParams = new URLSearchParams(window.location.search);
  // Check if 'addActivity' is set
  if (urlParams.has('addActivity')) {
    if(urlParams.get('addActivity')) {
      processManagerStore.showAddActivity = true;
    }
  }
})

/*
const products = [
  {'name': 'Name', 'price': 'R250'},
  {'name': 'Name', 'price': 'R250'},
  {'name': 'Name', 'price': 'R250'},
  {'name': 'Name', 'price': 'R250'},
  {'name': 'Name', 'price': 'R250'},
  {'name': 'Name', 'price': 'R250'},
  {'name': 'Name', 'price': 'R250'},
];

// const products = ref();
const responsiveOptions = ref([
  {
    breakpoint: '1400px',
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: '1199px',
    numVisible: 3,
    numScroll: 1
  },
  {
    breakpoint: '767px',
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: '575px',
    numVisible: 1,
    numScroll: 1
  }
]);

const getSeverity = (status) => {
  switch (status) {
    case 'INSTOCK':
      return 'success';

    case 'LOWSTOCK':
      return 'warn';

    case 'OUTOFSTOCK':
      return 'danger';

    default:
      return null;
  }
};
*/
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <div class="d-flex w-100">
      <div class="col-sm-6">
        <h1 class="text-neutral-700 text-4xl font-bold font-['Roboto'] mb-2">Process Creator</h1>
        <Breadcrumb :model="breadCrumbs" :class="'p-0 text-sm'">
          <template #separator> <i class="pi pi-arrow-right text-sm"></i></template>
        </Breadcrumb>
      </div><!-- /.col -->
      </div>
    </template>

    <div class="content-container pl-4 pr-4">

          <!--

          <Carousel :value="processManagerStore.process.steps" :numVisible="3" :numScroll="3" :responsiveOptions="responsiveOptions">
            <template #item="slotProps">

              <div class="col-lg-12 col-md-12 col-sm-12">
                <div class="card card-default">
                  <div class="card-header border-bottom-0 pb-0">
                    <div class="text-neutral-700 text-[1.25rem] font-bold font-['Roboto'] leading-loose">{{ slotProps.data.name }}</div>
                  </div>

                  <div class="card-body">
                    <div v-if="!(processManagerStore.step.id > 0)" class="mb-3">
                      <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Step name</div>
                      <input v-model="processManagerStore.step.name" type="text" class="mt-2 form-control form-control-md form-control-custom" id="process-name" placeholder="What do you want to call this process?">
                      <div class="input-validation-error" v-if="typeof processManagerStore.stepErrors?.name !== 'undefined'">
                        <span v-for="(error, index) in processManagerStore.stepErrors?.name" :key="index" class="error invalid-feedback">{{ error }}</span>
                      </div>
                    </div>
                    <div>
                      <div class="h-0.5 opacity-10 bg-neutral-700 rounded-[1px]"></div>
                    </div>
                    <div class="mt-4">
                      <button v-if="!processManagerStore.loading" @click="processManagerStore.showAddActivityModal(toast)" class="flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white w-full"><i class="pi pi-plus text-sm custom-icon-sm"></i> Add activity</button>
                      <button v-if="processManagerStore.loading" class="flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white w-full" disabled><i class="pi pi-spin pi-spinner text-sm custom-icon-sm"></i> Loading ...</button>
                    </div>

                    <div class="mt-4">
                      <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3 mb-2">Step Activities</div>
                      <div @click="processManagerStore.set('activity', activity); processManagerStore.clearError()" v-for="(activity, index) in slotProps.data.activities" :key="index" class="w-100 p-2 rounded border border-neutral-700/opacity-25 flex-col justify-start items-start gap-2 inline-flex mb-1"  :class="{ 'bg-zinc-100' : processManagerStore.activity.id === activity.id }">
                        <span>Activity Type - {{ activity.field_type.name }}</span>
                        <div class="font-medium text-neutral-700 text-sm font-['Roboto'] leading-tight" >{{ activity.label }}</div>

                        <div class="items-center">
                          <button type="button" data-toggle="dropdown" class="btn btn-tool mt-0">
                            <i class="pi pi-ellipsis-v"></i>
                          </button>
                          <div class="dropdown-menu dropdown-menu dropdown-menu-right">
                            <a href="#" class="dropdown-item">
                              <small>Edit</small> <i class="pi pi-file-edit float-right mt-1"></i>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                              <small>Delete</small> <i class="pi pi-times float-right mt-1"></i>
                            </a>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              </div>

            </template>
          </Carousel>

          -->

      <div class="row" id="process-creator-content">
        <div class="col-lg-3 col-md-3 col-sm-12 pr-0 h-100">
          <div class="card card-default h-100">
            <div class="card-header border-bottom-0 pb-0">
              <div class="text-neutral-700 text-[1.25rem] font-bold font-['Roboto'] leading-loose">Process Info</div>
            </div>
            <!-- /.card-header -->
            <div class="card-body">
              <div class="mb-2">
                <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Process name</div>
                <input v-model="processManagerStore.process.name" type="text" class="mt-2 form-control form-control-md form-control-custom" id="process-name" placeholder="What do you want to call this process?">
                <div class="input-validation-error" v-if="typeof processManagerStore.processErrors?.name !== 'undefined'">
                  <span v-for="(error, index) in processManagerStore.processErrors?.name" :key="index" class="error invalid-feedback">{{ error }}</span>
                </div>
              </div>
              <div class="mb-2">
                <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Category</div>
                <Dropdown disabled v-model="processManagerStore.selectedCategory" :options="processManagerStore.lookup.categories" filter @filter="processManagerStore.onFilter" optionLabel="name" placeholder="Select a category" class="mt-2 w-full md:w-14rem form-control-custom" :class="{'is-invalid-custom': false}">
                  <template #value="slotProps">
                    <div v-if="slotProps.value" class="w-100">
                      <span>{{ slotProps.value.name }}</span>
                      <i class="fa fa-square float-right" :style="'color: '+slotProps.value.color"></i>
                    </div>
                    <span v-else>
                          {{ slotProps.placeholder }}
                      </span>
                  </template>
                  <template #option="slotProps">
                    <div class="p-dropdown-empty-message w-100 text-center border" v-if="slotProps.option.id === 0">
                      <span>{{ slotProps.option.name }}</span>
                    </div>
                    <div class="w-100" v-else>
                      <span class="text-neutral-700 text-sm font-normal font-['Nunito'] leading-tight">{{ slotProps.option.name }}</span>
                      <i class="fa fa-square float-right" :style="'color: '+slotProps.option.color"></i>
                    </div>
                  </template>
                  <template #footer>
                    <div class="w-100">
                      <button @click="processManagerStore.createCategory(toast)" class="w-100 h-[30px] px-4 py-2 rounded border border-neutral-700 justify-center items-center mx-2 my-2 text-center text-xs font-normal font-['Roboto'] leading-3" :class="{'hover:bg-neutral-700 hover:text-white': !processManagerStore.loading}" :disabled="processManagerStore.loading">
                        {{ !processManagerStore.loading ? 'Create new category' : 'Loading ...' }}
                      </button>
                    </div>
                  </template>
                </Dropdown>
                <div class="input-validation-error" v-if="typeof processManagerStore.categoryErrors?.name !== 'undefined'">
                  <span v-for="(error, index) in processManagerStore.categoryErrors?.name" :key="index" class="error invalid-feedback">{{ error }}</span>
                </div>
                <div class="input-validation-error" v-if="typeof processManagerStore.processErrors?.process_category_id !== 'undefined'">
                  <span v-for="(error, index) in processManagerStore.processErrors?.process_category_id" :key="index" class="error invalid-feedback">{{ error }}</span>
                </div>
              </div>
              <div class="mt-3">
                <div class="h-0.5 opacity-10 bg-neutral-700 rounded-[1px]"></div>
              </div>
              <div class="mt-4">
                <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3 mb-2">Steps</div>
                <a :href="route('process-manager.edit', [process.id, step.id])" v-for="(step, index) in processManagerStore.process.steps" :key="index" class="w-100 h-9 p-2 rounded border border-neutral-700/opacity-25 flex-col justify-start items-start gap-2 inline-flex mb-1"  :class="{ 'bg-zinc-100' : processManagerStore.step.id === step.id }">
                  <div class="flex font-medium text-neutral-700 text-sm font-['Roboto'] leading-tight" >
                    <span>{{ step.name }}</span>

                    <div class="items-center">
                      <button type="button" data-toggle="dropdown" class="btn btn-tool mt-0">
                        <i class="pi pi-ellipsis-v"></i>
                      </button>
                      <div class="dropdown-menu dropdown-menu dropdown-menu-right">
                        <a href="#" class="dropdown-item">
                          <small>Edit</small> <i class="pi pi-file-edit float-right mt-1"></i>
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="#" @click="processManagerStore.deleteItem(step, 'step', confirm, toast)" class="dropdown-item">
                          <small>Delete</small> <i class="pi pi-times float-right mt-1"></i>
                        </a>
                      </div>
                    </div>
                  </div>

                </a>


              </div>
            </div>
            <!-- /.card-body -->
          </div>
        </div>

        <div class="col-lg-1 col-md-1 col-sm-12 pr-0 pl-0 pt-4">
          <hr class="mt-7" style="border-color: #43AA8B;"/>
        </div>

        <div class="col-lg-3 col-md-3 col-sm-12 pl-0 pr-o mr-0" style="padding-right: 0px;">
          <div class="card card-default">
            <div class="card-header border-bottom-0 pb-0">
              <div class="text-neutral-700 text-[1.25rem] font-bold font-['Roboto'] leading-loose">{{ processManagerStore.step.name }}</div>
            </div>
            <!-- /.card-header -->
            <div class="card-body">
              <div v-if="!(processManagerStore.step.id > 0)" class="mb-3">
                <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Step name</div>
                <input v-model="processManagerStore.step.name" type="text" class="mt-2 form-control form-control-md form-control-custom" id="process-name" placeholder="What do you want to call this process?">
                <div class="input-validation-error" v-if="typeof processManagerStore.stepErrors?.name !== 'undefined'">
                  <span v-for="(error, index) in processManagerStore.stepErrors?.name" :key="index" class="error invalid-feedback">{{ error }}</span>
                </div>
              </div>
              <div>
                <div class="h-0.5 opacity-10 bg-neutral-700 rounded-[1px]"></div>
              </div>
              <div class="mt-4">
                <button v-if="!processManagerStore.loading" @click="processManagerStore.showAddActivityModal(toast)" class="flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white w-full"><i class="pi pi-plus text-sm custom-icon-sm"></i> Add activity</button>
                <button v-if="processManagerStore.loading" class="flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white w-full" disabled><i class="pi pi-spin pi-spinner text-sm custom-icon-sm"></i> Loading ...</button>
              </div>

              <div class="mt-4">
                <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3 mb-2">Step Activities</div>
                <div @click="processManagerStore.set('activity', activity); processManagerStore.clearError()" v-for="(activity, index) in processManagerStore.step.activities" :key="index" class="w-100 p-2 rounded border border-neutral-700/opacity-25 flex-col justify-start items-start gap-2 inline-flex mb-1"  :class="{ 'bg-zinc-100' : processManagerStore.activity.id === activity.id }">
                  <span>Activity Type - {{ activity.field_type.name }}</span>
                  <div class="font-medium text-neutral-700 text-sm font-['Roboto'] leading-tight" >{{ activity.label }}</div>

                  <div class="items-center">
                    <button type="button" data-toggle="dropdown" class="btn btn-tool mt-0">
                      <i class="pi pi-ellipsis-v"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu dropdown-menu-right">
                      <a href="#" class="dropdown-item">
                        <small>Edit</small> <i class="pi pi-file-edit float-right mt-1"></i>
                      </a>
                      <div class="dropdown-divider"></div>
                      <a href="#" @click="processManagerStore.deleteItem(activity, 'activity', confirm, toast)" class="dropdown-item">
                        <small>Delete</small> <i class="pi pi-times float-right mt-1"></i>
                      </a>
                    </div>
                  </div>
                </div>

              </div>

            </div>
            <!-- /.card-body -->
          </div>
        </div>

        <div class="col-lg-1 col-md-1 col-sm-12 pr-0 pl-0 pt-4">
          <hr class="mt-7" style="border-color: #43AA8B;"/>
        </div>

        <div class="col-lg-1 col-md-1 col-sm-12 pr-0 pl-0 pt-4">
          <a :href="route('process-manager.edit', [process.id])" class="mt-2 flex gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white w-full"><i class="pi pi-plus text-sm custom-icon-sm"></i> Add Step</a>
        </div>

      </div>
      <Dialog v-model:visible="processManagerStore.showAddActivity" :draggable="false" modal header="Add note or reminder" :style="{ width: '40vw' }" :class="'notes-dialog'" :breakpoints="{ '1199px': '75vw', '575px': '90vw' } ">
        <template #header>
          <div class="row m-0 p-0 pb-2">
            <div class="text-neutral-700 text-[1.5rem] font-bold font-['Roboto'] leading-loose w-100">Add new activity</div>
          </div>
        </template>
        <div class="mt-2">
          <span class="text-neutral-700 text-sm font-normal font-['Nunito'] leading-3 pb-2">Activity name</span>

          <a class="text-neutral-700 text-sm float-right text-green-3 font-normal font-['Nunito'] leading-3 pb-2" :class="{ 'text-red': processManagerStore.showInput}" @click.prevent="processManagerStore.toggleGuidanceNote()">{{ processManagerStore.guidanceNoteAction }}</a>

          <input v-model="processManagerStore.activity.name" type="text" class="form-control">
          <div class="input-validation-error" v-if="typeof processManagerStore.activityErrors?.name !== 'undefined'">
            <span v-for="(error, index) in processManagerStore.activityErrors?.name" :key="index" class="error invalid-feedback">{{ error }}</span>
          </div>
        </div>

        <div v-if="processManagerStore.showInput" class="mb-2">
          <span class="text-neutral-700 text-sm font-normal font-['Nunito'] leading-3 pb-2">Guidance note</span>
          <input v-model="processManagerStore.guidanceNote" type="text" class="form-control" placeholder="Enter your guidance note...">
        </div>

        <p class="mt-3 mb-1 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3 d-flex">Select activity type <i class="information ml-2 bg-sky-700"></i></p>
        <div class="btn-group btn-group-toggle w-100" data-toggle="buttons">
          <label class="btn btn-sm btn-default" :class="{ 'bg-gray-300': processManagerStore.getDynamicModelFieldTypeGroup === dynamicModelFieldTypeGroup.id }" @click="processManagerStore.setDynamicModelFieldTypeGroup(dynamicModelFieldTypeGroup.id)" v-for="(dynamicModelFieldTypeGroup, index) in processManagerStore.dynamicModelFieldTypeGroups" :key="index">
            <input type="radio" name="options" :id="'option_'+dynamicModelFieldTypeGroup.id" autocomplete="off"> {{ dynamicModelFieldTypeGroup.name }}
          </label>
        </div>
        <p class="mt-3 mb-1 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Select <span class="font-weight-bold">user input</span></p>
        <div class="btn-group btn-group-toggle w-100" data-toggle="buttons">
          <label class="btn btn-sm btn-default" :class="{ 'bg-gray-300': processManagerStore.getDynamicModelFieldType === dynamicModelFieldType.id }" @click="processManagerStore.setDynamicModelFieldType(dynamicModelFieldType.id)" v-for="(dynamicModelFieldType, at_index) in processManagerStore.getDynamicModelFieldTypeByDynamicModelFieldTypeGroup" :key="at_index">
            <input type="radio" name="options" :id="'option_'+dynamicModelFieldType.id" autocomplete="off"> {{ dynamicModelFieldType.name }}
          </label>
        </div>

        <div class="mt-3 mb-1">
          <p class="text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Add <span class="font-weight-bold"> input options</span></p>
          <div v-if="processManagerStore.getDynamicModelFieldTypeGroup === 2" class="w-100 mt-2 options-container">
            <div v-for="(option, index) in processManagerStore.activity.options" :key="index" class="option-tag">
              <span>{{ option }}</span>
              <i class="pi pi-times-circle" @click="processManagerStore.removeOption(processManagerStore.activity.options, index)"></i>
            </div>
            <div class="flex-1">
              <input
                  type="text"
                  class="options-input m-0 w-full border-0 rounded-custom-10 h-9"
                  v-model="processManagerStore.activityOptionInput"
                  @keyup.enter="processManagerStore.addOption(processManagerStore.activity.options)"
                  placeholder="Type an option and press Enter"
              />
            </div>
          </div>
          <div class="input-validation-error" v-if="typeof processManagerStore.activityErrors?.options !== 'undefined'">
            <span v-for="(error, index) in processManagerStore.activityErrors?.options" :key="index" class="error invalid-feedback">{{ error }}</span>
          </div>
        </div>

        <template #footer>
          <div class="row">
            <div class="col-12 p-4 pr-0">
              <button class="gap-2 justify-center py-2 px-4 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 text-neutral-700 hover:bg-neutral-700 hover:text-white mr-2" @click="processManagerStore.showAddActivity = false">Cancel</button>
              <negotium-button v-if="!processManagerStore.loading"  @click="processManagerStore.createActivity(toast)" :value="'Save'"></negotium-button>
              <button v-if="processManagerStore.loading"  class="px-4 py-2 bg-neutral-700 rounded-custom-25 border border-neutral-700 justify-center items-center text-white" disabled><i class="pi pi-spin pi-spinner"></i> Loading ...</button>
            </div>
          </div>
        </template>
      </Dialog>
    </div>
  </AuthenticatedLayout>
  <Toast position="top-center">
    <template #message="slotProps">
        <div class="flex flex-column align-items-start" style="flex: 1">
            <div class="font-medium text-sm my-1 text-900">{{ slotProps.message.detail }}</div>
        </div>
    </template>
  </Toast>
  <ConfirmDialog></ConfirmDialog>
</template>

<style scoped>
.options-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border: 1px solid #ccc;
  padding: 0px;
  border-radius: 4px;
}

.option-tag {
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
  background-color: #e0f7fa;
  padding: 4px 8px;
  border-radius: 9px;
  height: 25px;
}

.option-tag .pi {
  margin-left: 4px;
  cursor: pointer;
}

.option-tag:hover {
  background-color: #b2ebf2;
}

.options-input {
  border: none;
  outline: none;
  flex-grow: 1;
  padding: 4px;
}

.options-input::placeholder {
  color: #ccc;
}

.options-input:focus {
  outline: none;
  border-color: transparent;
  border: none;
}
</style>