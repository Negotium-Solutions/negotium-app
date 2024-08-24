import { defineStore } from 'pinia';
import axios from "axios";
import { ApiHelper, FunctionsHelper } from "@/helpers/index.js";
import { usePage } from "@inertiajs/vue3";
import { computed } from "vue";

const page = usePage();
const user = computed(() => page.props.auth.user);
const messages = computed(() => page.props.messages);
const apiURL = computed(() => page.props.negotium_api_url);

export const useProfileDetailStore = defineStore({
    id: 'profile-profile-details',
    state: () => ({
        profileDetails: null,
        profileDetailsFields: null,
        loading: false,
        status: {
            loading: false
        },
        apiUrl: apiURL.value,
        user: user.value,
        tenant: user.value.tenant,
        end_point: 'document',
        lookup: {
        },
        response: {
            'code': 0,
            'status': '',
            'message': '',
            'errors': [],
            'data': []
        },
        apiHelper: new ApiHelper('document')
    }),
    actions: {
        set(key, value) {
            this.$state[key] = value;
        },
        get(key) {
            return this.$state[key];
        },
        setLookUp(key, value) {
            this.$state['lookup'][key] = value;
        },
        resetResponse() {
            this.response = {
                'status': '',
                'message': '',
                'errors': [],
                'data': []
            }
        },
        setResponse(code, status, message, errors, data) {
            this.response = {
                'code': code,
                'status': status,
                'message': message,
                'errors': errors,
                'data': data
            }
        }
    },
    getters: {

    }
});