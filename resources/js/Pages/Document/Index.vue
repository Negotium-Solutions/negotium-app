<script setup>
import { AuthenticatedLayout } from '@/Layouts/Adminlte'
import "../../../../public/adminlte/plugins/datatables/jquery.dataTables.min.js";
import "../../../../public/adminlte/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js";
import "../../../../public/adminlte/plugins/datatables-responsive/js/dataTables.responsive.min.js";
import "../../../../public/adminlte/plugins/datatables-responsive/js/responsive.bootstrap4.min.js";
import axios from 'axios';
import "../../../../public/adminlte/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css";
import "../../../../public/adminlte/plugins/datatables-responsive/css/responsive.bootstrap4.min.css";

defineProps({
  documents: {
    type: Array,
  }
});

$(function () {
  $("#documents-table").DataTable({
    "responsive": true, "lengthChange": false, "autoWidth": false, "searching": false,
  });
});
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
              <a :href="route('document.create')" class="btn btn-sm btn-dark">Add Document</a>
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
                            <button class="btn btn-sm"><i class="fa fa-edit"></i></button>
                            <button class="btn btn-sm"><i class="fa fa-trash"></i></button>
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

</style>