<script setup>
import { useActivitiesStore, useProcessesStore, useStepsStore } from "@/stores";
import { onMounted } from "vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";

const activityStore = useActivitiesStore();
const processStore = useProcessesStore();
const stepStore = useStepsStore();
const toast = useToast();
const confirm = useConfirm();

const props = defineProps({

});

onMounted(() => {

});

function deleteActivity(activity) {
  confirm.require({
    message: 'Are you sure you want to delete this activity?',
    header: 'Warning',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'btn-sm btn-outline-light border',
    acceptClass: 'btn-sm btn-danger',
    accept: async () => {
      const response = await activityStore.delete(activity);
      console.log('response.code', response.code);
      console.log('response', response);
      if (response.code == 204) {
        toast.add({severity: response.status, summary: 'Success', detail: 'Activity deleted successfully', life: 3000});
      } else {
        toast.add({severity: response.status, summary: 'Error', detail: response.message, life: 3000});
      }
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'Operation cancelled', life: 3000 });
    }
  });
}
</script>

<template>
  <div class="col-md-2 col-sm-12 pr-0">
    <div class="card card-default">
      <div class="card-header border-bottom-0 pb-0">
        <div class="text-neutral-700 text-[1.25rem] font-bold font-['Roboto'] leading-loose">Activities</div>
      </div>
      <!-- /.card-header -->
      <div class="card-body">
        <div class="mb-3" v-for="(activity, index) in processStore.getStep(stepStore.step.id).activities" :key="index">
          <div class="opacity-50 text-neutral-700 text-xs font-normal font-['Nunito'] leading-3">Title & Description</div>
          <p class="mt-1 text-sm font-medium font-['Roboto'] leading-tight text-bold mb-2">
            {{ activity.label }}
            <button type="button" class="float-right" @click="deleteActivity(activity)"><i class="pi pi-times"></i></button>
          </p>
          <hr/>
        </div>
      </div>
      <!-- /.card-body -->
    </div>
  </div>
  <Toast/>
  <ConfirmDialog></ConfirmDialog>
</template>