import { defineStore } from 'pinia';
import axios from "axios";

export const useProcessesStore = defineStore({
    id: 'processes',
    state: () => ({
        loading: false,
        processes: [],
        process: {
            'id': null,
            'name': null,
            'process_category_id': null
        },
        selected_categories: [0],
        response: {
            'code': 0,
            'status': '',
            'message': '',
            'errors': [],
            'data': []
        }
    }),
    actions: {
        init(url, user) {
            this.url = url;
            this.user = user;
            this.tenant = user.tenant;
        },
        async fetchProcesses(category_id, id = null)
        {
            this.loading = true;
            this.processes = [];
            this.resetResponse();

            let _url = this.url+'/'+this.user.tenant+'/process/'+category_id;
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

            let _url = this.url+'/'+this.user.tenant+'/process/create';

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

            let _url = this.url+'/'+this.user.tenant+'/process/delete/'+_process.id;

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