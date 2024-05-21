<script setup>
import { Link } from '@inertiajs/vue3';
import DropdownLink from "@/Components/DropdownLink.vue";
import NavLink from "@/Components/NavLink.vue";
</script>

<template>
  <!-- Main Sidebar Container -->
  <aside class="main-sidebar sidebar-light-dark elevation-4">
    <!-- Brand Logo -->
    <table class="brand-link-logo">
      <tr>
        <td>
          <a href="index3.html" class="brand-link" style="border-bottom: none;">
            <span class="brand-text font-weight-light">Negotium</span>
          </a>
        </td>
        <td v-if="false" class="text-right pr-2">
          <a data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
        </td>
      </tr>
    </table>
    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar user panel (optional) -->

      <!-- SidebarSearch Form -->
      <div class="form-inline mt-3">
        <div class="input-group" data-widget="sidebar-search">
          <input class="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search">
          <div class="input-group-append">
            <button class="btn btn-sidebar">
              <i class="fas fa-search fa-fw"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar Menu -->
        <nav id="sidebar-container" class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
          <li class="nav-item">
            <Link href="#" class="nav-link">
              <i class="nav-icon fas fa-briefcase"></i>
              <p>
                Create
              </p>
            </Link>
          </li>
          <li class="nav-item">
            <Link :href="route('dashboard')" :class="{ active: route().current('dashboard') || route().current('dashboard.create') || route().current('dashboard.edit') }" class="nav-link">
              <i class="nav-icon fas fa-tachometer-alt"></i>
              <p>
                Dashboard
              </p>
            </Link>
          </li>
          <li class="nav-item">
            <Link href="#" class="nav-link">
              <i class="nav-icon fas fa-users"></i>
              <p>
                Profiles
              </p>
            </Link>
          </li>
          <li class="nav-item">
            <Link href="#" class="nav-link">
              <i class="nav-icon fas fa-print"></i>
              <p>
                Processes
              </p>
            </Link>
          </li>
          <li class="nav-item mt-1 mr-3 mb-1 ml-3">
            <hr color="#c2c7d0"/>
          </li>
          <li class="nav-item">
            <Link href="#" class="nav-link">
              <i class="nav-icon fas fa-chart-bar"></i>
              <p>
                Workboard
              </p>
            </Link>
          </li>
          <li class="nav-item">
            <a :href="route('document')" :class="{ active: route().current('document') }" class="nav-link">
              <i class="nav-icon fas fa-file"></i>
              <p>
                Documents
              </p>
            </a>
          </li>
          <li class="nav-item">
            <Link href="#" class="nav-link">
              <i class="nav-icon fas fa-chart-line"></i>
              <p>
                Reports
              </p>
            </Link>
          </li>
          <li class="nav-item mt-1 mr-3 mb-1 ml-3">
            <hr color="#c2c7d0"/>
          </li>
          <li class="nav-item">
            <Link href="#" class="nav-link">
              <i class="nav-icon fas fa-chart-bar"></i>
              <p>
                Admin
              </p>
            </Link>
          </li>
          <li class="nav-item">
            <Link :href="route('profile-manager')" class="nav-link">
              <i class="nav-icon fas fa-user-cog"></i>
              <p>
                Profile Manager
              </p>
            </Link>
          </li>
          <li class="nav-item">
            <Link href="#" class="nav-link">
              <i class="nav-icon fas fa-file"></i>
              <p>
                Help & Support
              </p>
            </Link>
          </li>

        </ul>

        <ul id="sidebar-profiles" class="nav nav-pills nav-sidebar flex-column mt-12" data-widget="treeview" role="menu" data-accordion="false" >
          <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
          <li class="nav-item">
            <Link href="#" class="nav-link">
              <i class="nav-icon fas fa-briefcase"></i>
              <p>
                Notifications
              </p>
            </Link>
          </li>
          <li class="nav-item">
            <Link href="#" class="nav-link">
              <i class="nav-icon fas fa-tachometer-alt"></i>
              <p>
                Settings
              </p>
            </Link>
          </li>
          <li class="nav-item">
            <Link :href="route('profile.edit')" class="nav-link">
              <i class="nav-icon fas fa-users"></i>
              <p>
                Profile
              </p>
            </Link>
          </li>
          <li class="nav-item">
              <Link :href="route('logout')" method="post" class="nav-link">
                <i class="nav-icon fas fa-user-astronaut"></i>
                <p>
                  Logout
                </p>
              </Link>
          </li>
        </ul>

      </nav>
      <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
  </aside>
</template>
<style scoped>
  .brand-link-logo {
    border-bottom: 1px solid #4b545c;
    border-style: solid;
    color: #e5e7eb;
    width: 100%;
  }
</style>