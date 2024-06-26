import { defineStore } from 'pinia';

export const useActivityGroupsStore = defineStore({
    id: 'activity_groups',
    state: () => ({
        activity_groups: {},
        activity_group: {
            id: 0,
            name: ''
        },
        activity_type: {
            id: 0,
            name: ''
        }
    }),
    actions: {
        setActivityGroups(activity_groups) {
            this.activity_groups = activity_groups;
        },
        setActivityGroup(activity_group) {
            this.activity_group = activity_group;
            this.resetActivityType();
        },
        getActivityGroup() {
            return this.activity_group;
        },
        setActivityType(activity_type) {
            this.activity_type = activity_type;
        },
        getActivityType(){
            return this.activity_type;
        },
        getActivityGroups() {
            return this.activity_groups;
        },
        getActivityTypesByActivityGroup() {
            return this.activity_groups.filter((item) => item.id === this.activity_group.id)[0].activity_types;
        },
        resetActivityGroup() {
            this.activity_group = {
                id: 0,
                    name: ''
            }
        },
        resetActivityType() {
            this.activity_type = {
                id: 0,
                    name: ''
            }
        }
    },
    getters: {
        isSetActivityGroup() {
            return this.activity_group.id > 0;
        },
        isSetActivityType() {
            return this.activity_type.id > 0;
        }
    }
});