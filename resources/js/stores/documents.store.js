import { defineStore } from 'pinia';
import axios from "axios";
import { usePage } from "@inertiajs/vue3";
import { computed } from "vue";

const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);

export const useDocumentsStore = defineStore({
    id: 'steps',
    state: () => ({
        /** @type {{ name: string, parent_id: integer, order: integer, model_id: integer }[]} */
        documents: {},
        /** @type { name: string, parent_id: integer, order: integer, model_id: integer } */
        document: Object,
        url: '',
        user: Object,
        tenant: ''
    }),
    actions: {
        init(url, user) {
            this.url = url;
            this.user = user;
            this.tenant = user.tenant;
        },
        async fetchDocuments(parent_id, id = null) {
            let _url = this.url+'/'+this.tenant+'/documents/'+parent_id+'?with=model';
            if (id !== null) {
                _url += '/'+id;
            }

            this.documents = { loading: true };

            try {
                const response = await axios.get(_url, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ` + this.user.token,
                    },
                });

                if (response.status === 200) {
                    this.documents = response.data.data;
                }
            } catch (error) {
                this.documents = error.response;
            }
        },
        async create(step){
            // Todo: add functionality
        },
        async update(step, id) {
            // Todo: add functionality
        },
        async delete(id) {
            console.log('ID: ', id);

            try {
                let response = await axios.delete(negotium_api_url.value + '/' + user.value.tenant + '/documents/delete/' + id, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ` + user.value.token,
                    },
                });

                if(response.status === 204 ) {
                    toastr.success('Step successfully deleted');
                    this.fetchSteps(this.profile.id);
                }
            } catch (error) {
                toastr.error(error.response.status+': '+error.response.statusText);
            }
        }
    },
    getters: {
        // TODO: Add functionality similar to computed state
        isEdit() {
            //
        }
    }
});