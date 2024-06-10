import { defineStore } from 'pinia';

export const useGlobalsStore = defineStore({
    id: 'globals',
    state: () => ({
        STEP_INFORMATION: 0,
        STEP_FORM: 1,
        ACTIVITY_FORM: 2,
        activeForm: 0
    }),
    actions: {
        setActiveForm(form_id) {
            this.activeForm = form_id;
        },
        cancel() {
            this.activeForm = this.STEP_INFORMATION;
        }
    },
    getters: {
        getActiveForm() {
            return this.activeForm;
        }
    }
});