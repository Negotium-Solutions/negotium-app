<script setup>
import {AuthenticatedLayout, BreadcrumbHeader} from '@/Layouts/Negotium';
import {computed, onMounted, reactive, ref} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useDocumentsStore } from "@/stores";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import {usePage} from "@inertiajs/vue3";

const toast = useToast();
const page = usePage();

const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);
const useDocumentStore = useDocumentsStore();
useDocumentsStore().init(negotium_api_url, user.value);

const props = defineProps({
  documents: Array
});

const pageProps = reactive( {
  documents: Array,
  isLoaded: false
});

onMounted(() => {
  pageProps.documents = props.documents;
  console.log('pageProps.documents.length', pageProps.documents.length);
  console.log('pageProps.documents', pageProps.documents);
  pageProps.isLoaded = true;
});

const breadcrumbs_items = ref([{'label': 'Documents'}]);

const confirm = useConfirm();

function deleteDocument(id) {
  let _id = id;
  confirm.require({
    message: 'Are you sure you want to delete this document?',
    header: 'Danger Zone',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      const response = useDocumentStore.delete(_id);
      response.then((result) => {
        if (result.status === 204) {
          toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Document deleted successfully', life: 3000 });
          let reload_response = useDocumentsStore().fetchDocuments();
          reload_response.then((_result) => {
            console.log('_result', _result);
          })
        }
      });
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Cancelled', detail: 'Delete action cancelled', life: 3000 });
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

      <DataTable v-if="pageProps.isLoaded" :value="pageProps.documents" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
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