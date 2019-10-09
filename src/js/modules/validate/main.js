import defaults from './defaults';
import {
  mergeDeep,
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
    this.options = mergeDeep(defaults, options);
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
    const { responseMessages } = this.options;
    const responseMessage = responseMessages[code] ? responseMessages[code] : message;

    alert(responseMessage); // TODO: add error handling

    return this;
  }

  onResponseSuccess() {
    alert('success'); // TODO: Handle success response

    this.form.reset();

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

      options.body = new FormData(this.form);

      const responseData = await getResponseData(
        this.action,
        options,
        this.onResponseError.bind(this),
      );

      if (responseData && responseData.success) {
        this.onResponseSuccess();
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
