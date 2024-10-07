import { defineStore } from 'pinia';
import axios from "axios";
import { ApiHelper, FunctionsHelper } from "@/helpers/index.js";
import { usePage } from "@inertiajs/vue3";
import { computed } from "vue";

const page = usePage();
const user = computed(() => page.props.auth.user);
const messages = computed(() => page.props.messages);
const apiURL = computed(() => page.props.negotium_api_url);

export const useProfileCreatorManager = defineStore({
    id: 'profile-creator-manager',
    state: () => ({
        profileCategories: null,
        profileCategory: null,
        profiles: null,
        // This is the schema table on the API
        profile: {
            id: null,
            name: null,
            table_name: null,
            dynamic_model_category_id: null,
            dynamic_model_type_id: 1, // Type Profile is 1
            quick_capture: 'No',
            status: null,
            steps: []
        },
        createProfileErrors: null,
        loading: false,
        status: {
            loading: false
        },
        apiUrl: apiURL.value,
        user: user.value,
        tenant: user.value.tenant,
        end_point: 'document',
        lookup: {
        },
        apiHelper: new ApiHelper('profile-execution')
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
        isSet(key, value) {
            if ( this.$state[key] === null ) {
                return false;
            }

            if (this.$state[key].hasOwnProperty('id')) {
                return this.$state[key].id === value.id;
            }
            return false;
        },
        async deleteProfile(profile, toast) {
            this.apiHelper = new ApiHelper('schema')

            this.loading = true;

            await this.apiHelper.delete(this.profile);
            this.apiHelper.isDoneLoading(null, () => {
                let placeholderVariables = {
                    'profileName': this.profile.name
                };
                const response = this.apiHelper.response;

                switch (parseInt(response.code)) {
                    case 204:
                        toast.add({ severity: 'success', detail: FunctionsHelper.replaceTextVariables(messages.value.profile_creator.profile_success, placeholderVariables), life: 3000 });
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                        break;
                    default:
                        toast.add({ severity: 'error', detail: FunctionsHelper.replaceTextVariables(messages.value.profile_creator.profile_error, placeholderVariables), life: 3000 });
                        break;
                }
            });
        },
        async create(toast) {
            this.apiHelper = new ApiHelper('schema');

            this.loading = true;

            await this.apiHelper.create(this.profile);
            this.apiHelper.isDoneLoading(null, () => {
                let placeholderVariables = {
                    'profileName': this.profile.name
                };
                const response = this.apiHelper.response;

                switch (parseInt(response.code)) {
                    case 201:
                        toast.add({ severity: 'success', detail: FunctionsHelper.replaceTextVariables(messages.value.profile_creator.create_profile_success, placeholderVariables), life: 3000 });
                        this.createProfileErrors = null;
                        setTimeout(() => {
                            const currentUrl = window.location.href;
                            const partToRemove = '/edit';
                            const index = currentUrl.indexOf(partToRemove);
                            window.location.href = '/profile-creation/edit/'+response.data.data.id;
                        }, 3000);
                        break;
                    case 422:
                        this.createProfileErrors = response.errors;
                        toast.add({ severity: 'error', detail: messages.value.error.input_validation_error, life: 3000 });
                        this.loading = false;
                        break;
                    default:
                        this.profileProcessFieldsErrors = null;
                        toast.add({ severity: 'error', detail: response.message, life: 3000 });
                        this.loading = false;
                        break;
                }
            });
        },
        addSection(section) {
            this.profile.steps.push(section);
            this.profileCategory.templates = this.profileCategory.templates.filter((template) => section.id !== template.id);
        },
        removeSection(section) {
            this.profileCategory.templates.push(section);
            this.profile.steps = this.profile.steps.filter((template) => section.id !== template.id);
        },
        showRemoveProfileConfirmation(toast, confirm, profile)
        {
            let placeholderVariables = {
                'profileName': profile.name
            };

            confirm.require({
                header: 'Confirm profile removal',
                message: FunctionsHelper.replaceTextVariables(messages.value.profile_creator.remove_profile_confirmation, placeholderVariables),
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
                        this.deleteProfile(profile, toast);
                    } catch (error) {
                        toast.add({ severity: 'error', detail: FunctionsHelper.replaceTextVariables(messages.value.profile_creator.profile_success, placeholderVariables), life: 3000 });
                    }
                },
                reject: () => {
                    // Do nothing
                }
            });
        },
        setQuickCapture(value) {
            this.profile.quick_capture = value;
        }
    },
    getters: {

    }
});