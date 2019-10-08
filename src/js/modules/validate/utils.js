const SUBMIT_TYPE = 'submit';
const RADIO_TYPE = 'radio';

export const convertHtmlCollectionToArray = collection => Array.from(collection);

export const getSubmitButton = fields => fields.find(field => field.type === SUBMIT_TYPE);

export const getRadioFields = fields => fields.filter(field => field.type === RADIO_TYPE);

export const isRadio = field => field.type === RADIO_TYPE;

export const getRadioFieldsByGroup = (field, radioFields) => {
  const { name } = field;

  return radioFields.filter(radio => radio.name === name);
};

export const clearError = (field, { errorSelector, invalidClassName }) => {
  const parent = field.parentNode;
  const errorElement = parent.querySelector(errorSelector);

  if (errorElement) {
    errorElement.remove();
  }

  field.errorMessage = null;
  parent.classList.remove(invalidClassName);
};

export const setError = (field, { errorSelector, invalidClassName }) => {
  if (!field.errorMessage) {
    return;
  }

  const parent = field.parentNode;
  const errorClassName = errorSelector.slice(1);
  const error = document.createElement('span');

  error.classList.add(errorClassName);
  error.textContent = field.errorMessage;

  parent.classList.add(invalidClassName);
  parent.append(error);
};

export const validateField = (field, options, radioFields = []) => {
  const validate = (inputField) => {
    const isValid = isRadio(inputField) ? false : inputField.checkValidity();

    if (isValid) {
      return;
    }

    const fieldValidity = inputField.validity;

    // eslint-disable-next-line
    for (const validityType in fieldValidity) {
      if (fieldValidity[validityType]) {
        inputField.errorMessage = inputField.validationMessage;

        setError(inputField, options);
      }
    }
  };

  const requiredFields = radioFields.length ? getRadioFieldsByGroup(field, radioFields) : [field];

  requiredFields.forEach((requiredField) => {
    clearError(requiredField, options);
    validate(requiredField);
  });
};
