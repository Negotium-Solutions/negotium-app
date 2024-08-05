import { defineStore } from 'pinia';

const _PROFILE_TYPE = 'profile_type';
const _PROFILE = 'profile';
const _PROFILES = 'profiles';
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
    }),
    actions: {
        set(type, items) {
            this.$state[type] = items;

            switch (type) {
                case this.PROFILE_TYPE:
                    if(typeof items.profiles !== 'undefined') {
                        this.$state.profiles = items.profiles;
                        this.$state.profile = items.profiles[0];
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
        }
    },
    getters: {
        isSet(type) {
            return this.$state[type] !== null;
        },
        getRemoveProcessVariables() {
          return {
              'processName': this.process.name,
              'profileName': this.profile.company_name !== null ? this.profile.company_name : this.profile.first_name + ' ' + this.profile.last_name
          }
        },
        PROFILE_TYPE: () => _PROFILE_TYPE,
        PROFILES: () => _PROFILES,
        PROFILE: () => _PROFILE
    }
});