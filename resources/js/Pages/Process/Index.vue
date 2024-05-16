<script setup>
import { AuthenticatedLayout } from '@/Layouts/Adminlte'
import axios from 'axios';
import {router, usePage} from '@inertiajs/vue3';
import { computed } from "vue";
import { useToastr } from "@/toastr.js";

defineProps({
  processes: {
    type: Array,
  }
});

const toastr = useToastr();
const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);

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
          <div class="col-sm-6 text-right pt-2">
              <a :href="route('document.create')" class="btn btn-sm btn-dark">Add Process</a>
          </div><!-- /.col -->
        </template>

        <div class="row">
              <div class="col-lg-12">

                <div class="card">
                  <!-- /.card-header -->
                  <div class="card-body">
                    
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