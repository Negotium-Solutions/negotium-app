import { defineStore } from 'pinia';
import { ApiHelper } from "@/helpers";
import { usePage } from "@inertiajs/vue3";
import { computed } from "vue";

const page = usePage();
const messages = computed(() => page.props.messages);

export const useProcessManagerStore = defineStore({
    id: 'process_manager',
    state: () => ({
        showAddActivity: false,
        loading: false,
        selectedOption: "d",
        activityOptionInput: null,
        activity: {
            name: null,
            type_id: null,
            validations: [],
            options: []
        },
        activityErrors: null,
        sortByOptions: [
            { name: 'Latest First', code: 'd' },
            { name: 'Oldest First', code: 'a' },
            { name: 'Process', code: 'p' },
            { name: 'Steps', code: 's' },
            { name: 'Activities', code: 'l' }
        ],
        selectedCategory: 0,
        selected_categories: [0],
        process: {
            id: null,
            name: null,
            dynamic_model_category_id: null
        },
        dynamicModelFieldTypeGroups: null,
        dynamicModelFieldTypeGroup: 1,
        dynamicModelFieldType: 1,
        processErrors: null,
        processes: null,
        step: {
            id: null,
            name: null,
            schema_id: null,
            order: null
        },
        stepErrors: null,
        category: {
            id: null,
            name: null
        },
        categoryErrors: null,
        lookup: {
            categories: null
        },
        apiHelper: null,
        guidanceNoteAction: '+Add guidance note',
        guidanceNote: '',
        showInput: false,
    }),
    actions: {
        async createCategory(toast) {
            this.apiHelper = new ApiHelper('process-category');
            this.loading = true;
            this.categoryErrors = null;
            await this.apiHelper.create(this.category);
            this.apiHelper.isDoneLoading(null, () => {
                const response = this.apiHelper.response;
                if (parseInt(response.code) === 201) {
                    this.category.id = response.data.data.id;
                    this.category.color = response.data.data.color;
                    this.lookup.categories.push(this.category);
                    this.selectedCategory = this.category;
                    this.loading = false;
                    toast.add({ severity: 'success', detail: response.message, life: 3000 });
                    return true;
                }

                if (parseInt(response.code) === 422) {
                    this.categoryErrors = response.errors;
                    toast.add({ severity: 'error', detail: messages.value.error.input_validation_error, life: 3000 });
                    this.loading = false;
                } else {
                    toast.add({ severity: 'error', detail: response.message, life: 3000 });
                    this.loading = false;
                }
            });
        },
        async createProcess(toast) {
            this.apiHelper = new ApiHelper('process');
            this.loading = true;
            this.processErrors = null;
            this.process.dynamic_model_category_id = this.selectedCategory !== null ? this.selectedCategory.id : null;
            await this.apiHelper.create(this.process);
            this.apiHelper.isDoneLoading(null, () => {
                const response = this.apiHelper.response;
                if (parseInt(response.code) === 201) {
                    toast.add({ severity: 'success', detail: response.message, life: 3000 });
                    setTimeout(() => {
                        this.loading = false;
                        window.location.href = '/process-manager/edit/'+response.data.data.id;
                    }, 3000)
                    return true;
                }

                if (parseInt(response.code) === 422) {
                    this.processErrors = response.errors;
                    toast.add({ severity: 'error', detail: messages.value.error.input_validation_error, life: 3000 });
                    this.loading = false;
                } else {
                    toast.add({ severity: 'error', detail: response.message, life: 3000 });
                    this.loading = false;
                }
            });
        },
        async createStep(toast) {
            this.apiHelper = new ApiHelper('step');
            this.loading = true;
            this.stepErrors = null;
            this.step.schema_id = this.process.id;
            await this.apiHelper.create(this.step);
            this.apiHelper.isDoneLoading(null, () => {
                const response = this.apiHelper.response;

                switch (parseInt(response.code)) {
                    case 201:
                        toast.add({ severity: 'success', detail: response.message, life: 3000 });
                        setTimeout(() => {
                            window.location.href = '/process-manager/edit-activity/'+this.process.id+'/'+response.data.data.id+'?addActivity=true';
                        }, 2000);
                        break;
                    case 422:
                        this.stepErrors = response.errors;
                        toast.add({ severity: 'error', detail: messages.value.error.input_validation_error, life: 3000 });
                        this.loading = false;
                        break;
                    default:
                        toast.add({ severity: 'error', detail: response.message, life: 3000 });
                        this.loading = false;
                        break;
                }
            });
        },
        async createActivity(toast) {
            this.apiHelper = new ApiHelper('dynamic-model-field');
            this.loading = true;
            this.activityErrors = null;
            this.activity.step_id = this.step.id;
            this.activity.dynamic_model_field_type_id = this.dynamicModelFieldType;
            await this.apiHelper.create(this.activity);
            this.apiHelper.isDoneLoading(null, () => {
                const response = this.apiHelper.response;
                switch (parseInt(response.code)) {
                    case 201:
                        toast.add({ severity: 'success', detail: response.message, life: 3000 });
                        setTimeout(() => {
                            location.reload();
                        }, 3000);
                        break;
                    case 422:
                        this.activityErrors = response.errors;
                        toast.add({ severity: 'error', detail: messages.value.error.input_validation_error, life: 3000 });
                        this.loading = false;
                        break;
                    default:
                        toast.add({ severity: 'error', detail: response.message, life: 3000 });
                        this.loading = false;
                        break;
                }
            });
        },
        async showAddActivityModal(toast){
            if(this.step.id === null) {
                await this.createStep(toast);
            } else {
                this.showAddActivity = true;
            }
        },
        async deleteItem(item, tableName, confirm, toast) {
            confirm.require({
                message: 'Are you sure you want to delete this ' + tableName +'?',
                header: 'Warning',
                icon: 'pi pi-info-circle',
                rejectLabel: 'Cancel',
                acceptLabel: 'Delete',
                rejectClass: 'btn-sm btn-outline-light border',
                acceptClass: 'btn-sm btn-danger',
                accept: () => {
                    if (tableName === 'activity')
                        tableName = 'dynamic-model-field';

                    this.apiHelper = new ApiHelper(tableName);

                    this.apiHelper.delete(item);
                    this.apiHelper.isDoneLoading(null, () => {
                        const response = this.apiHelper.response;
                        if (parseInt(response.code) === 204) {
                            toast.add({ severity: 'success', detail: messages.value.error.deleted, life: 3000 });
                            setTimeout(() => {
                                this.loading = false;
                                location.reload();
                            }, 2000)
                        } else {
                            toast.add({severity: 'error', detail: response.data.message, life: 3000});
                            this.loading = false;
                        }
                    });
                },
                reject: () => {
                    toast.add({ severity: 'error', summary: 'Rejected', detail: 'Operation cancelled', life: 3000 });
                }
            });
        },
        onFilter(event) {
            this.category.name = event.value;
        },
        set(key, value) {
            this.$state[key] = value;
        },
        setStep(step_id){
            if(step_id > 0) {
                this.process.groups.forEach((step) => {
                    if(step.id === step_id) {
                        this.step = step;
                    }
                });
            }
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
        resetStep() {
            this.step = {
                id: null,
                name: null,
                parent_id: null,
                order: null
            };
        },
        clearError() {
          this.processErrors = null;
          this.stepErrors = null;
          this.activityErrors = null;
        },
        isSelectedCategory(category_id) {
            return this.selected_categories.some((item) => item === category_id)
        },
        toogleCategory(category_id) {
            if (category_id === 0 || (this.selected_categories.length === 1 && this.selected_categories[0] === 0)) {
                this.selected_categories = [];
                this.selected_categories.push(category_id);
            } else {
                if( this.selected_categories.some((item) => item === category_id) ) {
                    this.selected_categories = this.selected_categories.filter((i) => i !== category_id);
                } else {
                    this.selected_categories.push(category_id);
                }
            }

            if ( this.selected_categories.length === 0) {
                this.selected_categories.push(0);
            }

        },
        handleProcessDivHeight(){
            let windowHeight = window.innerHeight,
                processHeader = document.getElementById('content-header'),
                processContent = document.getElementById('content-body'),
                height = processHeader.offsetHeight,
                newHeight = windowHeight -  height;
                processContent.style.minHeight = newHeight+'px'
                processContent.style.height = newHeight+'px'
                processContent.classList.add('bg-content-body')

            if(processContent){
                processContent.style.minHeight = newHeight+'px'
                processContent.style.height = newHeight+'px'
                processContent.classList.add('bg-content-body')
            }
            const wrapper = document.querySelector('#content-body')
            const wrapperComputedStyle = window.getComputedStyle(wrapper, null)
            let wrapperHeight = wrapper.clientHeight
            wrapperHeight -= parseFloat(wrapperComputedStyle.paddingTop) + parseFloat(wrapperComputedStyle.paddingBottom)
            let processCreatorContent = document.getElementById('process-creator-content')
            processCreatorContent.style.height = wrapperHeight+'px'
            
            let pIo = document.getElementById('project-info-owidth')
            let pI = document.getElementById('project-info-width')
            if(pI && pIo){
                pI.style.minHeight = wrapperHeight+'px'
                pI.style.height = wrapperHeight+'px'
            pI.style.width = pIo.offsetWidth+'px'
            }
        },
        setDynamicModelFieldTypeGroup(id) {
            this.dynamicModelFieldTypeGroup = id;
            this.dynamicModelFieldType = this.getDynamicModelFieldTypeByDynamicModelFieldTypeGroup[0].id;
        },
        setDynamicModelFieldType(id) {
            this.dynamicModelFieldType = id;
        },
        addOption(options) {
            const trimmedInput = this.activityOptionInput.trim();
            options.push(trimmedInput);
            this.activityOptionInput = '';
        },
        removeOption(options, index) {
            options.splice(index, 1);
        },
        toggleGuidanceNote() {
            this.showInput = !this.showInput;
            this.guidanceNoteAction = this.showInput ? 'Remove guidance note' : '+Add guidance note'; // Change anchor text
        },
    },
    getters: {
        filterByCategory(state) {
            if(state.selected_categories.some((item) => item === 0)) {
                return this.processes;
            }

            return this.processes.filter((item) => state.selected_categories.indexOf(item.dynamic_model_category_id) >= 0);
        },
        getDynamicModelFieldTypeGroups() {
            return this.dynamicModelFieldTypeGroups;
        },
        getDynamicModelFieldTypeByDynamicModelFieldTypeGroup() {
            return this.dynamicModelFieldTypeGroups.filter((item) => item.id === this.dynamicModelFieldTypeGroup)[0].field_types;
        },
        getDynamicModelFieldTypeGroup() {
            return this.dynamicModelFieldTypeGroup;
        },
        getDynamicModelFieldType() {
            return this.dynamicModelFieldType;
        }
    }
});