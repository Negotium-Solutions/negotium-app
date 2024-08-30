import { defineStore } from 'pinia';
import axios from "axios";
import { ApiHelper, FunctionsHelper } from "@/helpers/index.js";
import { usePage } from "@inertiajs/vue3";
import { computed } from "vue";

const page = usePage();
const user = computed(() => page.props.auth.user);
const messages = computed(() => page.props.messages);
const apiURL = computed(() => page.props.negotium_api_url);

export const useProfileNoteStore = defineStore({
    id: 'profile-notes',
    state: () => ({
        show_add_note: false,
        note: {
            'subject': '',
            'note': '',
            'profile_id': '',
            'reminder_date': '',
            'reminder_time': ''
        },
        loading: false,
        status: {
            loading: false
        },
        apiUrl: apiURL.value,
        user: user.value,
        tenant: user.value.tenant,
        end_point: 'note',
        response: {
            'code': 0,
            'status': '',
            'message': '',
            'errors': [],
            'data': []
        },
        apiHelper: new ApiHelper('note')
    }),
    actions: {
        async create(toast)
        {
            this.loading = true;
            if(this.note.subject === '' || this.note.note === '') {
                toast.add({ severity: 'error', detail: messages.value.error.input_validation_error, life: 3000 });
                this.loading = false;
                return false;
            }

            await this.apiHelper.create(this.note);
            this.apiHelper.isDoneLoading(null, () => {
                let removeProcessVariables = {
                    'note': this.note.reminder_date === '' || this.note.reminder_time === '' ? 'Note' : 'Reminder',
                    'noteHeading': this.note.subject
                };
                const response = this.apiHelper.response;
                if (parseInt(response.code) === 201) {
                    toast.add({ severity: 'success', detail: FunctionsHelper.replaceTextVariables(messages.value.note.success_adding_note, removeProcessVariables), life: 3000 });
                    setTimeout(() => {
                        this.loading = false;
                        location.reload();
                    }, 3000)
                }

                if (parseInt(response.code) === 422) {
                    // ToDo: Handle errors
                }
            });
        },
        async delete(item, toast)
        {
            this.loading = true;
            await this.apiHelper.delete(item);
            this.apiHelper.isDoneLoading(null, () => {
                let removeProcessVariables = {
                    'note': item.reminder_datetime === null ? 'Note' : 'Reminder',
                    'noteHeading': item.subject
                };
                const response = this.apiHelper.response;
                if (parseInt(response.code) === 204) {
                    toast.add({ severity: 'success', detail: FunctionsHelper.replaceTextVariables(messages.value.note.success_removing_note, removeProcessVariables), life: 3000 });
                    setTimeout(() => {
                        this.loading = false;
                        location.reload();
                    }, 3000)
                }
            });
        },
        showNoteConfirmation(toast, confirm, note)
        {
            let removeProcessVariables = {
                'note': note.reminder_datetime === null ? 'Note' : 'Reminder',
                'noteHeading': note.subject
            };

            confirm.require({
                header: 'Note Confirmation',
                message: FunctionsHelper.replaceTextVariables(messages.value.note.remove_note_confirmation, removeProcessVariables),
                acceptLabel: 'Yes, Remove',
                acceptClass: 'btn btn-sm btn-default mr-2',
                rejectLabel: 'Cancel',
                rejectClass: 'btn btn-sm btn-default mr-2',
                rejectProps: {
                    label: 'Cancel',
                    severity: 'secondary',
                    outlined: true
                },
                acceptProps: {
                    label: 'Save'
                },
                accept: () => {
                    try {
                        this.delete(note, toast);
                    } catch (error) {
                        console.log('error', error);
                        toast.add({ severity: 'error', detail: FunctionsHelper.replaceTextVariables(messages.value.note.error_removing_note, removeProcessVariables), life: 3000 });
                    }
                },
                reject: () => {
                    // Do nothing
                }
            });
        },
        showAddNote(profile_id, note = null) {
            this.show_add_note = true;
            this.note.profile_id = profile_id;

            if ( note !== null) {
                this.note = note;
            }
        },
        resetResponse() {
            this.response = {
                'status': '',
                'message': '',
                'errors': [],
                'data': []
            }
        },
        setResponse(code, status, message, errors, data) {
            this.response = {
                'code': code,
                'status': status,
                'message': message,
                'errors': errors,
                'data': data
            }
        }
    },
    getters: {

    }
});