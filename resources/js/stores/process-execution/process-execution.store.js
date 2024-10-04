import { defineStore } from 'pinia';
import axios from "axios";
import { ApiHelper, FunctionsHelper } from "@/helpers/index.js";
import { usePage } from "@inertiajs/vue3";
import { computed } from "vue";

const page = usePage();
const user = computed(() => page.props.auth.user);
const messages = computed(() => page.props.messages);
const apiURL = computed(() => page.props.negotium_api_url);

export const useProcessExecution = defineStore({
    id: 'process-execution',
    state: () => ({
        process: null,
        step: null,
        profile: null,
        profileProcessFieldsErrors: null,
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
        apiHelper: new ApiHelper('profile-execution')
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
        setStep(step_id) {
            this.process.steps.forEach((step, index) => {
                if (parseInt(step_id) === 0) {
                    this.step = this.process.steps[0];
                    return true;
                }

                if (step.id === parseInt(step_id)) {
                    this.step = step;
                    return true;
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
        async storeDynamicModel(toast) {
            this.apiHelper = new ApiHelper('dynamic-field')
            console.log('DynamicModel', this.process);

            this.loading = true;

            await this.apiHelper.updateFields(this.process, this.process.id);
            this.apiHelper.isDoneLoading(null, () => {
                let removeProcessVariables = {
                    'profileName': this.profile.profileName,
                    'processName': this.process.name
                };
                const response = this.apiHelper.response;

                switch (parseInt(response.code)) {
                    case 200:
                        toast.add({ severity: 'success', detail: FunctionsHelper.replaceTextVariables(messages.value.processes.success_profile_process_updated, removeProcessVariables), life: 3000 });
                        this.profileProcessFieldsErrors = null;

                        setTimeout(() => {
                            const currentUrl = window.location.href;
                            const partToRemove = '/edit';
                            const index = currentUrl.indexOf(partToRemove);
                            window.location.href = '/profile/0/processes';
                        }, 3000)
                        break;
                    case 422:
                        this.profileProcessFieldsErrors = response.errors;
                        toast.add({ severity: 'error', detail: messages.value.error.input_validation_error, life: 3000 });
                        this.loading = false;
                        console.log('response.errors', response.errors);
                        break;
                    default:
                        this.profileProcessFieldsErrors = null;
                        toast.add({ severity: 'error', detail: response.message, life: 3000 });
                        this.loading = false;
                        break;
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