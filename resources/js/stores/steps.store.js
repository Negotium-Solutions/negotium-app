import { defineStore } from 'pinia';
import axios from "axios";
import { useToastr } from "@/toastr.js";

const toastr = useToastr();
export const useStepsStore = defineStore({
    id: 'steps',
    state: () => ({
        /** @type {{ name: string, parent_id: integer, order: integer, model_id: integer }[]} */
        steps: {},
        /** @type { name: string, parent_id: integer, order: integer, model_id: integer } */
        step: Object,
        editMode: false,
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
        async fetchSteps(parent_id, id = null) {
            let _url = this.url+'/'+this.tenant+'/step/'+parent_id;
            if (id !== null) {
                _url += '/'+id;
            }

            this.steps = { loading: true };

            try {
                const response = await axios.get(_url, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ` + this.user.token,
                    },
                });

                if (response.status === 200) {
                    this.steps = response.data.data;
                }
            } catch (error) {
                this.steps = { error: true };
                toastr.error(error.response.status+': '+error.response.statusText);
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
        },
        selectStep(id) {
            this.step = this.steps.find(x => x.id === id);
        },
        editStep(id) {
            this.editMode = true;
        },
        saveStep() {
            this.editMode = false;
        }
    },
    getters: {
        // TODO: Add functionality similar to computed state
        editMode() {
            return this.editMode;
        },
        get() {
            console.log('It gets here:', this.steps);
            return this.steps;
        }
    }
});