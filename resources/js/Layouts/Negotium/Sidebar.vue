<script setup>
import Menu from 'primevue/menu';
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputText from "primevue/inputtext";
import { onMounted, reactive, ref } from "vue";

const pageProps = reactive({
  pageHeight: false
});

onMounted(() => {
  getPageHeight();
});

function getPageHeight() {
  const body = document.body;
  const html = document.documentElement;

  const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
  );

  pageProps.pageHeight = height;
}

const items = ref([

  {
    label: 'Create',
    icon: 'pi pi-briefcase',
    route: ''
  },
  {
    label: 'Dashboard',
    icon: 'pi pi-desktop',
    route: '/dashboard'
  },
  {
    label: 'Profiles',
    icon: 'pi pi-users',
    route: ''
  },
  {
    label: 'Processes',
    icon: 'pi pi-share-alt',
    route: ''
  },
  {
    separator: true
  },
  {
    label: 'Workboard',
    icon: 'pi pi-clone',
    route: ''
  },
  {
    label: 'Documents',
    icon: 'pi pi-folder',
    route: '/document'
  },
  {
    label: 'Reports',
    icon: 'pi pi-chart-line',
    route: ''
  },
  {
    separator: true
  },
  {
    label: 'Admin',
    icon: 'pi pi-home',
    route: ''
  },
  {
    label: 'Help & Support',
    icon: 'pi pi-directions',
    url: ''
  },
  {
    label: 'Notifications',
    icon: 'pi pi-bell',
    url: '',
    class: 'bottom-menus'
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    url: ''
  },
  {
    label: 'Profile',
    icon: 'pi pi-user',
    url: ''
  }
]);
</script>
<template>
  <div class="sidebar col-2 pl-5 pr-5" :style="'color: #1C232E; border-right: 1px solid grey; height: '+pageProps.pageHeight+'px;'">
    <div class="mb-5 mt-3 pl-3 negotium-logo">
      Negotium
    </div>
    <InputGroup class="pl-3 pr-2">
      <InputGroupAddon>
        <i class="pi pi-search"></i>
      </InputGroupAddon>
      <InputText placeholder="Search" />
    </InputGroup>
    <Menu :model="items" class="sidebar-menu">
      <template #item="{ item, props }">
        <a :href="item.route" v-bind="props.action">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </template>
    </Menu>
  </div>
</template>
<style>
  .sidebar-menu {
    border: none !important;
  }

  .negotium-logo {
    font-family: Young Serif;
    font-size: 35px;
    font-weight: 400;
    line-height: 44px;
    text-align: left;
  }

  .bottom-menus {
    margin-top: 50px;
  }
</style>