import { defineStore } from 'pinia';
import axios from "axios";
import { ApiHelper, FunctionsHelper } from "@/helpers/index.js";
import { usePage } from "@inertiajs/vue3";
import { computed } from "vue";

const page = usePage();
const user = computed(() => page.props.auth.user);
const messages = computed(() => page.props.messages);
const apiURL = computed(() => page.props.negotium_api_url);

export const useReport = defineStore({
    id: 'report',
    state: () => ({
        profileTypes: null,
        profileProcesses: null,
        showProcesses: false,
        profileName: null,
        profileProcessFieldsErrors: null,
        loading: false,
        apiUrl: apiURL.value,
        apiImagesUrl: null,
        user: user.value,
        tenant: user.value.tenant,
        end_point: 'document',
        apiHelper: new ApiHelper('process-status')
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
        async getProfiles(){
            this.loading = true;
            this.apiHelper = new ApiHelper('report/process-status');
            this.response = await this.apiHelper.get();

            if(this.response.code === 200) {
                this.profileTypes = this.response.data;
            }
            //this.loading = false;
            //console.log('ProfileTypes:', this.profileTypes)
            return this.profileTypes;
        },
        setProfileProcesses(profile){
          this.profileProcesses = profile.processes;
          this.showProcesses = !this.showProcesses;
          this.profileName = profile.profile_name;
          console.log('profileProcesses', this.profileProcesses);
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