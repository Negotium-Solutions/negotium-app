import { defineStore } from 'pinia';
import { useToastr } from "@/toastr.js";
import axios from "axios";

const toastr = useToastr();

export const useActivitiesStore = defineStore({
    id: 'activities',
    state: () => ({
        /** @type {{ name: string, title: string, type: string, attributes: [] }[]} */
        activities: {},
        activity: {},
        step: Object,
        loaded: false,
        url: '',
        user: Object,
        tenant: '',
    }),
    actions: {
        init(url, user) {
            this.url = url;
            this.user = user;
            this.tenant = user.tenant;
        },
        async fetchActities(step_id, id = null) {
            let _url = this.url+'/'+this.user.tenant+'/activity/'+step_id;
            if (id !== null) {
                _url = _url + '/'+id;
            }

            this.activities = { loading: true };

            try {
                const response = await axios.get(_url, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ` + this.user.token,
                    },
                });

                if (response.status === 200) {
                    this.activities = response.data.data;
                    console.log('this.activities', this.activities);
                }
            } catch (error) {
                console.log('Error: ', error);
                this.activities = { error: true };
                if(error.response.status !== 404) {
                    toastr.error(error.response.status + ': ' + error.response.statusText);
                }
            }
        },
        create(step){
            this.steps.push(step);
        },
        update(step, id) {
            this.steps[id] = step;
        },
        delete(id) {
            // add isDeleting prop to user being deleted
            this.steps.find(x => x.id === id).isDeleting = true;

            // remove activity from list after deleted
            this.steps = this.activities.filter(x => x.id !== id);
        }
    },
    getters: {
        // TODO: Add functionality similar to computed state
        isLoaded() {
            return this.loaded;
        }
    }
});