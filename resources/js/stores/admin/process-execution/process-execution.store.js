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
        process_id: null,
        process_schema_id: null,
        profile_id: null,
        profile_schema_id: null,
        process_schema: null,
        step: null,
        profiles: null,
        profile: null,
        current_step: null,
        profileProcessFieldsErrors: null,
        loading: false,
        saveStepLoading: false,
        status: {
            loading: false
        },
        apiUrl: apiURL.value,
        apiImagesUrl: null,
        user: user.value,
        tenant: user.value.tenant,
        end_point: 'document',
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
        async storeStep(toast) {
            this.apiHelper = new ApiHelper('process-execution')
            this.step.process_id = this.process_id;
            console.log('Step: ', this.step);

            await this.apiHelper.update(this.step);
            this.apiHelper.isDoneLoading(null, () => {
                let removeProcessVariables = {
                    'profileName': this.profile.profileName,
                    'processName': this.process_schema.name
                };
                const response = this.apiHelper.response;

                switch (parseInt(response.code)) {
                    case 200:
                        toast.add({ severity: 'success', detail: FunctionsHelper.replaceTextVariables(messages.value.processes.success_profile_process_updated, removeProcessVariables), life: 3000 });
                        this.profileProcessFieldsErrors = null;

                        setTimeout(() => {
                            window.location.href = '/process-execution/edit/'+this.process_id+'/'+this.process_schema_id+'/'+this.profile_id+'/'+this.profile_schema_id+'/'+response.data.data.step_id;
                        }, 3000);
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
            this.process_schema.groups.forEach((_step, index) => {
                if (step.id === _step.id) {
                    if ((index+1) <= (this.process_schema.groups.length - 1)) {
                        nextStep = this.process_schema.groups[index + 1];
                    }
                }
            });
            return nextStep;
        },
        goToStep(step) {
            if ( (step.id !== this.step.id) && (step.order <= this.current_step.order)) {
                window.location.href = '/process-execution/edit/' + this.process_id + '/' + this.process_schema_id + '/' + this.profile_id + '/' + this.profile_schema_id + '/' + step.id;
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