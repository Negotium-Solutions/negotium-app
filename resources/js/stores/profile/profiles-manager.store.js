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
        selected_categories: [0],
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
            if (this.selected_categories.length === 0) {
                this.selected_categories.push(0)
            }
        },
        setProfileData(props) {
            // Get selected profile type
            const profileType = props.profileTypes.filter((item) => parseInt(item.id) === parseInt(props.profileTypeId))[0];
            this.set('profileTypes', props.profileTypes);
            this.set('profileType', profileType);
            this.set('profiles', profileType.profiles);
            this.set('profile', props.profile);
            this.set('apiUrl', props.apiUrl);
            this.set('apiImagesUrl', props.apiImagesUrl);
            this.set('navigation', props.navigation);
        },
        handleProfileDivHeight(){
            let windowHeight = window.innerHeight,
                profileDetailContent = document.getElementById('profiles-detail-content'),
                profilesContent = document.getElementById('profiles-content'),
                profilesSidebar = document.getElementById('profiles-sidebar'),
                profilesDetail = document.getElementById('profiles-detail'),
                profilesHeader = document.getElementById('profiles-header'),
                navContent = document.getElementById('profile-nav-content');
                let height = profilesHeader.offsetHeight;
                // Get padding values
let styles = window.getComputedStyle(profilesHeader);
let paddingTop = parseFloat(styles.paddingTop);
let paddingBottom = parseFloat(styles.paddingBottom);

                let newHeight = windowHeight - paddingBottom - paddingTop -  height - 40;
                console.log(newHeight)
                profilesContent.style.minHeight = newHeight+'px'
                profilesSidebar.style.minHeight = newHeight+'px'
                profilesDetail.style.minHeight = newHeight+'px'
            profilesContent.style.height = newHeight+'px'
            profilesContent.style.overflow = 'auto'
            
            navContent.style.height = newHeight+'px'
            navContent.style.paddingBottom = '75px'
            navContent.style.overflow = 'auto'
            profilesSidebar.style.height = newHeight+'px'
            profilesSidebar.style.overflow = 'hidden'
            profilesDetail.style.height = newHeight+'px'
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
        },
        getRecentProcesses(processes, order = 'asc', maximum = null) {
            if(maximum === null) {
                return processes.sort((a, b) => new Date(a.log.updated_at) - new Date(b.log.updated_at));
            }

            let _processes = [];
            if(order === 'asc') {
                _processes = processes.sort((a, b) => new Date(a.log.updated_at) - new Date(b.log.updated_at)).slice(0, maximum);
            } else {
                _processes = processes.sort((a, b) => new Date(b.log.updated_at) - new Date(a.log.updated_at)).slice(0, maximum);
            }

            return _processes;
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
        filterByCategoryExcluding() {
            let assigned_processes_array = [];
            this.profile.processes.forEach((process) => {
                assigned_processes_array.push(process.id);
            });

            if(this.selected_categories.some((item) => item === 0)) {
                return this.lookup.processes.filter((item) => !assigned_processes_array.includes(item.id));
            }

            return this.lookup.processes.filter((item) => this.selected_categories.indexOf(item.process_category_id) >= 0 && !assigned_processes_array.includes(item.id));
        },
        PROFILE_TYPE: () => 'profileType',
        PROFILES: () => 'profile',
        PROFILE: () => 'profiles',
        NAVIGATION_PROCESSES: () => 'processes',
    }
});