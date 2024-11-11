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
        profileTypes: null,
        profile: null,
        dynamicModelFieldTypeGroup: null,
        createProfileErrors: null,
        profileDetailsFields: null,
        profileDetailsFieldsErrors: null,
        ProfileSections: null,
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
                    this.profileDetailsFieldsErrors = null;

                    setTimeout(() => {
                        const currentUrl = window.location.href;
                        const partToRemove = '/edit';
                        const index = currentUrl.indexOf(partToRemove);
                        window.location.href = currentUrl.slice(0, index) + currentUrl.slice(index + partToRemove.length);
                    }, 3000)
                }

                if (parseInt(response.code) === 422) {
                    this.profileDetailsFieldsErrors = response.errors;
                    toast.add({ severity: 'error', detail: messages.value.error.input_validation_error, life: 3000 });
                    this.loading = false;
                }
            });
        },
        async createProfile(toast) {
            this.apiHelper = new ApiHelper('profile');

            this.loading = true;

            await this.apiHelper.create(this.profile);
            this.apiHelper.isDoneLoading(null, () => {
                let placeholderVariables = {
                    'profileName': this.profile.name
                };
                const response = this.apiHelper.response;

                switch (parseInt(response.code)) {
                    case 201:
                        toast.add({ severity: 'success', detail: FunctionsHelper.replaceTextVariables(messages.value.profile_creator.create_profile_success, placeholderVariables), life: 3000 });
                        this.createProfileErrors = null;
                        setTimeout(() => {
                            window.location.href = '/profile/'+response.data.data.id+'/processes?s_id='+this.profile.id;
                            this.loading = false;
                        }, 3000);
                        break;
                    case 422:
                        this.createProfileErrors = response.errors;
                        toast.add({ severity: 'error', detail: messages.value.error.input_validation_error, life: 3000 });
                        this.loading = false;
                        break;
                    default:
                        this.createProfileErrors = null;
                        toast.add({ severity: 'error', detail: response.message, life: 3000 });
                        this.loading = false;
                        break;
                }
            });
        },
        isSet(key, value) {
            if ( this.$state[key] === null ) {
                return false;
            }

            if (this.$state[key].hasOwnProperty('id')) {
                return this.$state[key].id === value.id;
            }
            return false;
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