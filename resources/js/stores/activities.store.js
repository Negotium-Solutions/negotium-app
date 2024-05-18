import { defineStore } from 'pinia';

export const useActivitiesStore = defineStore({
    id: 'activities',
    state: () => ({
        /** @type {{ name: string, title: string, type: string, attributes: [] }[]} */
        activities: {},
        activity: {},
        isLoaded: false,
    }),
    actions: {
        add(activity){
            this.activities.push(activity);
        },
        setActivities(activities) {
            this.activities = activities;
            // this.isLoaded = true;
        },
        getAll() {
            return this.activities;
        },
        getById(id) {
            this.activities.find(x => x.id === id);
        },
        update(id, activity) {
            this.activities[id] = activity;
        },
        delete(id) {
            // add isDeleting prop to user being deleted
            this.activities.find(x => x.id === id).isDeleting = true;

            // remove activity from list after deleted
            this.activities = this.activities.filter(x => x.id !== id);
        }
    },
    getters: {
        // TODO: Add functionality similar to computed state
        isLoaded() {
            return this.isLoaded;
        }
    }
});