import axios from "axios";
import { usePage } from "@inertiajs/vue3";
import { computed } from "vue";

const page = usePage();
const user = computed(() => page.props.auth.user);
const apiUrl = computed(() => page.props.negotium_api_url);

export { ApiHelper };
class ApiHelper {

    constructor(end_point) {
        this.apiUrl = apiUrl.value;
        this.user = user.value;
        this.tenant = user.value.tenant;
        this.end_point = end_point;
        this.response = {
            'code': 0,
            'status': '',
            'message': '',
            'errors': [],
            'data': []
        };
        this.loading = false;
    }
    async get(id = null, parent_id = null, _with = null)
    {
        this.loading = true;
        this.resetResponse();

        let _url = this.apiUrl+'/'+this.user.tenant+'/'+this.end_point;

        if(parent_id !== null) {
            _url += '/'+parent_id;
        }

        if (id !== null) {
            _url = _url + '/'+id;
        }

        if (_with !== null) {
            _url = _url + '?with='+_with;
        }

        try {
            const _response = await axios.get(_url, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ` + this.user.token,
                },
            });

            if (_response.status === 200) {
                this.setResponse(_response.status, 'success', _response.data.message, [], _response.data.data);
            }
        } catch (error) {
            if(error.response.status !== 404) {
                this.setResponse(error.response.status,'error', error.response.statusText, [], []);
            } else {
                this.setResponse(error.response.status,'success', 'Items retrieved successfully', [], []);
            }
        } finally {
            this.loading = false
        }

        return this.response;
    }

    async create(item, parent_id = null){
        this.loading = true;
        this.resetResponse();

        let _url = this.apiUrl+'/'+this.user.tenant+'/'+this.end_point+'/create';

        if(parent_id !== null) {
            _url += '/'+parent_id
        }

        try {
            const _response = await axios.post(_url, item, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ` + this.user.token,
                },
            });

            if (_response.status === 201) {
                this.setResponse(_response.status, 'success', _response.data.message, [], _response.data);
            }
        } catch (error) {
            this.setResponse(error.response.status,'error', error.response.statusText, [], []);
        } finally {
            this.loading = false;
        }

        return this.response;
    }

    async update(item, id) {
        this.loading = true;
        this.resetResponse();

        let _url = this.apiUrl+'/'+this.user.tenant+'/'+this.end_point+'/update/'+id;

        try {
            const _response = await axios.post(_url, item, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ` + this.user.token,
                },
            });

            if (_response.status === 200) {
                this.setResponse(_response.status, 'success', _response.data.message, [], _response.data);
            }
        } catch (error) {
            this.setResponse(error.response.status,'error', error.response.statusText, [], []);
        } finally {
            this.loading = false;
        }
    }

    /**
     * Deletes an item
     *
     * @param {array} _item
     */
    async delete(_item)
    {
        this.loading = true;
        this.resetResponse();

        let _url = this.apiUrl+'/'+this.user.tenant+'/'+this.end_point+'/delete/'+_item.id;

        try {
            const response = await axios.delete(_url, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ` + this.user.token,
                },
            });

            if (response.status === 204) {
                this.setResponse(response.status, 'success', response.data.message, [], []);
            }
        } catch (error) {
            this.setResponse(error.response.status,'error', error.response.statusText, [], []);
        } finally {
            this.loading = false;
        }
    }

    resetResponse() {
        this.response = {
            'status': '',
            'message': '',
            'errors': [],
            'data': []
        }
    }

    setResponse(code, status, message, errors, data) {
        this.response = {
            'code': code,
            'status': status,
            'message': message,
            'errors': errors,
            'data': data
        }
    }

    getResponse() {
        return this.response;
    }

    setItem(_item) {
        this.item = _item;
    }

    resetItem() {
        this.item = {};
    }

    // Checks api call is done loading
    isDoneLoading(result = null, callback = null) {
        const checkCondition = () => {
            if (this.loading) {
                setTimeout(checkCondition, 100); // Check the condition every 100ms
            } else {
                if(callback !== null) {
                    callback(result);
                }
            }
        };
        checkCondition();
    }
}