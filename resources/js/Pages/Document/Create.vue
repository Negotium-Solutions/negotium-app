<script setup>
import { AuthenticatedLayout } from '@/Layouts/Adminlte';
import axios from "axios";
import { computed, reactive } from 'vue';
import { usePage } from '@inertiajs/vue3';

const page = usePage();
const user = computed(() => page.props.auth.user);

defineProps({
  api_url: String
});

const form = reactive({
  name: null,
  file: null
});

function save() {
  console.log('Name: ', form.name)
  console.log('File: ', form.file)
  console.log('User: ', user.tenant);
  console.log('User: ', page.props.auth.user);
  const formData = new FormData();
  formData.append('name', form.name);
  formData.append('file', form.file);
  try {
    axios.post(api_url+this.user.tenant+'/document/store', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization: bearer ': this.user.token,
      },
    }).then((respose) => {
      console.log(respose);
    })
    .catch(function (error) {
      console.log(error);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
</script>

<template>
    <AuthenticatedLayout>
        <template #header>
          <div class="col-sm-6">
            <h1 class="m-0">Upload Document</h1>
            <ol class="breadcrumb sm">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">Documents</li>
              <li class="breadcrumb-item active">Upload Document</li>
            </ol>
          </div><!-- /.col -->
          <div class="col-sm-6 text-right pt-2">
              <a :href="route('document')" class="btn btn-sm btn-cs-light mr-2">Back</a>
              <a v-on:click="save" class="btn btn-sm btn-cs-dark">Save</a>
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
                    <input type="text" v-model="form.name" class="form-control" id="name" placeholder="Filename" required>
                  </div>
                  <div class="form-group">
                    <label for="file">File</label>
                    <div class="input-group">
                      <div class="custom-file">
                        <input type="file" @input="form.file = $event.target.files[0]" class="custom-file-input" id="file" required>
                        <label class="custom-file-label" for="file">Choose file</label>
                      </div>
                    </div>
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