import axios from "axios";

export { ApiHelper };
class ApiHelper {

    constructor(apiUrl, user, end_point) {
        this.apiUrl = apiUrl;
        this.user = user;
        this.tenant = user.tenant;
        this.end_point = end_point;
    }
    async get(id = null, parent_id = null, _with = null)
    {
        this.loading = true;
        this.items = [];

        let _url = this.apiUrl+'/'+this.user.tenant+'/'+this.end_point;

        if(parent_id !== null) {
            _url += '/'+parent_id;
        }

        if (id !== null) {
            _url = _url + '/'+id;
        }

        if (_with !== null) {
            _url = _url + '?'+_with;
        }

        try {
            const response = await axios.get(_url, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ` + this.user.token,
                },
            });

            if (response.status === 200) {
                this.items = response.data.data;
                this.loading = false;
                return response.data;
            }
        } catch (error) {
            if(error.response.status !== 404) {
                throw error;
            } else {
                return error.data;
            }
        }
    }

    async create(parent_id = null){
        this.resetResponse();
        this.loading = true;
        this.items = [];

        if(this.item.name === '') {
            // TODO: Move this message to an error messages config file and just call the config file here
            this.setResponse(500, 'error', 'Please check required fields', [], []);

            return this.response;
        }

        let _url = this.apiUrl+'/'+this.user.tenant+'/'+this.end_point+'/create';

        if(parent_id !== null) {
            _url += '/'+parent_id
        }

        try {
            const response = await axios.post(_url, this.item, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ` + this.user.token,
                },
            });

            if (response.status === 201) {
                this.item.id = response.data.data.id;
                this.setResponse(response.status, 'success', response.data.message, [], response.data.data);
            }
        } catch (error) {
            if(error.response.status !== 404) {
                this.setResponse(error.response.status, 'error', error.response.statusText, [], []);
            }
        } finally {
            this.loading = false;
        }

        return this.response;
    }

    update(process, id) {
        this.resetResponse();
    }

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
                this.loading = false;
                this.setResponse(response.status, 'success', response.data.message, [], []);
                // Remove item on successful deletion
                this.processes = this.processes.filter((_item) => _item.id !== _process.id);
            }
        } catch (error) {
            this.setResponse(error.response.status,'error', error.response.statusText, [], []);
        }

        return this.response;
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

    setItem(_item) {
        this.item = _item;
    }

    resetItem() {
        this.item = {};
    }
}