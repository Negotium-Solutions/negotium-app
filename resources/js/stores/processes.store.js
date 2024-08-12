import { defineStore } from 'pinia';
import axios from "axios";
import { ApiHelper } from "@/helpers";

export const useProcessesStore = defineStore({
    id: 'processes',
    state: () => ({
        loading: false,
        apiUrl: '',
        user: Object,
        tenant: '',
        end_point: 'process',
        processes: [],
        process: {
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
        apiHelper: new ApiHelper('process')
    }),
    actions: {
        async get(id = null, parent_id = null, _with = null)
        {
            this.loading = true;
            this.response = await this.apiHelper.get(id, parent_id, _with);

            if(this.response.code === 200) {
                if(id !== null) {
                    this.process = this.response.data;
                } else {
                    this.processes = this.response.data;
                }
            }
            this.loading = false;

            return this.response;
        },
        async fetchProcesses(category_id, id = null)
        {
            this.loading = true;
            this.processes = [];
            this.resetResponse();

            let _url = this.apiUrl+'/'+this.user.tenant+'/process/'+category_id;
            if (id !== null) {
                _url = _url + '/'+id;
            }
            _url += '?with=category,steps.activities';

            try {
                const response = await axios.get(_url, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ` + this.user.token,
                    },
                });

                if (response.status === 200) {
                    if (id !== null) {
                        this.processes = response.data.data;
                    } else {
                        this.process = response.data.data;
                    }
                    this.setResponse(response.status, 'success', response.data.message, [], []);
                }
            } catch (error) {
                if(error.response.status !== 404) {
                    this.setResponse(error.response.status,'error', error.response.statusText, [], []);
                }
            } finally {
                this.loading = false;
            }
        },
        async create(){
            this.resetResponse();
            this.loading = true;
            this.processes = [];

            if(this.process.name === null || this.process.process_category_id === null) {
                // TODO: Move this message to an error messages config file and just call the config file here
                this.setResponse(500, 'error', 'Please check required fields', [], []);

                return this.response;
            }

            let _url = this.apiUrl+'/'+this.user.tenant+'/process/create';

            try {
                const response = await axios.post(_url, this.process, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ` + this.user.token,
                    },
                });

                if (response.status === 201) {
                    this.process.id = response.data.data.id;
                    this.loading = false;
                    this.setResponse(response.status, 'success', response.data.message, [], []);
                }
            } catch (error) {
                if(error.response.status !== 404) {
                    this.setResponse(error.response.status, 'success', error.response.statusText, [], []);
                }
            }

            return this.response;
        },
        update(process, id) {
            this.resetResponse();
        },
        async delete(_process)
        {
            this.loading = true;
            this.resetResponse();

            let _url = this.apiUrl+'/'+this.user.tenant+'/process/delete/'+_process.id;

            try {
                const response = await axios.delete(_url, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ` + this.user.token,
                    },
                });

                if (response.status === 204) {
                    this.loading = false;
                    this.setResponse(response.status, 'success', response.data.message, [], []);
                    // Remove item on successful deletion
                    this.processes = this.processes.filter((item) => item.id !== _process.id);
                }
            } catch (error) {
                this.setResponse(error.response.status,'error', error.response.statusText, [], []);
            }

            return this.response;
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
        setProcess(process) {
            this.process = process;
        },
        getProcess() {
            return this.process;
        },
        setProcesses(processes) {
            this.processes = processes;
        },
        getProcesses() {
            return this.processes;
        },
        isSelectedCategory(category_id) {
            return this.selected_categories.some((item) => item === category_id)
        },
        toogleCategory(category_id) {
            if(category_id === 0 || (this.selected_categories.length === 1 && this.selected_categories[0] === 0)) {
                this.selected_categories = [];
                this.selected_categories.push(category_id);
            } else {
                if( this.selected_categories.some((item) => item === category_id) ) {
                    this.selected_categories = this.selected_categories.filter((i) => i !== category_id);
                } else {
                    this.selected_categories.push(category_id);
                }
            }
        },
        getStep(step_id) {
            let step = {};
            this.process.steps.forEach((_step) => {
                if(step_id === _step.id) {
                    step = _step;
                }
            });

            return step;
        },
        filterByCategoryExcluding(assigned_processes) {
            let assigned_processes_array = [];
            assigned_processes.forEach((process) => {
                assigned_processes_array.push(process.id);
            });

            if(this.selected_categories.some((item) => item === 0)) {
                return this.processes.filter((item) => !assigned_processes_array.includes(item.id));
            }

            return this.processes.filter((item) => this.selected_categories.indexOf(item.process_category_id) >= 0 && !assigned_processes_array.includes(item.id));
        },
        filterByExcludedProcesses(processes, excluded_processes) {
            let excluded_processes_array = [];
            processes.forEach((process) => {
                if(process.log.process_status_id === 6) {
                    excluded_processes_array.push(process.id);
                }
            });

            excluded_processes.forEach((process) => {
                excluded_processes_array.push(process.id);
            });

            return processes.filter((item) => !excluded_processes_array.includes(item.id));
        }
    },
    getters: {
        // TODO: Add functionality similar to computed state
        isLoaded() {
            return this.loaded;
        },
        filterByCategory(state) {
            if(state.selected_categories.some((item) => item === 0)) {
                return this.processes;
            }

            return this.processes.filter((item) => state.selected_categories.indexOf(item.process_category_id) >= 0);
        }
    }
});