<script setup>
import {AuthenticatedLayout, BreadcrumbHeader} from '@/Layouts/Negotium';
import {onMounted, reactive, ref} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useDocumentsStore } from "@/stores";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const useDocumentStore = useDocumentsStore();
defineProps({
  documents: Object
});

onMounted(() => {

});

const breadcrumbs_items = ref([{'label': 'Documents'}]);

const confirm = useConfirm();

function deleteDocument(id) {
  confirm.require({
    message: 'Are you sure you want to delete this document?',
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
}

</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <BreadcrumbHeader :name="'Documents'" :items="breadcrumbs_items" ></BreadcrumbHeader>
    </template>
    <div class="card">

      <DataTable :value="documents" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
        <Column field="name" header="Name" style="width: 25%"></Column>
        <Column field="type" header="Type" style="width: 25%"></Column>
        <Column field="size" header="Size" style="width: 25%"></Column>
        <Column class="column-actions" header="Actions" style="text-align: right;">
          <template #body="{ data, frozenRow, index }">
            <Button class="p-button-secondary" type="button" :icon="'pi pi-pencil'" text size="small" @click="editDocument(data.id)" />
            <Button class="p-button-secondary" type="button" :icon="'pi pi-times'" text size="small" @click="deleteDocument(data.id)" />
          </template>
        </Column>
      </DataTable>
    </div>
  </AuthenticatedLayout>
  <Toast/>
</template>
<style>
.column-actions > .p-column-header-content {
  float: right;
}
</style>