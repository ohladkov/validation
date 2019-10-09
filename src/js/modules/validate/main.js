import defaults from './defaults';
import {
  convertHtmlCollectionToArray,
  getSubmitButton,
  validateField,
  getRadioFields,
  isRadio,
  getResponseData,
} from './utils';

export default class Validator {
  constructor(form, options) {
    this.form = form;
    this.action = form.action;
    this.options = Object.assign({}, defaults, options);
  }

  get fields() {
    return convertHtmlCollectionToArray(this.form.elements);
  }

  get requiredFields() {
    return this.fields.filter(field => field.required);
  }

  get invalidFields() {
    return this.requiredFields.filter(field => Boolean(field.errorMessage));
  }

  get radioFields() {
    return getRadioFields(this.fields);
  }

  get submitButton() {
    return getSubmitButton(this.fields);
  }

  validate(field) {
    const { options } = this;

    if (!field) {
      this.requiredFields.forEach(requiredField => validateField(requiredField, options));
      this.toggleSubmitButton();

      return;
    }

    const radioFields = isRadio(field) ? this.radioFields : [];

    validateField(field, options, radioFields);
    this.toggleSubmitButton();

    return this;
  }

  toggleSubmitButton() {
    this.submitButton.disabled = Boolean(this.invalidFields.length);

    return this;
  }

  onResponseError({ code, message }) {
    const { errorMessages } = this.options;
    const errorMessage = errorMessages[code] ? errorMessages[code] : message;

    alert(errorMessage); // TODO: add error handling

    return this;
  }

  onChange() {
    this.requiredFields.forEach((requiredField) => {
      requiredField.addEventListener('change', (e) => {
        e.preventDefault();

        this.validate(e.target);
      });
    });

    return this;
  }

  onSubmit() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();

      this.validate();

      if (this.invalidFields.length) {
        return;
      }

      const { submitOptions: options } = this.options;

      const responseData = await getResponseData(this.action, options, this.onResponseError.bind(this));

      if (responseData && responseData.success) {
        alert('success'); // TODO: Handle success response
      }
    });

    return this;
  }

  init() {
    if (!this.form.noValidate) {
      this.form.noValidate = true;
    }

    this.onChange();
    this.onSubmit();

    return this;
  }
}
