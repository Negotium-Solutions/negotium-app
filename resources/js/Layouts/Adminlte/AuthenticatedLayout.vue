<script setup>
import { Sidebar } from "@/Layouts/Adminlte";;
</script>

<template>
    <div>
        <div class="min-h-screen bg-gray-100">

            <div class="wrapper">
                <Sidebar></Sidebar>
                <!-- Page Content -->

                <!-- Content Wrapper. Contains page content -->
                <div class="content-wrapper">
                    <!-- Content Header (Page header) -->
                    <div class="content-header bg-white shadow" v-if="$slots.header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <slot name="header" />
                            </div><!-- /.row -->
                        </div><!-- /.container-fluid -->
                    </div>
                    <!-- /.content-header -->

                    <!-- Main content -->
                    <div class="content mt-5">
                        <div class="container-fluid mt-7">
                            <main>
                                <slot />
                            </main>
                        </div>
                        <!-- /.container-fluid -->
                    </div>
                    <!-- /.content -->
                </div>
                <!-- /.content-wrapper -->

                <!-- Main Footer -->
                <footer class="main-footer" v-if="false">
                    <strong>Copyright &copy; 2014-2021 <a href="https://adminlte.io">AdminLTE.io</a>.</strong>
                    All rights reserved.
                    <div class="float-right d-none d-sm-inline-block">
                        <b>Version</b> 3.2.0
                    </div>
                </footer>
            </div>
            <!-- ./wrapper -->
        </div>
    </div>
</template>
