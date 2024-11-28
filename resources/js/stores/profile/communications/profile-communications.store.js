import { defineStore } from 'pinia';
import axios from "axios";
import { ApiHelper, FunctionsHelper } from "@/helpers/index.js";
import { usePage } from "@inertiajs/vue3";
import { computed } from "vue";
import { CommunicationConstants } from "@/constants/index.js";

const page = usePage();
const user = computed(() => page.props.auth.user);
const messages = computed(() => page.props.messages);
const apiURL = computed(() => page.props.negotium_api_url);

export const useProfileCommunicationStore = defineStore({
    id: 'profile-communications',
    state: () => ({
        currentEmailInputCc: '',
        currentEmailInputBcc: '',
        show_send_sms: false,
        show_send_email: false,
        show_cc: false,
        show_bcc: false,
        communication: {
            subject: '',
            message: '',
            to: [],
            cc: [],
            bcc: [],
            phone_number: '',
            communication_type_id: null
        },
        loading: false,
        status: {
            loading: false
        },
        apiUrl: apiURL.value,
        user: user.value,
        tenant: user.value.tenant,
        end_point: 'communication',
        selected_communication_type: [0],
        lookup: {
            communicationTypes: null
        },
        response: {
            code: 0,
            status: '',
            message: '',
            errors: [],
            data: []
        },
        apiHelper: new ApiHelper('communication')
    }),
    actions: {
        async sendEmail(toast, profile)
        {
            this.loading = true;
            if(this.communication.to === '' || this.communication.subject === '' || this.communication.message === '') {
                toast.add({ severity: 'error', detail: messages.value.error.input_validation_error, life: 3000 });
                this.loading = false;
                return false;
            }

            let _url = this.apiUrl+'/'+this.user.tenant+'/communication/send-email/'+profile.id;

            let data = {...this.communication, ...{ schema_id: profile.schema_id }};

            await this.apiHelper._post(_url, data);
            this.apiHelper.isDoneLoading(null, () => {
                const response = this.apiHelper.response;
                if (parseInt(response.code) === 200) {
                    let removeProcessVariables = {
                        'profileName': profile.profile_name
                    };
                    toast.add({ severity: 'success', detail: FunctionsHelper.replaceTextVariables(messages.value.communication.success_sending_email, removeProcessVariables), life: 3000 });
                    setTimeout(() => {
                        this.loading = false;
                        location.reload();
                    }, 3000)
                }

                if (parseInt(response.code) === 422) {
                    // ToDo: Handle errors
                }
            });
        },
        async sendSMS(toast, profile)
        {
            this.loading = true;
            if(this.communication.message === '') {
                toast.add({ severity: 'error', detail: messages.value.error.input_validation_error, life: 3000 });
                this.loading = false;
                return false;
            }

            let _url = this.apiUrl+'/'+this.user.tenant+'/communication/send-sms/'+profile.id;

            await this.apiHelper._post(_url, this.communication);
            this.apiHelper.isDoneLoading(null, () => {
                const response = this.apiHelper.response;
                if (parseInt(response.code) === 200) {
                    let removeProcessVariables = {
                        'profileName': profile.profile_name
                    };
                    toast.add({ severity: 'success', detail: FunctionsHelper.replaceTextVariables(messages.value.communication.success_sending_sms, removeProcessVariables), life: 3000 });
                    setTimeout(() => {
                        this.loading = false;
                        location.reload();
                    }, 3000)
                } else if (parseInt(response.code) === 422) {
                    toast.add({ severity: 'error', detail: response.message, life: 3000 });
                    this.loading = false;
                } else {
                    toast.add({ severity: 'error', detail: response.message, life: 3000 });
                    this.loading = false;
                }
            });
        },
        setLookUp(key, value) {
            this.$state['lookup'][key] = value;
        },
        isSelectedCommunicationType(communication_type_id) {
            return this.selected_communication_type.some((item) => item === communication_type_id)
        },
        toogleCommunicationType(communication_type_id) {
            if(communication_type_id === 0 || (this.selected_communication_type.length === 1 && this.selected_communication_type[0] === 0)) {
                this.selected_communication_type = [];
                this.selected_communication_type.push(communication_type_id);
            } else {
                if( this.selected_communication_type.some((item) => item === communication_type_id) ) {
                    this.selected_communication_type = this.selected_communication_type.filter((i) => i !== communication_type_id);
                } else {
                    this.selected_communication_type.push(communication_type_id);
                }
            }
            if (this.selected_communication_type.length === 0){
                this.selected_communication_type.push(0);
            }
        },
        filterByCommunicationType(communications) {
            if(this.selected_communication_type.length === 1 && this.selected_communication_type[0] === 0) {
                return communications;
            }

            return communications.filter((item) => this.selected_communication_type.includes(item.communication_type_id));
        },
        showSendEmail(profile) {
          this.show_send_email = true;
          this.communication.communication_type_id = CommunicationConstants.COMMUNICATION_TYPE_EMAIL;
          this.communication.to.push(profile.email);
        },
        showSendSMS(profile) {
          this.show_send_sms = true;
          this.communication.communication_type_id = CommunicationConstants.COMMUNICATION_TYPE_SMS;
          this.communication.phone_number = profile.phone_number;
        },
        toogleCc() {
            if (this.show_cc) {
                this.show_cc = false;
                this.communication.cc = '';
            } else {
                this.show_cc = true;
            }
        },
        toogleBcc() {
            if (this.show_bcc) {
                this.show_bcc = false;
                this.communication.bcc = '';
            } else {
                this.show_bcc = true;
            }
        },
        addEmail(type, emails, toast) {
            const trimmedInput = type === 'cc' ? this.currentEmailInputCc.trim() : this.currentEmailInputBcc.trim();
            if (this.validateEmail(trimmedInput)) {
                emails.push(trimmedInput);
                this.currentEmailInputCc = '';
                this.currentEmailInputBcc = '';
            } else if (trimmedInput) {
                toast.add({ severity: 'error', detail: messages.value.error.email_validation_error, life: 3000 });
            }
        },
        removeEmail(emails, index) {
            emails.splice(index, 1);
        },
        validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },
        resetResponse() {
            this.response = {
                status: '',
                message: '',
                errors: [],
                data: []
            }
        },
        setResponse(code, status, message, errors, data) {
            this.response = {
                code: code,
                status: status,
                message: message,
                errors: errors,
                data: data
            }
        },
        resetCommunication() {
            this.loading = false;
            this.communication.subject = '';
            this.communication.message = '';
            this.communication.cc = [];
            this.communication.bcc = [];
            this.communication.communication_type_id = null;
            this.show_cc = false;
            this.show_bcc = false;
        }
    },
    getters: {

    }
});