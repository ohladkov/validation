import defaults from './defaults';
import {
  VALIDATE_ATTR,
  setUniqueDataId,
  mergeDeep,
  getDataAttr,
  getFormFields,
  getRequiredFields,
  getSubmitButton,
  validateField,
  getResponseData,
} from './utils';

export default class Validator {
  constructor(forms, options) {
    this.forms = setUniqueDataId(forms);
    this.formIds = this.forms.map((form) => getDataAttr(form, VALIDATE_ATTR));
    this.options = mergeDeep(defaults, options);
  }

  get fields() {
    return this.forms.reduce((acc, current, index) => {
      acc[this.formIds[index]] = getFormFields(current);

      return acc;
    }, {});
  }

  get requiredFields() {
    return this.forms.reduce((acc, current, index) => {
      acc[this.formIds[index]] = getRequiredFields(this.fields[this.formIds[index]]);

      return acc;
    }, {});
  }

  get invalidFields() {
    return this.forms.reduce((acc, current, index) => {
      acc[this.formIds[index]] = this.requiredFields[this.formIds[index]]
        .filter((field) => Boolean(field.errorMessage));

      return acc;
    }, {});
  }

  get submitButtons() {
    return this.forms.reduce((acc, current, index) => {
      acc[this.formIds[index]] = getSubmitButton(this.fields[this.formIds[index]]);

      return acc;
    }, {});
  }

  validate(field, formId) {
    const { options } = this;

    if (!field) {
      this.requiredFields[formId].forEach((requiredField) => (
        validateField(
          requiredField,
          options,
          this.requiredFields[formId],
        )));

      this.toggleSubmitButton(formId);

      return this;
    }

    validateField(field, options, this.requiredFields[formId]);
    this.toggleSubmitButton(formId);

    return this;
  }

  toggleSubmitButton(formId) {
    this.submitButtons[formId].disabled = Boolean(this.invalidFields[formId].length);

    return this;
  }

  onResponseError({ code, message }) {
    const { responseErrors } = this.options;
    const responseMessage = responseErrors[code] || message;

    alert(responseMessage); // TODO: add error handling

    return this;
  }

  onResponseSuccess(formId) {
    alert('success'); // TODO: Handle success response

    this.forms.find((form) => getDataAttr(form, VALIDATE_ATTR) === formId).reset();

    return this;
  }

  onChange() {
    Object.values(this.requiredFields).forEach((requiredFields) => {
      requiredFields.forEach((requiredField) => {
        const formId = getDataAttr(requiredField.closest('form'), VALIDATE_ATTR);

        requiredField.addEventListener('change', (e) => {
          e.preventDefault();

          this.validate(e.target, formId);
        });
      });
    });

    return this;
  }

  onSubmit() {
    this.forms.forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formId = getDataAttr(form, VALIDATE_ATTR);

        this.validate(null, formId);

        if (this.invalidFields[formId].length) {
          return this;
        }

        const { submitOptions: options } = this.options;

        options.body = new FormData(form);

        const responseData = await getResponseData(
          form.action,
          options,
          this.onResponseError.bind(this),
        );

        if (responseData && responseData.success) {
          this.onResponseSuccess(formId);
        }
      });
    });

    return this;
  }

  init() {
    this.forms.forEach((form) => {
      if (!form.noValidate) {
        form.noValidate = true;
      }
    });

    this.onChange();
    this.onSubmit();

    return this;
  }
}
