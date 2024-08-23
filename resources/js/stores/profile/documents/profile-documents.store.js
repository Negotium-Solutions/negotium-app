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
        document: {
            'name': '',
            'type': '',
            'path': '',
            'size': '',
            'user_email': user.value.email,
            'profile_id': ''
        },
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
        setLookUp(key, value) {
            this.$state['lookup'][key] = value;
        },
        downloadDocument(url) {
            const link = document.createElement('a');
            link.href = url;
            //link.download = url.split('/').pop(); // Extracts the file name from the URL
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