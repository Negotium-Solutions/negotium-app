import { defineStore } from 'pinia';
import { useToastr } from "@/toastr.js";
import axios from "axios";
import { responseHelper } from "@/helpers";
import { useAPIBaseStore } from "@/stores/api-base.store.js";

const response = new responseHelper();
const toastr = useToastr();

export const useActivitiesStore = defineStore({
    id: 'activities',
    state: () => ({
        ...useAPIBaseStore().$state,
        loading: false,
        activities: {},
        activity: {
            'id': 0,
            'name': '',
            'label': '',
            'attributes': '',
            'type_id': 0,
            'step_id': 0,
            'guidance_note': ''
        },
        step: Object,
        url: '',
        user: Object,
        tenant: '',
        end_point: 'activity'
    }),
    actions: {
        // ...useAPIBaseStore().$actions,  // Spread the base store actions
        init(url, user) {
            this.url = url;
            this.user = user;
            this.tenant = user.tenant;
        },
        async fetch(id = null, parent_id = null, _with = null)
        {
            useAPIBaseStore().init(this.url, this.user, this.tenant, this.end_point);
            await useAPIBaseStore().fetch(id, parent_id, _with);

            return useAPIBaseStore().response;
        },
        async create(parent_id = null){
            useAPIBaseStore().init(this.url, this.user, this.tenant, this.end_point);
            useAPIBaseStore().item = this.activity;
            await useAPIBaseStore().create(parent_id);

            return useAPIBaseStore().response;
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
        setActivity(_activity) {
            this.activity = _activity;
        },
        resetActivity() {
            this.activity = {
                'id': 0,
                'name': '',
                'label': '',
                'attributes': '',
                'type_id': 0,
                'step_id': 0,
                'guidance_note': ''
            };
        }
    },
    getters: {
        // ...useAPIBaseStore().$getters,  // Spread the base store getters
        // TODO: Add functionality similar to computed state
        isLoaded() {
            return this.loaded;
        }
    }
});