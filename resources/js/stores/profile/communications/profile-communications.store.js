import { defineStore } from 'pinia';
import axios from "axios";
import { ApiHelper, FunctionsHelper } from "@/helpers/index.js";
import { usePage } from "@inertiajs/vue3";
import { computed } from "vue";

const page = usePage();
const user = computed(() => page.props.auth.user);
const messages = computed(() => page.props.messages);
const apiURL = computed(() => page.props.negotium_api_url);

export const useProfileCommunicationStore = defineStore({
    id: 'profile-communications',
    state: () => ({
        communication: {
            'subject': '',
            'note': '',
            'user_email': user.value.email,
            'profile_id': '',
            'communication_type': ''
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