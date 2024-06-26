import { defineStore } from 'pinia';
import { ApiHelper } from "@/helpers";

export const useActivitiesStore = defineStore({
    id: 'activities',
    state: () => ({
        loading: false,
        show_guidnace_note: false,
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
        apiHelper: Object,
        response: {
            'code': 0,
            'status': '',
            'message': '',
            'errors': [],
            'data': []
        }
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
            return response;
        },
        async create(parent_id = null){
            this.loading = true;
            if (this.activity.name === '' || this.activity.name === '' || this.activity.type_id === 0) {
                this.apiHelper.setResponse(500, 'error', 'Please check required fields', [], []);
                this.loading = false;
                return this.apiHelper.getResponse();
            }

            try {
                this.response = await this.apiHelper.create(this.activity, parent_id);
                this.clearForm();
            } catch (error) {
                throw new Error(error);
            } finally {
                this.loading = false;
            }

            return this.response;
        },
        update(step, id) {
            this.steps[id] = step;
        },
        async delete(activity) {
            try {
                this.response = await this.apiHelper.delete(activity);
            } catch (error) {
                throw new Error(error);
            } finally {
                this.loading = false;
            }

            return this.response;
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
        },
        clearForm() {
            this.activity.name = '';
            this.activity.label = '';
            this.activity.guidance_note = '';
        },
        setActivities(_activities) {
            this.activities = _activities;
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
        resetResponse() {
            this.response = {
                'status': '',
                'message': '',
                'errors': [],
                'data': []
            }
        },
        setGuidanceNote(value) {
            this.show_guidnace_note = value;
        }
    },
    getters: {
        // ...useAPIBaseStore().$getters,  // Spread the base store getters
        // TODO: Add functionality similar to computed state
        isLoaded() {
            return this.loaded;
        },
        showGuidanceNote() {
            return this.show_guidnace_note;
        }
    }
});