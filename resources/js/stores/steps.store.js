import { defineStore } from 'pinia';
import axios from "axios";

export const useStepsStore = defineStore({
    id: 'steps',
    state: () => ({
        loading: false,
        steps: [],
        step: {
            'id': 0,
            'name': '',
            'parent_id': 0,
            'order': 0,
            'model_id': 0
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
        async fetchSteps(parent_id, id = null)
        {
            this.loading = true;
            this.steps = [];
            this.resetResponse();

            let _url = this.url+'/'+this.user.tenant+'/step/'+parent_id;
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
                    this.steps = response.data.data;
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
            this.steps = [];

            if(this.step.name === '' || this.step.parent_id === 0 || this.step.model_id === 0) {
                // TODO: Move this message to an error messages config file and just call the config file here
                this.setResponse(500, 'error', 'Please check required fields', [], []);

                return this.response;
            }

            let _url = this.url+'/'+this.user.tenant+'/step/create';

            try {
                const response = await axios.post(_url, this.step, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ` + this.user.token,
                    },
                });

                if (response.status === 201) {
                    this.step.id = response.data.data.id;
                    this.loading = false;
                    this.setResponse(response.status, 'success', response.data.message, [], response.data.data);
                }
            } catch (error) {
                if(error.response.status !== 404) {
                    this.setResponse(error.response.status, 'error', error.response.statusText, [], []);
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
        },
        setStep(_step) {
            this.step = _step;
        },
        resetStep() {
            this.step = {
                'id': 0,
                'name': '',
                'parent_id': 0,
                'order': 0,
                'model_id': 0
            };
        }
    },
    getters: {
        // TODO: Add functionality similar to computed state
        isLoaded() {
            return this.loaded;
        }
    }
});