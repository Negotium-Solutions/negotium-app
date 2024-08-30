import { defineStore } from 'pinia';
import axios from "axios";
import { ApiHelper, FunctionsHelper } from "@/helpers/index.js";
import { usePage } from "@inertiajs/vue3";
import { computed } from "vue";

const page = usePage();
const user = computed(() => page.props.auth.user);
const messages = computed(() => page.props.messages);
const apiURL = computed(() => page.props.negotium_api_url);

export const useProfileProcessStore = defineStore({
    id: 'profile-process',
    state: () => ({
        acceptLabel: '',
        selectedProfileProcesses: [],
        showProcessModal: false,
        showStopConfirmation: false,
        showRemoveConfirmation: false,
        loading: false,
        status: {
            loading: false
        },
        apiUrl: apiURL.value,
        user: user.value,
        tenant: user.value.tenant,
        end_point: 'profile',
        selected_categories: [0],
        excluded_processes: [],
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
        async assignProcesses(toast, profile_name)
        {
            this.loading = true;
            this.status.loading = true;
            if(this.selectedProfileProcesses.length === 0) {
                toast.add({ severity: 'warn', detail: messages.value.profile.no_process_assigned, life: 3000 });
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

                    let removeProcessVariables = {
                        'profileName': profile_name
                    };
                    toast.add({ severity: 'success', detail: this.selectedProfileProcesses.length + ' ' + FunctionsHelper.replaceTextVariables(messages.value.profile.success_assigning_processes, removeProcessVariables), life: 3000 });
                    this.showProcessModal = false;
                    this.loading = false;
                    this.status.loading = false;

                    setTimeout(function() {
                        location.reload();
                    }, 2000);
                }
            } catch (error) {
                console.log('error', error);
                if(error.response.status !== 404) {
                    this.setResponse(error.response.status, 'error', error.response.statusText, [], []);
                    toast.add({ severity: 'error', summary: 'Error', detail: messages.value.profile.error_assigning_processes, life: 3000 });
                }
                this.loading = false;
                this.status.loading = false;
            }
        },
        async updateProcessLogStatus(process_log_id = 0, process_status_id = 0, toast, action_done)
        {
            this.loading = true;
            this.status.loading = true;
            if(process_log_id === 0 || process_status_id === 0) {
                this.setResponse(422, 'error', messages.value.error.input_validation_error, [], []);
                return false;
            }

            let _url = this.apiUrl+'/'+this.user.tenant+'/process/update-process-log-status';

            const data = {
                "process_log_id": process_log_id,
                "process_status_id": process_status_id
            };

            try {
                const response = await axios.post(_url, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ` + this.user.token,
                    },
                });

                if (response.status === 200) {
                    this.setResponse(response.status, 'success', response.data.message, [], []);
                    this.showProcessModal = false;
                    this.loading = false;
                    this.status.loading = false;

                    let removeProcessVariables = {
                        'action': action_done
                    };
                    toast.add({ severity: 'success', detail: FunctionsHelper.replaceTextVariables(messages.value.processes.process_success, removeProcessVariables), life: 3000 });

                    setTimeout(function() {
                        location.reload();
                    }, 2000);
                }

                if (response.status === 204) {
                    this.setResponse(response.status, 'success', response.statusText, [], []);
                    this.showProcessModal = false;
                    this.loading = false;
                    this.status.loading = false;
                }
            } catch (error) {
                if(error.response.status !== 404) {
                    this.setResponse(error.response.status, 'error', error.response.statusText, [], []);
                }
                this.loading = false;
                this.status.loading = false;
            }

            return true;
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
        showProcessConfirmation(toast, confirm, process, profile, process_status_id, buttonLabel, action, action_done)
        {
            this.acceptLabel = buttonLabel;
            let removeProcessVariables = {
                'processName': process.name,
                'profileName': profile.profile_name,
                'action': action
            };

            confirm.require({
                header: 'Process Confirmation',
                message: FunctionsHelper.replaceTextVariables(messages.value.processes.process_confirmation, removeProcessVariables),
                acceptLabel: 'Yes, ' + buttonLabel,
                acceptClass: 'btn btn-sm btn-default mr-2',
                rejectLabel: 'Cancel',
                rejectClass: 'btn btn-sm btn-default mr-2',
                rejectProps: {
                    label: 'Cancel',
                    severity: 'secondary',
                    outlined: true
                },
                acceptProps: {
                    label: 'Save'
                },
                accept: () => {
                    try {
                        this.updateProcessLogStatus(process.log.id, process_status_id, toast, action_done);
                    } catch (error) {
                        toast.add({ severity: 'error', detail: FunctionsHelper.replaceTextVariables(messages.value.processes.process_error, removeProcessVariables), life: 3000 });
                    }
                },
                reject: () => {
                    // Do nothing
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
        PROCESS_STATUS_ASSIGNED: () => 1,
        PROCESS_STATUS_ACTIVE: () => 2,
        PROCESS_STATUS_COMPLETED: () => 3,
        PROCESS_STATUS_STOPPED: () => 4,
        PROCESS_STATUS_RESUMED: () => 5,
        PROCESS_STATUS_ARCHIVED: () => 6,
        isDisabledAssignProcess() {
            return this.selectedProfileProcesses.length === 0 || this.status.loading === true;
        }
    }
});