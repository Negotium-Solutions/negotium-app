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

            try {
                const response = await axios.get(_url, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ` + this.user.token,
                    },
                });

                if (response.status === 200) {
                    this.processes = response.data.data;
                    this.loading = false;
                    this.setResponse(response.status, 'success', response.data.message, [], []);
                }
            } catch (error) {
                if(error.response.status !== 404) {
                    this.setResponse(error.response.status,'error', error.response.statusText, [], []);
                }
            }
        },
        async create(){
            this.resetResponse();
            this.loading = true;
            this.processes = [];

            if(this.process.name === null || this.process.process_category_id === null) {
                console.log('process', this.process);
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
                    console.log('response.data', response.data);
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
        delete(id) {
            this.resetResponse();
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
        // TODO: Add functionality similar to computed state
        isLoaded() {
            return this.loaded;
        }
    }
});