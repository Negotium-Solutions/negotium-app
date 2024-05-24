<script setup>
import { Sidebar } from "@/Layouts/Negotium";
import AppConfig from "@/Layouts/Negotium/layout/AppConfig.vue";
import AppTopbar from "@/Layouts/Negotium/layout/AppTopbar.vue";
import AppSidebar from "@/Layouts/Negotium/layout/AppSidebar.vue";
import AppFooter from "@/Layouts/Negotium/layout/AppFooter.vue";
import { computed } from "vue";
import { useLayout } from '@/Layouts/Negotium/layout/composables/layout';
import Toast from "primevue/toast";

const { layoutConfig, layoutState, isSidebarActive } = useLayout();

const containerClass = computed(() => {
  return {
    'layout-theme-light': layoutConfig.darkTheme.value === 'light',
    'layout-theme-dark': layoutConfig.darkTheme.value === 'dark',
    'layout-overlay': layoutConfig.menuMode.value === 'overlay',
    'layout-static': layoutConfig.menuMode.value === 'static',
    'layout-static-inactive': layoutState.staticMenuDesktopInactive.value && layoutConfig.menuMode.value === 'static',
    'layout-overlay-active': layoutState.overlayMenuActive.value,
    'layout-mobile-active': layoutState.staticMenuMobileActive.value,
    'p-ripple-disabled': layoutConfig.ripple.value === false
  };
});
</script>

<template>
  <div class="layout-wrapper static" :class="containerClass">
    <app-topbar></app-topbar>
    <div class="layout-sidebar">
      <app-sidebar></app-sidebar>
    </div>
    <div class="layout-main-container">
      <div class="layout-main">
        Testing 123, this is the main content
      </div>
      <app-footer></app-footer>
    </div>
    <app-config></app-config>
    <div class="layout-mask"></div>
  </div>
  <Toast />
</template>
