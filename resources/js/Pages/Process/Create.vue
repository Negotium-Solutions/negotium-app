<script setup>

import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import { onMounted, reactive, ref } from "vue";
import Breadcrumb from 'primevue/breadcrumb';
import Dropdown from 'primevue/dropdown';

const props = defineProps({
  categories: Array,
  selectedCategory: String
});

const pageProps = reactive({
  selectedCategory: 0,
  categories: [],
  addCategoryOption: {
    id: 0,
    name: 'Create new category'
  }
});

onMounted(() => {
  // pageProps.categories.push(pageProps.addCategoryOption);
  props.categories.forEach((category) => {
    pageProps.categories.push(category);
  });
});

function clickCategory() {

}
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <div class="col-sm-6">
        <h1 class="m-0">Processes</h1>
        <ol class="breadcrumb sm">
          <li class="breadcrumb-item"><a href="#">Home</a></li>
          <li class="breadcrumb-item active">Processes</li>
        </ol>
      </div><!-- /.col -->
      <div class="col-sm-6 text-right pt-3">
        <a :href="route('process.create')" class="btn btn-sm btn-default w-24 mr-2">Cancel</a>
        <a :href="route('process.create')" class="btn btn-sm btn-dark w-24">Save</a>
      </div><!-- /.col -->
    </template>

    <div class="content-container pl-4 pr-4">

      <div class="row justify-content-md-center">
        <div class="col-md-4 col-sm-12 pr-0">
          <div class="card card-default">
            <div class="card-header">
              <h3 class="card-title text-bold">Process Info</h3>
            </div>
            <!-- /.card-header -->
            <!-- form start -->
            <form class="form-horizontal">
              <div class="card-body">
                <div class="form-group">
                  <label for="process-name" class="font-weight-normal">Process name</label>
                  <input type="text" class="form-control form-control-md rounded" id="process-name" placeholder="What do you want to call this process?">
                </div>

                <div class="form-group">
                  <label for="category" class="font-weight-normal">Category</label>
                  <Dropdown @click="clickCategory()" v-model="pageProps.selectedCategory" :options="pageProps.categories" filter optionLabel="category" placeholder="Select a category" class="w-full md:w-14rem border">
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
                        <span>{{ slotProps.option.name }}</span>
                        <i class="fa fa-square float-right" :style="'color: '+slotProps.option.color"></i>
                      </div>
                    </template>
                  </Dropdown>
                </div>
              </div>
              <!-- /.card-body -->
            </form>
          </div>
        </div>
        <div class="col-md-1 col-sm-12 pl-0 pr-0 place-items-center md:mt-12 md:pt-12 pr-0" style="vertical-align: middle;">
          <hr class="border-bottom bg-olive ml-0 mr-0 md:mt-9" />
        </div>
        <div class="col-md-2 col-sm-12 md:mt-12 md:pt-12 pl-0">
          <div class="btn-group-vertical btn-block">
            <button type="button" class="btn bg-olive btn-block active">Start</button>
            <button type="button" class="btn bg-olive btn-block">Create Step</button>
          </div>
        </div>
      </div>

    </div>
  </AuthenticatedLayout>
</template>

<style scoped>
.p-dropdown-empty-message {
  height: 100px;
}

/* p-dropdown-empty-message btn-md border btn-primary mt-3 m-2 */
</style>