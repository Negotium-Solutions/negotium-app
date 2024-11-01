import { defineStore } from 'pinia';
import axios from "axios";
import { ApiHelper, FunctionsHelper } from "@/helpers/index.js";
import { usePage } from "@inertiajs/vue3";
import { computed } from "vue";

const page = usePage();
const user = computed(() => page.props.auth.user);
const messages = computed(() => page.props.messages);
const apiURL = computed(() => page.props.negotium_api_url);

export const useProcesStatusReportStore = defineStore({
    id: 'processStatusReportStore',
    state: () => ({
        apiUrl: apiURL.value,
        apiImagesUrl: null,
        user: user.value,
        tenant: user.value.tenant,
        end_point: 'document',
        apiHelper: new ApiHelper('process-status')
    }),
    actions: {
        barColor(num) {
            let color = '';

            switch (true) {
                case (num < 30):
                    color = 'bg-danger-500';
                    break;
                case (num >= 30 && num < 70):
                    color = 'bg-warning-500';
                    break;
                case (num >= 70 && num <= 100):
                    color = 'bg-success-500';
                    break;
                default:
                    color = ''; // Optionally handle values outside 0-100
            }

            return color;
        },
        toggleChildren(parentId) {
            const parent = document.getElementById(`parent_${parentId}`)
            const childRows = document.querySelectorAll(`.child-of-${parentId}`);

            if(parent.classList.contains('pi-chevron-down')){
                parent.classList.remove('pi-chevron-down')
                parent.classList.add('pi-chevron-up')
            } else {
                parent.classList.add('pi-chevron-down')
                parent.classList.remove('pi-chevron-up')
            }
            childRows.forEach(row => {
                row.style.display = row.style.display === 'none' ? 'table-row' : 'none';
            });
        }
    },
    getters: {
    }
});