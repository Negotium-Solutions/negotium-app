<script setup>
import {AuthenticatedLayout, BreadcrumbHeader} from '@/Layouts/Negotium';
import {onMounted, reactive, ref} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useDocumentsStore } from "@/stores";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useConfirm } from "primevue/useconfirm";

const useDocumentStore = useDocumentsStore();
defineProps({
  documents: Object
});

onMounted(() => {

});

const breadcrumbs_items = ref([{'label': 'Documents'}]);

const confirm = useConfirm();
const confirm1 = () => {
  confirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    rejectLabel: 'Cancel',
    acceptLabel: 'Save',
    accept: () => {
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }
  });
};

const confirm2 = () => {
  confirm.require({
    message: 'Do you want to delete this record?',
    header: 'Danger Zone',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }
  });
};

</script>

<template>
    <AuthenticatedLayout>
      <template #header>
        <BreadcrumbHeader :name="'Documents'" :items="breadcrumbs_items" ></BreadcrumbHeader>
      </template>
      <div class="card">

        <DataTable :value="documents" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
          <Column field="name" header="Name" style="width: 25%"></Column>
          <Column field="type" header="Type" style="width: 25%"></Column>
          <Column field="size" header="Size" style="width: 25%"></Column>
          <Column field="representative.name" header="Actions" style="width: 25%"></Column>
        </DataTable>

      </div>

      <div class="card flex justify-content-center">
        <div class="card flex flex-wrap gap-2 justify-content-center">
          <Button @click="confirm1()" label="Save" outlined></Button>
          <Button @click="confirm2()" label="Delete" severity="danger" outlined></Button>
        </div>
      </div>
    </AuthenticatedLayout>
</template>
<style scoped>
</style>