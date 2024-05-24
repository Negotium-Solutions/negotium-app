<script setup>
import { Sidebar, BreadcrumbHeader } from "@/Layouts/Negotium";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import { ref, onMounted, reactive } from "vue";
import Button from "primevue/button";

import { useToast } from "primevue/usetoast";
const toast = useToast();

const items = ref([
  {
    label: 'Create',
    icon: 'pi pi-briefcase',
    route: '/unstyled'
  },
  {
    label: 'Dashboard',
    icon: 'pi pi-desktop',
    route: '/unstyled'
  },
  {
    label: 'Profiles',
    icon: 'pi pi-users',
    route: '/unstyled'
  },
  {
    label: 'Processes',
    icon: 'pi pi-share-alt',
    url: 'https://vuejs.org/'
  },
  {
    separator: true
  },
  {
    label: 'Workboard',
    icon: 'pi pi-clone',
    url: 'https://vuejs.org/'
  },
  {
    label: 'Documents',
    icon: 'pi pi-folder',
    url: 'https://vuejs.org/'
  },
  {
    label: 'Reports',
    icon: 'pi pi-chart-line',
    url: 'https://vuejs.org/'
  },
  {
    separator: true
  },
  {
    label: 'Admin',
    icon: 'pi pi-home',
    url: 'https://vuejs.org/'
  },
  {
    label: 'Help & Support',
    icon: 'pi pi-directions',
    url: 'https://vuejs.org/'
  },
  {
    class: 'bottom-menus',
    label: 'Notifications',
    icon: 'pi pi-bell',
    url: 'https://vuejs.org/'
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    url: 'https://vuejs.org/'
  },
  {
    label: 'Profile',
    icon: 'pi pi-user',
    url: 'https://vuejs.org/'
  }
]);

const pageProps = reactive({
  pageHeight: false
});

onMounted(() => {
  getPageHeight();
});

function getPageHeight() {
  const body = document.body;
  const html = document.documentElement;
  const height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

  pageProps.pageHeight = height;
}
</script>

<template>
  <div class="layout-wrapper grid grid-nogutter">
    <Sidebar></Sidebar>
    <div class="main-container col-10">
      <div class="header-content col-12 pl-5 pr-5" v-if="$slots.header">
        <slot name="header" />
      </div>
      <div class="main-content col-12 p-5" :style="'height: '+(pageProps.pageHeight - 120)+'px;'">

        <!-- Page Content -->
        <main>
          <slot />
        </main>

      </div>
    </div>
  </div>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
</template>
<style>
.header-content {
  height: 120px;
}

.main-content {
  background-color: #DADADA;
}
</style>