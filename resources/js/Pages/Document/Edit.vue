<script setup>
import { AuthenticatedLayout } from '@/Layouts/Adminlte';
import axios from "axios";
import {computed, reactive, onUnmounted, onMounted} from 'vue';
import { usePage, router } from '@inertiajs/vue3';
import { useToastr } from '../../toastr.js';

const page = usePage();
const user = computed(() => page.props.auth.user);

const props = defineProps({
  doc: Object
});

const form = reactive({
  name: props.doc.name,
  file: '',
  errors: []
});

const toastr = useToastr();

onMounted(() => {
  // console.log(props.document);
});

function save() {
  resetForm();
  const formData = new FormData();
  formData.append('name', form.name);
  formData.append('file', form.file);
  axios.post('http://localhost/api/'+page.props.auth.user.tenant+'/document/update/'+props.doc.id, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ` + page.props.auth.user.token,
    },
  }).then((response) => {
    console.log(response);
    if (response.data.code === 200) {
      router.get('/document');
      toastr.success(response.data.message);
    }
  })
  .catch( (error) => {
    if (error.response.status === 422) {
      toastr.error(error.response.data.message);
      form.errors = error.response.data.errors;
    } else {
      toastr.error(error.response.status+': '+error.response.statusText);
    }
  });
}

function resetForm() {
  form.errors = [];
}
</script>

<template>
    <AuthenticatedLayout>
        <template #header>
          <div class="col-sm-6">
            <h1 class="m-0">Update Document</h1>
            <ol class="breadcrumb sm">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">Documents</li>
              <li class="breadcrumb-item active">Upload Document</li>
            </ol>
          </div><!-- /.col -->
          <div class="col-sm-6 text-right pt-2">
            <a :href="route('document')" class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 bg-white text-neutral-700 cursor-pointer mr-2">Back</a>
              <a v-on:click="save" class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 bg-neutral-700 text-white cursor-pointer">Save</a>
          </div><!-- /.col -->
        </template>

        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <!-- /.card-header -->
              <div class="card-body">
                <form @submit.prevent="save">
                  <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" v-model="form.name" :class="{'is-invalid': (typeof form.errors['name'] !== 'undefined')}" class="form-control" id="name" placeholder="Filename" required>
                    <span v-for="(error, index) in form.errors['name']" :id="'name-error-'+index" class="error invalid-feedback">{{ error }}</span>
                  </div>
                  <div class="form-group">
                    <label for="file">File</label>
                    <div class="input-group">
                      <div class="custom-file">
                        <input type="file" @input="form.file = $event.target.files[0]" :class="{'is-invalid': (typeof form.errors['file'] !== 'undefined')}" class="custom-file-input" id="file" required>
                        <label class="custom-file-label" for="file">Choose file</label>
                      </div>
                    </div>
                    <span v-for="(error, index) in form.errors['file']" :id="'file-error-'+index" class="error invalid-feedback">{{ error }}</span>
                    <progress v-if="form.progress" :value="form.progress.percentage" max="100">
                      {{ form.progress.percentage }}%
                    </progress>
                  </div>
                  <!-- /.card-body -->
                </form>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>
          </div>
        <!-- /.row -->

    </AuthenticatedLayout>
</template>