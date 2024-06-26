export { formsHelper };
class formsHelper {
    constructor(form, required = null) {
        this.isSubmitted = false;
        this._originalForm = JSON.parse(JSON.stringify(form));
        this.input = form;
        this.required = required;
        this.validation = [];
    }

    get() {
        return this.input;
    }

    clear() {
        this.isSubmitted = false;
        this.input = JSON.parse(JSON.stringify(this._originalForm));
    }

    validationErrors() {
        return this.validation;
    }

    isInValid(field) {
        return this.input[field] === '' && this.isSubmitted;
    }

    save() {
        this.isSubmitted = true;
        this.validation = [];
        if(this.required !== null) {
            for (const field in this.input) {
                if (this.input.hasOwnProperty(field)) {
                    if (this.required.includes(field) && this.input[field] === '') {
                        this.validation.push(`The ${field} field is required!`);
                    }
                }
            }

            if(this.validation.length > 0) {
                return false;
            }
        }

        // TODO: Submit functionality here

        return true;
    }
}