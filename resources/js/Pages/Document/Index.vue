<script setup>
import { AuthenticatedLayout } from '@/Layouts/Adminlte'
import "../../../../public/adminlte/plugins/datatables/jquery.dataTables.min.js";
import "../../../../public/adminlte/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js";
import "../../../../public/adminlte/plugins/datatables-responsive/js/dataTables.responsive.min.js";
import "../../../../public/adminlte/plugins/datatables-responsive/js/responsive.bootstrap4.min.js";
import "../../../../public/adminlte/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css";
import "../../../../public/adminlte/plugins/datatables-responsive/css/responsive.bootstrap4.min.css";
import axios from 'axios';
import { router, usePage } from '@inertiajs/vue3';
import { computed } from "vue";
import { useToastr } from "@/toastr.js";

defineProps({
  documents: {
    type: Array,
  }
});

const toastr = useToastr();
const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);

$(function () {
  $("#documents-table").DataTable({
    "responsive": true, "lengthChange": false, "autoWidth": false, "searching": false,
  });
});

function deleteDocument(id) {
  axios.delete(negotium_api_url.value+'/'+user.value.tenant+'/document/delete/'+id, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ` + user.value.token,
    },
  }).then((response) => {
    console.log(response);
    if (response.status === 204) {
      toastr.success('Item successfully deleted.');
      router.get('/document');
    }
  })
  .catch( (error) => {
    toastr.error(error.response.status+': '+error.response.statusText);
  });
}
</script>

<template>
    <AuthenticatedLayout>
        <template #header>
          <div class="col-sm-6">
            <h1 class="m-0">Documents</h1>
            <ol class="breadcrumb sm">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">Documents</li>
            </ol>
          </div><!-- /.col -->
          <div class="col-sm-6 text-right pt-2">
              <a :href="route('document.create')" class="gap-2 justify-center py-2.5 px-3 text-sm leading-3 rounded-custom-25 border border-solid border-neutral-700 border-opacity-20 bg-neutral-700 text-white cursor-pointer">Add Document</a>
          </div><!-- /.col -->
        </template>

        <div class="row">
              <div class="col-lg-12">

                <div class="card">
                  <!-- /.card-header -->
                  <div class="card-body">
                    <table id="documents-table" class="table table-bordered table-striped">
                      <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Size</th>
                        <th>Uploader</th>
                        <th class="text-right">Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                        <tr v-for="document in documents">
                          <td>{{ document.name }}</td>
                          <td>{{ document.type }}</td>
                          <td>{{ document.size / 1000 }}KB</td>
                          <td>{{ document.user !== null ? document.user.first_name : '' }} {{ document.user !== null ? document.user.last_name : '' }}</td>
                          <td class="text-right">
                            <a :href="route('document.edit', document.id)" class="btn btn-sm btn-edit"><i class="fa fa-edit"></i></a>
                            <a v-on:click="deleteDocument(document.id)" class="btn btn-sm btn-delete"><i class="fa fa-trash"></i></a>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Size</th>
                          <th>Uploader</th>
                          <th class="text-right">Actions</th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <!-- /.card-body -->
                </div>
                <!-- /.card -->

              </div>
          </div>
        <!-- /.row -->
    </AuthenticatedLayout>
</template>
<style>
  .btn-edit {
    color: lawngreen;
  }

  .btn-delete {
    color: orangered;
  }
</style>