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
        report: null,
        loading: false,
        apiUrl: apiURL.value,
        apiImagesUrl: null,
        user: user.value,
        tenant: user.value.tenant,
        end_point: 'document',
        apiHelper: new ApiHelper('process-status')
    }),
    actions: {

    },
    getters: {
    }
});