import { defineStore } from 'pinia';
import { functionsHelper, formsHelper } from '../helpers';

const _CATEGORY_FORM = 'category';
const _PROCESS_FORM = 'process';
const _STEP_FORM = 'step';
const _ACTIVITY_FORM = 'activity';
const functionHelper = new functionsHelper();
export const useFactoryWorkerStore = defineStore({
    id: 'main',
    state: () => ({
        // Collections and models
        categories: null,
        category: null,
        processes: null,
        process: null,
        steps: null,
        step: null,
        activities: null,
        activity: null,
        // Other state values
        activeForm: _STEP_FORM,
        forms: {
            category: new formsHelper({id: 0, name: '', color: functionHelper.getRandomHexColor()}),
            process: new formsHelper({id: 0, name: '', process_category_id: 0}),
            step: new formsHelper({id: '', name: '', parent_id: '', order: '', model_id: ''}, ['name', 'parent_id', 'model_id']),
            activity: new formsHelper({id: 0, name: '', label: '', guidance_note: '', attributes: '', type_id: 0, step_id: 0})
        }
    }),
    actions: {
        set(type, items) {
            this.$state[type] = items;

            switch (type) {
                case this.CATEGORY_FORM:
                    if(typeof items.processes !== 'undefined') {
                        this.$state.processes = items.processes;
                    }
                    break;
                case this.PROCESS_FORM:
                    if(typeof items.category !== 'undefined') {
                        this.$state.category = items.category;
                    }
                    if(typeof items.steps !== 'undefined') {
                        this.$state.steps = items.steps;
                    }
                    break;
                case this.STEP_FORM:
                    if(typeof items.process !== 'undefined') {
                        this.$state.process = items.process;
                    }
                    if(typeof items.activities !== 'undefined') {
                        this.$state.activities = items.activities;
                    }
                    break;
                case this.ACTIVITY_FORM:
                    if(typeof items.step !== 'undefined') {
                        this.$state.step = items.step;
                    }
                    break;
                default:
                    break;
            }
        },
        get(type) {
            return this.$state[type];
        },
        getID(type) {
            return this.$state[type] !== null ? this.$state[type].id : 0;
        },
        reset(type) {
            this.$state[type] = null;

            switch (type) {
                case this.CATEGORY_FORM:
                    this.$state.processes = null;
                    break;
                case this.PROCESS_FORM:
                    this.$state.steps = null;
                    break;
                case this.STEP_FORM:
                    this.$state.activities = null;
                    break;
                default:
                    break;
            }
        },
        setActiveForm(_form) {
            this.activeForm = _form;
            this.getForm(_form).clear();
        },
        getForm(form) {
            return this.forms[form];
        }
    },
    getters: {
        isSet(type) {
            return this.$state[type] !== null;
        },
        getActiveForm() {
            return this.activeForm;
        },
        CATEGORY_FORM: () => _CATEGORY_FORM,
        PROCESS_FORM: () => _PROCESS_FORM,
        STEP_FORM: () => _STEP_FORM,
        ACTIVITY_FORM: () => _ACTIVITY_FORM,
    }
});