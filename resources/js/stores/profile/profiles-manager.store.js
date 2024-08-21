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
        },
        handleProfileDivHeight(){
            let windowHeight = window.innerHeight,
                profileDetailContent = document.getElementById('profiles-detail-content'),
                profilesContent = document.getElementById('profiles-content'),
                profilesSidebar = document.getElementById('profiles-sidebar'),
                profilesDetail = document.getElementById('profiles-detail'),
                profilesHeader = document.getElementById('profiles-header'),
                height = profilesHeader.offsetHeight,
                newHeight = windowHeight -  height;
            profilesContent.style.minHeight = newHeight+'px'
            profilesSidebar.style.minHeight = newHeight+'px'
            profilesDetail.style.minHeight = newHeight+'px'
            if(profileDetailContent){
                profileDetailContent.style.minHeight = newHeight+'px'
            }
        },
        handleProfileMenuDivHeight(){
            const w = window.innerWidth;
            const h = window.innerHeight;
            let profileViewMenu = document.getElementById('profile-view-menu'),
                clientViewMenu = document.getElementById('client-view-menu');
            if(profileViewMenu){
                let clientViewMenuWidth = profileViewMenu.offsetWidth
                if(h > 835){
                    clientViewMenu.style.position = 'fixed'
                    clientViewMenu.style.bottom = '1.5rem'
                    if(clientViewMenuWidth > 0){
                        clientViewMenu.style.width = clientViewMenuWidth+'px'
                    }
                } else {
                    clientViewMenu.style.position = null
                    clientViewMenu.style.bottom = null
                    if(clientViewMenuWidth > 0){
                        clientViewMenu.style.width = clientViewMenuWidth+'px'
                    }
                }
            }
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