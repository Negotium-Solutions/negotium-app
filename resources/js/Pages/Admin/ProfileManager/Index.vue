<script setup>
import { AuthenticatedLayout } from "@/Layouts/Adminlte";
import { computed, reactive } from "vue";
import axios from "axios";
import { router, usePage } from "@inertiajs/vue3";
import { useToastr } from "@/toastr.js";

defineProps({
  profileTypes: {
    type: Array,
  }
});

const toastr = useToastr();
const page = usePage();
const user = computed(() => page.props.auth.user);
const negotium_api_url = computed(() => page.props.negotium_api_url);
const pageProps = reactive({
  isEdit: false,
  activeProfile: Object,
  pendingChanges: false
});
const form = reactive({
  name: '',
  activityType: 0,
  inputType: 0,
  activityName: '',
  activityLabel: ''
});
const activityForm = reactive({
  name: form.name,
  title: form.activityLabel,
  type: "text",
  attributes: {
    indent: 0,
    is_id: 0,
    is_passport: 0,
    required: 0
  }
});

function editProfileType(index)
{
  pageProps.isEdit = true;
  pageProps.activeProfile = page.props.profileTypes[index];
  form.name = pageProps.activeProfile.name;
  resetProfileType();
}

function deleteProfileType(id)
{
  axios.delete(negotium_api_url.value+'/'+user.value.tenant+'/client-type/delete/'+id, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ` + user.value.token,
    },
  }).then((response) => {
    console.log(response);
    if (response.status === 204) {
      toastr.success('Item successfully deleted.');
      router.get('/profile-manager');
    }
  })
  .catch( (error) => {
    toastr.error(error.response.status+': '+error.response.statusText);
  });
}

function deleteActvity(index)
{
  let _activity = [];
  let counter = 0;
  pageProps.activeProfile.schema.columns.forEach((activity, ind) => {
    if(index !== ind) {
      _activity[counter] = pageProps.activeProfile.schema.columns[ind];
      counter++;
    }
  });
  pageProps.activeProfile.schema.columns = _activity;
  pageProps.pendingChanges = true;
}

function selectActivityType(id) {
  form.activityType = id;
}

function inputType(id) {
  form.inputType = id;
}

function resetProfileType()
{
  form.activityType = 0;
  form.inputType = 0;
  form.activityName = '';
  form.activityLabel = '';
}

function isValidProfileTypeForm()
{
  return (form.name !== '') && (form.activityType > 0) && (form.inputType > 0) && (form.activityName !== '') && (form.activityLabel !== '');
}

function addActivity()
{
  pageProps.activeProfile.schema.columns.push(activityForm);
  pageProps.pendingChanges = true;
}

window.onbeforeunload = function() {
  return pageProps.pendingChanges ? "You have pending changes, are you sure you want to navigate away from this form" : null;
}

</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <div class="col-sm-6">
        <h1 class="m-0">Profile Manager</h1>
        <ol class="breadcrumb sm">
          <li class="breadcrumb-item"><a href="#">Home</a></li>
          <li class="breadcrumb-item active">Profile Manager</li>
        </ol>
      </div><!-- /.col -->
      <div class="col-sm-6 text-right pt-2">
        <a v-if="pageProps.isEdit" :href="route('profile-manager')" class="btn btn-sm btn-cs-light mr-2">Cancel</a>
        <a v-if="pageProps.isEdit" :href="route('document.create')" class="btn btn-sm btn-cs-dark">Save</a>
      </div><!-- /.col -->
    </template>

    <div class="row content-container">
      <div class="card col-md-2">
        <div class="card-header">
          <span class="left-heading">Profile Type</span>
        </div>
        <div class="card-body table-responsive table-hover">
          <div v-for="(profileType, index) in profileTypes" v-on:click="editProfileType(index)" class="row profile-types" :class="{ 'is-edit-profile': pageProps.activeProfile.id === profileType.id }">
            <div class="col-md-8">
              {{ profileType.name }}
            </div>
            <div class="col-md-4 text-right align-middle">
              <a v-on:click="deleteProfileType(profileType.id)"><small><i class="fa fa-trash delete-icon"></i></small></a>
            </div>
          </div>
        </div>
      </div>

      <hr class="col-md-1 mt-4 hr-middle" v-if="pageProps.isEdit" />

      <div class="card col-md-3" v-if="pageProps.isEdit">
        <div class="card-header">
          <p class="left-heading">{{ pageProps.activeProfile.name }}</p>
          <small>{{ pageProps.activeProfile.schema.columns.length }} Activities</small>
        </div>
        <div class="card-body">
          <form>
            <div class="form-group">
              <label class="col-form-label" for="profile-type">Profile Type Name</label>
              <input id="profile-type" v-model="form.name" type="text" class="form-control" :class="{'is-valid': form.name !== '', 'is-invalid': form.name === ''}" placeholder="Profile Type Name">
              <span v-if="form.name === ''" id="profile-type-error" class="error invalid-feedback">This field is required</span>
            </div>

            <div class="form-group">
              <p><label>General Activities</label><br/>
                <small>Select <span class="font-weight-bold">activity type</span> <i class="fa fa-info-circle"></i></small>
              </p>
              <div class="btn-group">
                <button type="button" v-on:click="selectActivityType(1)" class="btn btn-default btn-radio" :class="{ 'btn-radio-active': form.activityType === 1 }">User Input</button>
                <button type="button" v-on:click="selectActivityType(2)" class="btn btn-default btn-radio" :class="{ 'btn-radio-active': form.activityType === 2 }">Select</button>
                <button type="button" v-on:click="selectActivityType(3)" class="btn btn-default btn-radio" :class="{ 'btn-radio-active': form.activityType === 3 }">Uploads</button>
              </div>
            </div>

            <div class="user-input-type" v-if="form.activityType === 1">
              <div class="form-group">
                <p>
                  <small>Select <span class="font-weight-bold">upload type</span></small>
                </p>
                <div class="btn-group">
                  <button type="button" v-on:click="inputType(1)" class="btn btn-default btn-radio" :class="{ 'btn-radio-active': form.inputType === 1 }">Number</button>
                  <button type="button" v-on:click="inputType(2)" class="btn btn-default btn-radio" :class="{ 'btn-radio-active': form.inputType === 2 }">Text</button>
                  <button type="button" v-on:click="inputType(3)" class="btn btn-default btn-radio" :class="{ 'btn-radio-active': form.inputType === 3 }">Long Text</button>
                </div>
              </div>
            </div>

            <div class="upload-type" v-if="form.activityType === 2">
              <div class="form-group">
                <p>
                  <small>Select <span class="font-weight-bold">upload type</span></small>
                </p>
                <div class="btn-group">
                  <button type="button" v-on:click="inputType(4)" class="btn btn-default btn-radio" :class="{ 'btn-radio-active': form.inputType === 4 }">Radio</button>
                  <button type="button" v-on:click="inputType(5)" class="btn btn-default btn-radio" :class="{ 'btn-radio-active': form.inputType === 5 }">Checkbox</button>
                  <button type="button" v-on:click="inputType(6)" class="btn btn-default btn-radio" :class="{ 'btn-radio-active': form.inputType === 6 }">Dropdown</button>
                </div>
              </div>
            </div>

            <div class="upload-type" v-if="form.activityType === 3">
              <div class="form-group">
                <p>
                  <small>Select <span class="font-weight-bold">upload type</span></small>
                </p>
                <div class="btn-group">
                  <button type="button" v-on:click="inputType(7)" class="btn btn-default btn-radio" :class="{ 'btn-radio-active': form.inputType === 7 }">Documents</button>
                  <button type="button" v-on:click="inputType(8)" class="btn btn-default btn-radio" :class="{ 'btn-radio-active': form.inputType === 8 }">Video</button>
                  <button type="button" v-on:click="inputType(9)" class="btn btn-default btn-radio" :class="{ 'btn-radio-active': form.inputType === 9 }">Images</button>
                </div>
              </div>
            </div>

            <div class="row" v-if="(form.activityType === 1) || (form.activityType === 2) || (form.activityType === 3)">
              <div class="col-sm-6">
                <div class="form-group">
                  <small>Activity name <i class="fa fa-info-circle"></i></small>
                  <input v-model="form.activityName" type="text" class="form-control" placeholder="Add activity name" :class="{'is-valid': form.activityName !== '', 'is-invalid': form.activityName === ''}">
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <small>Activity label <i class="fa fa-info-circle"></i></small>
                  <input v-model="form.activityLabel" type="text" class="form-control" placeholder="Add activity label" :class="{'is-valid': form.activityLabel !== '', 'is-invalid': form.activityLabel === ''}">
                </div>
              </div>
            </div>

          </form>
        </div>
        <div class="card-footer">
          <a v-on:click="resetProfileType()" type="submit" class="btn btn-default">Cancel</a>
          <button v-on:click="addActivity()" type="submit" class="btn btn-default float-right" :disabled="!isValidProfileTypeForm()"><i class="fa fa-list-ul"></i> Add Activity</button>
        </div>
      </div>

      <hr class="col-md-1 mt-4 hr-middle" v-if="pageProps.isEdit && (pageProps.activeProfile.schema.columns.length > 0)" />

      <div class="card col-md-3" v-if="pageProps.isEdit && (pageProps.activeProfile.schema.columns.length > 0)">
        <div class="card-header">
          <span class="left-heading">Activities</span>
        </div>
        <div class="card-body">
          <div class="row edit-activity" v-for="(column, column_index) in pageProps.activeProfile.schema.columns">
            <div class="col-md-8">
              <small class="activity-type">{{ column.type }}</small>
              <p class="activity-name">{{ column.title }}</p>
            </div>
            <div class="col-md-4 text-right">
              <a class="delete-activity mr-2" v-on:click="deleteProfileType(column_index)"><i class="fa fa-edit"></i></a>
              <a class="delete-activity" v-on:click="deleteActvity(column_index)">X</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<style scoped>
  .content-container {
    margin-left: 25px;
  }

  .left-heading {
    /* font-family: Roboto; */
    font-size: 18px;
    font-weight: 550;
    text-align: left;
  }

  .edit-icon {
    color: #0f6674;
    cursor: pointer;
  }

  .delete-icon {
    color: #ec4844;
    cursor: pointer;
  }

  .hr-middle {
    height: 2px;
    background: #43AA8B;
  }

  .profile-types {
    border: 1px solid #DADADA;
    border-radius: 4px;
    margin-bottom: 7px;
    padding: 7px;
  }

  .profile-types:hover {
    background-color: #DADADA;
    opacity: 0.4;
    cursor: pointer;
  }

  .is-edit-profile {
    background-color: #8FADB7;
    opacity: 0.8;
    cursor: pointer;
  }

  .edit-activity {
    border-bottom: 1px solid #DADADA;
    padding: 7px 0 12px 0;
  }

  .activity-type {
    text-transform: capitalize;
  }

  .activity-name {
    font-weight: bold;
    text-transform: capitalize;
  }

  .delete-activity {
    cursor: pointer;
  }

  .btn-radio {
    font-size: 14px;
    font-weight: bold;
  }

  .btn-radio-active {
    background-color: #DADADA;
    opacity: 0.8;
    cursor: pointer;
  }

  .fa-info-circle {
    cursor: pointer;
  }
</style>