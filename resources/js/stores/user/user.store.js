import { defineStore } from 'pinia';
import axios from "axios";

// Set the Axios default header to include the CSRF token
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

export const useUsersStore = defineStore({
    id: 'users',
    state: () => ({
        csrf_token: document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
    }),
    actions: {
        logout() {
            console.log('csrf_token: ', this.csrf_token);
            axios.post(route('logout'), {}, {
                headers: {
                    'X-CSRF-TOKEN': this.csrf_token,
                }
            });
        }
    },
    getters: {
        //
    }
});