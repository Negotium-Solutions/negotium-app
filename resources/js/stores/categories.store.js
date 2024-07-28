import { defineStore } from 'pinia';
import axios from "axios";
import { ApiHelper } from "@/helpers/index.js";

export const useCategoriesStore = defineStore({
    id: 'process-categories',
    state: () => ({
        loading: false,
        apiUrl: '',
        user: Object,
        tenant: '',
        end_point: 'process-category',
        categories: [],
        response: {
            'code': 0,
            'status': '',
            'message': '',
            'errors': [],
            'data': []
        }
    }),
    actions: {
        init(apiUrl, user) {
            this.apiUrl = apiUrl;
            this.user = user;
            this.tenant = user.tenant;

            this.apiHelper = new ApiHelper(this.apiUrl, this.user, this.end_point);
        },
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
            console.log("categories3", this.categories);
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