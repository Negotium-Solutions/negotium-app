import { defineStore } from 'pinia';

export const useProfilesManagerStore = defineStore({
    id: 'profiles_manager',
    state: () => ({
        // Collections and models
        apiUrl: '',
        apiImagesUrl: '',
        navigation: '',
        profileTypes: null,
        profileType: {},
        profiles: null,
        profile: {},
        processes: null,
        process: {},
        selected_categories: [],
        lookup: {
            profileManagerStore: null,
            processes: null
        }
    }),
    actions: {
        set(key, value) {
            this.$state[key] = value;
        },
        get(key) {
            return this.$state[key];
        },
        setLookUp(key, value) {
            this.$state['lookup'][key] = value;
        },
        reset(key) {
            this.$state[key] = null;
        },
        isSelected(key, value) {
            if(this.$state[key].hasOwnProperty('id')) {
                return this.$state[key].id === value.id;
            }
            return false;
        },
        getProfileName(profile) {
            return parseInt(profile.profile_type_id) === 1 ? profile.first_name+' '+profile.last_name : profile.company_name;
        },
        isSelectedCategory(category_id) {
            return this.selected_categories.some((item) => item === category_id)
        },
        toogleCategory(category_id) {
            if(category_id === 0 || (this.selected_categories.length === 1 && this.selected_categories[0] === 0)) {
                this.selected_categories = [];
                this.selected_categories.push(category_id);
            } else {
                if( this.selected_categories.some((item) => item === category_id) ) {
                    this.selected_categories = this.selected_categories.filter((i) => i !== category_id);
                } else {
                    this.selected_categories.push(category_id);
                }
            }
        },
        setProfileData(props) {
            // Get selected profile type
            const profileType = props.profileTypes.filter((item) => parseInt(item.id) === parseInt(props.profileTypeId))[0];
            this.set('profileTypes', props.profileTypes);
            this.set('profileType', profileType);
            this.set('profiles', profileType.profiles);
            this.set('profile', props.profile);
            this.set('processes', props.profile.processes);
            this.set('apiUrl', props.apiUrl);
            this.set('apiImagesUrl', props.apiImagesUrl);
            this.set('navigation', props.navigation);
            this.setLookUp('processes', props.lookup.processes);
            this.setLookUp('processCategories', props.lookup.processCategories);
        }
    },
    getters: {
        isSet(type) {
            return this.$state[type] !== null;
        },
        getRemoveProcessVariables() {
          return {
              'processName': this.process.name,
              'profileName': parseInt(this.profile.profile_type_id) !== 1 ? this.profile.company_name : this.profile.first_name + ' ' + this.profile.last_name
          }
        },
        PROFILE_TYPE: () => 'profileType',
        PROFILES: () => 'profile',
        PROFILE: () => 'profiles',
        NAVIGATION_PROCESSES: () => 'processes'
    }
});