<script setup>
import { ref, onMounted } from 'vue';
import { Link } from '@inertiajs/vue3';

const csrfToken = ref('')
onMounted(() => {

  csrfToken.value = document.querySelector('meta[name="csrf-token"]').content
  handleProfileSidebarPosition()
  // Add a global event listener
  // for window resize
  window.addEventListener
  ('resize', handleProfileSidebarPosition);
})

function isProfileMenu()
{
  return route().current('profile.processes')
      || route().current('profile.profile-details')
      || route().current('profile.communications')
      || route().current('profile.documents')
      || route().current('profile.notes');
}

function handleProfileSidebarPosition(){
  const w = window.innerWidth;
  const h = window.innerHeight;

  if(h > 800){
    document.getElementById('sidebar-profiles').style.position = 'fixed';
    document.getElementById('sidebar-profiles').style.bottom = 0;
  } else {
    document.getElementById('sidebar-profiles').style.position = null;
    document.getElementById('sidebar-profiles').style.bottom = null;
  }

  if(w < 1360){
    document.getElementById('main-sidebar').style.marginLeft = "-250px"
    document.getElementById('main-container').style.marginLeft = "0px"
  } else {
    document.getElementById('main-sidebar').style.marginLeft = null
    document.getElementById('main-container').style.marginLeft = "250px"
  }
}
</script>

<template>
  <!-- Main Sidebar Container -->
  <aside id="main-sidebar" class="main-sidebar sidebar-light-dark elevation-4 fixed inset-0" style="position:fixed;">
    <!-- Brand Logo -->
    <table class="brand-link-logo border-b border-transparent my-3">
      <tr>
        <td>
          <a href="/" class="brand-link text-center border-b border-transparent">
            <span class="text-4xl font-bold font-['Young+Serif'] w-full">Negotium</span>
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
      <div class="mt-2 mb-3 text-center">
        <a href="javascript:void(0)" class="create-btn px-4 py-2 border rounded-custom-25 justify-center items-center">Create</a>
      </div>

      <!-- Sidebar Menu -->
        <nav id="sidebar-container" class="flex flex-col pt-3">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
          <li class="nav-item">
            <a href="#" class="nav-link d-flex">          
              <i class="nav-icon sidemenu-admin"></i>
              <span class="ml-2 text-sm font-normal font-['Roboto'] leading-normal">Create</span>
            </a>
          </li>
          <li class="nav-item">
            <a :href="route('dashboard')" :class="{ active: route().current('dashboard') || route().current('dashboard.create') || route().current('dashboard.edit') }" class="nav-link d-flex align-self-center">          
              <i class="nav-icon sidemenu-dashboard"></i>
              <span class="ml-2 text-sm font-normal font-['Roboto'] leading-normal">Dashboard</span>
            </a>
          </li>
          <li class="nav-item">
            <a :href="route('profile.processes', {'id': 0})" :class="{ active: isProfileMenu() }" class="nav-link d-flex align-self-center">
              <i class="nav-icon sidemenu-profiles"></i>
              <span class="ml-2 text-sm font-normal font-['Roboto'] leading-normal">Profiles</span>
            </a>
          </li>
          <li class="nav-item">
            <a :class="{ active: route().current('process') }" class="nav-link d-flex align-self-center">
              <i class="nav-icon sidemenu-processes"></i>
              <span class="ml-2 text-sm font-normal font-['Roboto'] leading-normal">Processes</span>
            </a>
          </li>
          <li class="nav-item mt-1 mr-3 mb-1 ml-3">
            <hr class="h-0.5 opacity-10 bg-neutral-700 rounded-sm" />
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link d-flex align-self-center">          
              <i class="nav-icon sidemenu-workboard"></i>
              <span class="ml-2 text-sm font-normal font-['Roboto'] leading-normal">Workboard</span>
            </a>
          </li>
          <li class="nav-item">
            <a :href="route('document')" :class="{ active: route().current('document') }" class="nav-link d-flex align-self-center">          
              <i class="nav-icon sidemenu-documents"></i>
              <span class="ml-2 text-sm font-normal font-['Roboto'] leading-normal">Documents</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link d-flex align-self-center">          
              <i class="nav-icon sidemenu-reports"></i>
              <span class="ml-2 text-sm font-normal font-['Roboto'] leading-normal">Reports</span>
            </a>
          </li>
          <li class="nav-item mt-1 mr-3 mb-1 ml-3">
            <hr class="h-0.5 opacity-10 bg-neutral-700 rounded-sm" />
          </li>

          <li class="nav-item">
            <a :href="route('process-manager')" :class="{ active: route().current('process-manager') }" class="nav-link d-flex">
              <i class="nav-icon sidemenu-processes"></i>
              <span class="ml-2 text-sm font-normal font-['Roboto'] leading-normal">Process Creator</span>
            </a>
          </li>

          <li class="nav-item">
            <a  :href="route('profile-creation')" :class="{ active: route().current('profile-creation') }" class="nav-link d-flex">
              <i class="nav-icon custom-icon-sm sidemenu-profiles"></i>
              <span class="ml-2 text-sm font-normal font-['Roboto'] leading-normal">Profile Creator</span>
            </a>
          </li>

          <li class="nav-item">
            <a href="#" class="nav-link d-flex">
              <i class="nav-icon sidemenu-help"></i>
              <span class="ml-2 text-sm font-normal font-['Roboto'] leading-normal">Help & Support</span>
            </a>
          </li>

        </ul>

        <ul id="sidebar-profiles" class="nav nav-pills nav-sidebar flex-column mt-12" data-widget="treeview" role="menu" data-accordion="false" >
          <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
          <li class="nav-item">
            <a href="#" class="nav-link d-flex">          
              <i class="nav-icon sidemenu-notifications"></i>
              <span class="ml-2 text-sm font-normal font-['Roboto'] leading-normal">Notifications</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link d-flex">          
              <i class="nav-icon sidemenu-settings"></i>
              <span class="ml-2 text-sm font-normal font-['Roboto'] leading-normal">Settings</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link d-flex">          
              <i class="nav-icon sidemenu-profile"></i>
              <span class="ml-2 text-sm font-normal font-['Roboto'] leading-normal">Profile</span>
            </a>
          </li>
          <li class="nav-item">
            <Link :href="route('logout')" method="post" as="button" class="nav-link d-flex">
              <i class="nav-icon sidemenu-exit"></i>
              <span class="ml-2 text-sm font-normal font-['Roboto'] leading-normal">Logout</span>
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