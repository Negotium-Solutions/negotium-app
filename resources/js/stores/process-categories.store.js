import { defineStore } from 'pinia';
import { useToastr } from "@/toastr.js";
import axios from "axios";
import { usePage } from "@inertiajs/vue3";
import { computed } from "vue";

const toastr = useToastr();

const page = usePage();
const user = computed(() => page.props.auth.user);
const apiURL = computed(() => page.props.negotium_api_url);

export const useProcessCategoryStore = defineStore({
    id: 'process-categories',
    state: () => ({
        process_categories: [],
        process_category: {
            'id': null,
            'name': null
        },
        response: {
            'code': 0,
            'status': '',
            'message': '',
            'errors': [],
            'data': []
        },
        url: apiURL.value,
        user: user.value,
        tenant: user.value.tenant
    }),
    actions: {
        async fetchProcessCategories(id = null, _with = null) {
            this.loading = true;
            this.processes = [];
            this.resetResponse();

            let _url = this.url+'/'+this.user.tenant+'/process-category';
            if (id !== null) {
                _url = _url + '/'+id;
            }

            if(_with !== null ) {
                _url += _with;
            }

            try {
                const response = await axios.get(_url, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ` + this.user.token,
                    },
                });

                if (response.status === 200) {
                    if (id !== null) {
                        this.process_categories = response.data.data;
                    } else {
                        this.process_categories = response.data.data;
                    }
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
            
            if(this.process_category.name === null) {
                // TODO: Move this message to an error messages config file and just call the config file here
                this.setResponse(422, 'error', 'Please check required fields', [], []);

                return this.response;
            }

            let _url = this.url+'/'+this.user.tenant+'/process-category/create';

            console.log('this.process_category', this.process_category);
            try {
                const response = await axios.post(_url, this.process_category, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ` + this.user.token,
                    },
                });

                if (response.status === 201) {
                    this.process_category.id = response.data.data.id;
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

            let _url = this.url+'/'+this.user.tenant+'/process-category/delete/'+_process.id;

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
        }
    },
    getters: {
        // TODO: Add functionality similar to computed state
        isLoaded() {
            return this.loaded;
        }
    }
});