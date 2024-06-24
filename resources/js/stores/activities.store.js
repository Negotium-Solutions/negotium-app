import { defineStore } from 'pinia';
import { ApiHelper } from "@/helpers";

export const useActivitiesStore = defineStore({
    id: 'activities',
    state: () => ({
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
        apiUrl: '',
        user: Object,
        tenant: '',
        end_point: 'activity',
        apiHelper: Object
    }),
    actions: {
        // ...useAPIBaseStore().$actions,  // Spread the base store actions
        init(apiUrl, user) {
            this.apiUrl = apiUrl;
            this.user = user;
            this.tenant = user.tenant;

            this.apiHelper = new ApiHelper(this.apiUrl, this.user, this.end_point);
        },
        async get(id = null, parent_id = null, _with = null)
        {
            this.loading = true;
            const response = await this.apiHelper.get(id, parent_id, _with);
            this.loading = false;
            console.log('Response: ', response);
            return response;
        },
        async create(parent_id = null){
            // useAPIBaseStore().init(this.apiUrl, this.user, this.tenant, this.end_point);
            // useAPIBaseStore().item = this.activity;
            // await useAPIBaseStore().create(parent_id);

            // return useAPIBaseStore().response;
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
        setActivities(_activities) {
            this.activities = _activities;
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