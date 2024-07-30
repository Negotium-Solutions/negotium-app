import { defineStore } from 'pinia';

export const useMessagesStore = defineStore({
    id: 'messages',
    state: () => ({
        messages: []
    }),
    actions: {
        init(messages) {
            this.messages = messages;
        }
    },
    getters: {
        get(path) {
            return this.$state.messages[path];
        }
    }
});