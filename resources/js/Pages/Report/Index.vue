<script setup>
import { AuthenticatedLayout } from '@/Layouts/Adminlte'
import axios from 'axios';
import {router, usePage} from '@inertiajs/vue3';
import { computed } from "vue";
import { useToastr } from "@/toastr.js";


const toastr = useToastr();
const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);

</script>

<template>
    <AuthenticatedLayout>
        <template #header>
          <div class="col-sm-6">
            <h1 class="m-0">Process status report</h1>
          </div><!-- /.col -->
          <div class="col-sm-6 text-right pt-2">
          </div><!-- /.col -->
        </template>

        <div class="row">
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