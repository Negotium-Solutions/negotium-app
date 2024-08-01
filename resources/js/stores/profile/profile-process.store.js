import { defineStore } from 'pinia';
import axios from "axios";
import { ApiHelper } from "@/helpers/index.js";
import { usePage } from "@inertiajs/vue3";
import { computed } from "vue";

const page = usePage();
const user = computed(() => page.props.auth.user);
const messages = computed(() => page.props.messages);
const apiURL = computed(() => page.props.negotium_api_url);

export const useProfileProcessStore = defineStore({
    id: 'profiles',
    state: () => ({
        selectedProfileProcesses: [],
        showProcessModal: false,
        loading: false,
        status: {
            loading: false
        },
        apiUrl: apiURL.value,
        user: user.value,
        tenant: user.value.tenant,
        end_point: 'profile',
        profiles: [],
        profile: {
            'id': null,
            'name': null,
            'process_category_id': null,
            'steps': []
        },
        selected_categories: [0],
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
        async get(id = null, parent_id = null, _with = null)
        {
            this.loading = true;
            this.response = await this.apiHelper.get(id, parent_id, _with);

            if(this.response.code === 200) {
                if(id !== null) {
                    this.profile = this.response.data;
                } else {
                    this.profiles = this.response.data;
                }
            }
            this.loading = false;

            return this.response;
        },
        async assignProcesses(toast)
        {
            this.loading = true;
            this.status.loading = true;
            if(this.selectedProfileProcesses.length === 0) {
                toast.add({ severity: 'warn', summary: 'Warning', detail: messages.value.profile.no_process_assigned, life: 3000 });
                return false;
            }

            let _url = this.apiUrl+'/'+this.user.tenant+'/profile/assign-processes';

            const jsonData = {
                "data": this.selectedProfileProcesses
            };

            try {
                const response = await axios.post(_url, jsonData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ` + this.user.token,
                    },
                });

                if (response.status === 201) {
                    this.setResponse(response.status, 'success', response.data.message, [], []);
                    toast.add({ severity: 'success', summary: 'Success', detail: response.data.message, life: 3000 });
                    this.showProcessModal = false;
                    // this.selectedProfileProcesses = [];
                    this.loading = false;
                    this.status.loading = false;
                }
            } catch (error) {
                if(error.response.status !== 404) {
                    this.setResponse(error.response.status, 'success', error.response.statusText, [], []);
                    toast.add({ severity: 'error', summary: 'Error', detail: error.response.statusText, life: 3000 });
                }
                this.loading = false;
                this.status.loading = false;
            }
        },
        selectProcess(profile_id, process_id){
            let item = {
              'profile_id': profile_id,
              'process_id': process_id
            };

            let itemInArray = this.selectedProfileProcesses.some(_item => _item.profile_id === item.profile_id && _item.process_id === item.process_id);
            if(itemInArray) {
                this.selectedProfileProcesses = this.selectedProfileProcesses.filter((_item) => JSON.stringify(_item) !== JSON.stringify(item));
            } else {
                this.selectedProfileProcesses.push(item);
            }
        },
        isSelectedProcess(profile_id, process_id) {
            let item = {
                'profile_id': profile_id,
                'process_id': process_id
            };

            return this.selectedProfileProcesses.some(_item => _item.profile_id === item.profile_id && _item.process_id === item.process_id)
        },
        checkCondition(condition, callbackFunction) {
            const check = () => {
                if (condition.loading === true) {
                    setTimeout(check, 100);
                } else {
                    callbackFunction();
                }
            };
            check();
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