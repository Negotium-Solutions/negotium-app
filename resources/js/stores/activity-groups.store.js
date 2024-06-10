import { defineStore } from 'pinia';

export const useActivityGroupsStore = defineStore({
    id: 'activity_groups',
    state: () => ({
        activity_groups: {},
        activity_group: 1,
        activity_type: 1
    }),
    actions: {
        setActivityGroups(activity_groups) {
            this.activity_groups = activity_groups;
        },
        setActivityGroup(id) {
            this.activity_group = id;
            this.activity_type = this.getActivityTypesByActivityGroup[0].id;
        },
        setActivityType(id) {
            this.activity_type = id;
        }
    },
    getters: {
        getActivityGroups() {
            return this.activity_groups;
        },
        getActivityTypesByActivityGroup() {
            return this.activity_groups.filter((item) => item.id === this.activity_group)[0].activity_types;
        },
        getActivityGroup() {
            return this.activity_group;
        },
        getActivityType() {
            return this.activity_type;
        }
    }
});