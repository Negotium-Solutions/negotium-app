export { responseHelper };

class responseHelper {

    constructor() {
        this.response = {
            'code': 0,
            'status': '',
            'message': 'This is a test message',
            'errors': [],
            'data': []
        }
    }

    set(code, status, message, errors, data) {
        this.response = {
            'code': code,
            'status': status,
            'message': message,
            'errors': errors,
            'data': data
        };
    }

    reset () {
        this.response.code = 200;
        this.response.status = 0;
        this.response.message = '';
        this.response.errors = [];
        this.response.data = [];
    }
}