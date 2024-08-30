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
        show_send_email: false,
        communication: {
            'subject': '',
            'message': '',
            '_to': '',
            to: [],
            'cc': [],
            'bcc': [],
            'communication_type_id': null
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
            'communicationTypes': null
        },
        response: {
            'code': 0,
            'status': '',
            'message': '',
            'errors': [],
            'data': []
        },
        apiHelper: new ApiHelper('communication')
    }),
    actions: {
        async create(toast, profile)
        {
            this.loading = true;
            if(this.communication.to === '' || this.communication.subject === '' || this.communication.message === '') {
                toast.add({ severity: 'error', detail: messages.value.error.input_validation_error, life: 3000 });
                this.loading = false;
                return false;
            }

            let _url = this.apiUrl+'/'+this.user.tenant+'/communication/send-email/'+profile.id;
            this.communication.to = [this.communication._to]; // Todo: fix this to use an input that can tab and create array, check primevue for this

            await this.apiHelper._post(_url, this.communication);
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
                    console.log('response', response);
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
        showSendEmail(profile_id) {
          this.show_send_email = true;
          this.communication.communication_type_id = CommunicationConstants.COMMUNICATION_TYPE_EMAIL;
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
        },
        resetCommunication() {
            this.loading = false;
            this.communication = {
                'subject': '',
                'message': '',
                '_to': '',
                to: [],
                'cc': [],
                'bcc': [],
                'communication_type_id': null
            };
        }
    },
    getters: {

    }
});