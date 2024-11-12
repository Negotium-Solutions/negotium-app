import { defineStore } from 'pinia';
import axios from "axios";
import { ApiHelper, FunctionsHelper } from "@/helpers/index.js";
import { usePage } from "@inertiajs/vue3";
import { computed } from "vue";

const page = usePage();
const user = computed(() => page.props.auth.user);
const messages = computed(() => page.props.messages);
const apiURL = computed(() => page.props.negotium_api_url);

export const useProfileDocumentStore = defineStore({
    id: 'profile-documents',
    state: () => ({
        show_document_upload: false,
        document: {
            name: '',
            type: null,
            profile_id: null,
            files: null
        },
        documentErrors: null,
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
        response: {
            'code': 0,
            'status': '',
            'message': '',
            'errors': [],
            'data': []
        },
        apiHelper: new ApiHelper('document')
    }),
    actions: {
        async create(toast, profile)
        {
            this.loading = true;

            this.document.profile_id = profile.id;
            const formData = new FormData();
            formData.append('name', this.document.name);
            formData.append('profile_id', this.document.profile_id);
            for (let file of this.document.files) {
                formData.append('files[]', file);
            }

            await this.apiHelper.create(formData);
            this.apiHelper.isDoneLoading(null, () => {
                let removeProcessVariables = {
                    'profileName': profile.profile_name
                };
                const response = this.apiHelper.response;

                if (parseInt(response.code) === 201) {
                    toast.add({ severity: 'success', detail: FunctionsHelper.replaceTextVariables(messages.value.document.success_uploading_document, removeProcessVariables), life: 3000 });
                    setTimeout(() => {
                        this.loading = false;
                        location.reload();
                    }, 3000)
                } else if (parseInt(response.code) === 422) {
                    this.documentErrors = response.errors;
                    this.loading = false;
                } else {
                    toast.add({ severity: 'error', detail: response.message, life: 3000 });
                    this.loading = false;
                }
            });
        },
        setLookUp(key, value) {
            this.$state['lookup'][key] = value;
        },
        viewDocument(document) {
            window.open(document.path, '_blank'); // Open the document in a new tab
        },
        async deleteDocument(document, toast) {
            this.loading = true;

            await this.apiHelper.delete(document);
            this.apiHelper.isDoneLoading(null, () => {
                let removeVariables = {
                    'documentName': document.name
                };
                const response = this.apiHelper.response;

                if (parseInt(response.code) === 204) {
                    toast.add({ severity: 'success', detail: FunctionsHelper.replaceTextVariables(messages.value.document.success_delete_document, removeVariables), life: 3000 });
                    setTimeout(() => {
                        this.loading = false;
                        location.reload();
                    }, 3000)
                } else {
                    toast.add({ severity: 'error', detail: response.message, life: 3000 });
                    this.loading = false;
                }
            });
        },
        downloadDocument(path) {
            const link = document.createElement('a');
            link.href = path;
            link.download = path.split('/').pop(); // Extracts the file name from the URL
            link.click();
        },
        getIconByDocumentType(documentType){
            switch (documentType) {
                case 'pdf':
                    return 'pi pi-file-pdf';
                case 'doc':
                case 'docx':
                    return 'pi pi-file-word';
                case 'ppt':
                case 'pptx':
                    return 'pi pi-file-powerpoint';
                case 'xlsx':
                case 'xls':
                    return 'pi pi-file-excel';
                case 'jpg':
                case 'jpeg':
                case 'png':
                    return 'pi pi-file-image';
                case 'txt':
                    return 'pi pi-file-text';
                case 'zip':
                    return 'pi pi-file-zip';
                default:
                    return 'pi pi-file'; // Default icon
            }
        },
        onFileSelect(event) {
            this.document.files = event.files;
        },
        resetDocument() {
            this.document = {
                name: '',
                type: null,
                profile_id: null,
                file: null
            };
        },
        showDocumentConfirmation(toast, confirm, document)
        {
            let removeVariables = {
                'documentName': document.name
            };

            confirm.require({
                header: 'Process Confirmation',
                message: FunctionsHelper.replaceTextVariables(messages.value.document.delete_document_confirmation, removeVariables),
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
                        this.deleteDocument(document, toast);
                    } catch (error) {
                        toast.add({ severity: 'error', detail: FunctionsHelper.replaceTextVariables(messages.value.document.error_delete_document, removeVariables), life: 3000 });
                    }
                },
                reject: () => {
                    // Do nothing
                }
            });
        }
    },
    getters: {
        isValidForm() {
            return this.document.name !== '' && this.document.files !== null;
        }
    }
});