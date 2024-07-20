import { defineStore } from 'pinia';
// import { functionsHelper, formsHelper } from '../helpers';

const _PROFILE_TYPE = 'profile_type';
const _PROFILE = 'profile';
const _PROFILES = 'profiles';
// const functionHelper = new functionsHelper();
export const useProfilesManagerStore = defineStore({
    id: 'profiles_manager',
    state: () => ({
        // Collections and models
        profile_types: null,
        profile_type: {},
        profiles: null,
        profile: {},
        processes: null,
        process: {},
        // Other state values
        /*
        activeForm: _PROFILE_TYPE_FORM,
        forms: {
            profile: new formsHelper({})
        }
        */
    }),
    actions: {
        set(type, items) {
            this.$state[type] = items;

            switch (type) {
                case this.PROFILE_TYPE:
                    if(typeof items.profiles !== 'undefined') {
                        this.$state.profiles = items.profiles;
                    }
                    break;
                case this.PROFILE:
                    if(typeof items.processes !== 'undefined') {
                        this.$state.processes = items.processes;
                    }
                    break;
                default:
                    break;
            }
        },
        get(type) {
            return this.$state[type];
        },
        reset(type) {
            this.$state[type] = null;

            switch (type) {
                case this.PROFILE:
                    this.$state.profiles = null;
                    break;
                default:
                    break;
            }
        },
        isSelected(type, item) {
            if(this.$state[type].hasOwnProperty('id')) {
                return this.$state[type].id === item.id;
            }
            return false;
        },
        /*
        setActiveForm(_form) {
            this.activeForm = _form;
            this.getForm(_form).clear();
        },
        getForm(form) {
            return this.forms[form];
        }
        */
    },
    getters: {
        isSet(type) {
            return this.$state[type] !== null;
        },
        /*
        getActiveForm() {
            return this.activeForm;
        },
        */
        PROFILE_TYPE: () => _PROFILE_TYPE,
        PROFILES: () => _PROFILES,
        PROFILE: () => _PROFILE
    }
});