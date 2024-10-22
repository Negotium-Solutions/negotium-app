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
        saveStepLoading: false,
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
            this.process.groups.forEach((step, index) => {
                if (parseInt(step_id) === 0) {
                    this.step = this.process.groups[0];
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
        handleInnerContentDivHeight(){
            let windowHeight = window.innerHeight,
                innerContent = document.getElementById('inner-content'),
                processExecutionHeader = document.getElementById('process-execution-header'),
                processExecutionContent = document.getElementById('process-execution-content'),
                processExecutionSteps = document.getElementById('process-execution-steps'),
                processExecutionButtons = document.getElementById('process-execution-buttons');

            if (innerContent) {
                innerContent.style.minHeight = (windowHeight - processExecutionHeader.offsetHeight) + 'px';
                innerContent.style.height = (windowHeight - processExecutionHeader.offsetHeight) + 'px';
                innerContent.style.maxHeight = (windowHeight - processExecutionHeader.offsetHeight) + 'px';
            }

            if (processExecutionContent) {
                processExecutionContent.style.minHeight = (windowHeight - processExecutionHeader.offsetHeight)+'px';
            }

            if(processExecutionSteps){
                processExecutionSteps.style.minHeight = ((windowHeight - processExecutionHeader.offsetHeight) - processExecutionButtons.offsetHeight)+'px'
                processExecutionSteps.style.height = ((windowHeight - processExecutionHeader.offsetHeight) - processExecutionButtons.offsetHeight)+'px'
                processExecutionSteps.style.maxHeight = ((windowHeight - processExecutionHeader.offsetHeight) - processExecutionButtons.offsetHeight)+'px'
                processExecutionSteps.style.overflow = 'auto'
            }
        },
        async storeDynamicModel(toast, step = null, profile_type_id = null) {
            this.apiHelper = new ApiHelper('process-execution')
            console.log('DynamicModel', this.process);

            if (step !== null) {
                this.saveStepLoading = true;
            } else {
                this.loading = true;
            }

            await this.apiHelper.update(this.process);
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

                        if (step !== null && step.id > 0) {
                            setTimeout(() => {
                                let _step = this.getNextStep(step);
                                window.location.href = '/process-execution/'+this.profile.id+'/edit/'+this.process.id+'/'+_step.id+'?pt='+profile_type_id;
                            }, 3000);
                        } else {
                            setTimeout(() => {
                                const currentUrl = window.location.href;
                                const partToRemove = '/edit';
                                const index = currentUrl.indexOf(partToRemove);
                                window.location.href = '/profile/'+this.profile.id+'/processes?pt='+profile_type_id;
                            }, 3000);
                        }
                        break;
                    case 422:
                        this.profileProcessFieldsErrors = response.errors;
                        toast.add({ severity: 'error', detail: messages.value.error.input_validation_error, life: 3000 });
                        if (step !== null) {
                            this.saveStepLoading = false;
                        } else {
                            this.loading = false;
                        }
                        console.log('response.errors', response.errors);
                        break;
                    default:
                        this.profileProcessFieldsErrors = null;
                        toast.add({ severity: 'error', detail: response.message, life: 3000 });
                        if (step !== null) {
                            this.saveStepLoading = false;
                        } else {
                            this.loading = false;
                        }
                        break;
                }
            });
        },
        getNextStep(step) {
            let nextStep = step;
            this.process.groups.forEach((_step, index) => {
                if (step.id === _step.id) {
                    if ((index+1) <= (this.process.groups.length - 1)) {
                        nextStep = this.process.groups[index + 1];
                    }
                }
            });
            return nextStep;
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
        getNextStepId() {
            let nextStep = this.getNextStep(this.step);
            return nextStep.id;
        }
    }
});