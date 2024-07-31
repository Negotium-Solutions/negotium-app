import { defineStore } from 'pinia';
import { ApiHelper } from "@/helpers";

export const useCategoriesStore = defineStore({
    id: 'process-categories',
    state: () => ({
        loading: false,
        apiUrl: '',
        user: Object,
        tenant: '',
        categories: [],
        response: {
            'code': 0,
            'status': '',
            'message': '',
            'errors': [],
            'data': []
        },
        apiHelper: new ApiHelper('process-category')
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
                    this.categories = this.response.data;
                }
            }
            this.loading = false;

            return this.response;
        },
        getCategories() {
            return this.categories;
        }        
    },
    getters: {
        // TODO: Add functionality similar to computed state
        
    }
});