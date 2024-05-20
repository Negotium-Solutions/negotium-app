import { defineStore } from 'pinia';
import axios from "axios";
import { useToastr } from "@/toastr.js";
import { usePage } from "@inertiajs/vue3";
import { computed } from "vue";

const toastr = useToastr();
const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);

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
        tenant: '',
        profile: Object
    }),
    actions: {
        init(url, user) {
            this.url = url;
            this.user = user;
            this.tenant = user.tenant;
        },
        async fetchSteps(parent_id, id = null) {
            let _url = this.url+'/'+this.tenant+'/step/'+parent_id+'?with=model';
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
                    console.log('this.steps', this.steps);
                }
            } catch (error) {
                this.steps = { error: true };
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
        async delete(id) {
            console.log('ID: ', id);
            // add isDeleting prop to user being deleted
            // this.steps.find(x => x.id === id).isDeleting = true;

            // remove activity from list after deleted
            // this.steps = this.activities.filter(x => x.id !== id);

            try {
                let response = await axios.delete(negotium_api_url.value + '/' + user.value.tenant + '/step/delete/' + id, {
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
        },
        selectStep(step) {
            // this.step = this.steps.find(x => x.id === id);
            this.step = step;
            console.log('Step: ', step);
        },
        editStep(id) {
            this.editMode = true;
        },
        saveStep() {
            this.editMode = false;
        },
        setEdit(boolean) {
            this.editMode = boolean;
        },
        setProfile(profile) {
            this.profile = profile;
        }
    },
    getters: {
        // TODO: Add functionality similar to computed state
        isEdit() {
            return this.editMode;
        }
    }
});