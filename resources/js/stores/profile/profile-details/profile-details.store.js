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
        profile: null,
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
        apiHelper: new ApiHelper('profile')
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
        async storeDynamicModel(id, toast) {
            this.loading = true;
            let hasErrors = false; // Todo: Write a Form Helper to handle validation
            if (hasErrors) {
                toast.add({ severity: 'error', detail: messages.value.error.input_validation_error, life: 3000 });
                this.loading = false;
                return false;
            }

            await this.apiHelper.update(this.profile, id);
            this.apiHelper.isDoneLoading(null, () => {
                let removeProcessVariables = {
                    'profileName': parseInt(this.profile.profile_type_id) === 1 ? this.profile.first_name + ' ' + this.profile.last_name : this.profile.company_name
                };
                const response = this.apiHelper.response;
                if (parseInt(response.code) === 200) {
                    toast.add({ severity: 'success', detail: FunctionsHelper.replaceTextVariables(messages.value.profile.success_profile_updated, removeProcessVariables), life: 3000 });
                    this.loading = false;
                }
            });
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