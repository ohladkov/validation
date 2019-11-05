import uuid from 'uuid/v4';


const SUBMIT_TYPE = 'submit';
export const VALIDATE_ATTR = 'id';

const convertNodeListToArray = (collection) => Array.from(collection);

const setError = (field, { errorSelector, invalidClassName }) => {
  if (!field.errorMessage) {
    return;
  }

  const parent = field.parentNode;

  if (parent.querySelector(errorSelector)) {
    return;
  }

  const errorClassName = errorSelector.slice(1);
  const error = document.createElement('span');

  error.classList.add(errorClassName);
  error.textContent = field.errorMessage;

  parent.classList.add(invalidClassName);
  parent.append(error);
};

const clearError = (field, { errorSelector, invalidClassName }) => {
  const parent = field.parentNode;
  const errorElement = parent.querySelector(errorSelector);

  if (errorElement) {
    errorElement.remove();
  }

  field.errorMessage = null;
  parent.classList.remove(invalidClassName);
};

const validate = (field, options) => {
  const isValid = field.checkValidity();

  if (isValid) {
    return;
  }

  const fieldValidity = field.validity;

  // eslint-disable-next-line
  for (const validityType in fieldValidity) {
    if (fieldValidity[validityType]) {
      field.errorMessage = field.validationMessage;

      setError(field, options);
    }
  }
};

const filterResponseErrors = (response) => {
  if (!response.ok) {
    const error = { code: response.status, message: response.statusText };

    throw error;
  }

  return response;
};

export const getDataAttr = (el, attr) => el.dataset[attr];

export const setUniqueDataId = (elementsList) => {
  const formattedElementsList = Array.isArray(elementsList)
    ? elementsList
    : convertNodeListToArray(elementsList);

  return formattedElementsList.map((element) => {
    const dataUUID = uuid();

    element.dataset[VALIDATE_ATTR] = dataUUID;

    return element;
  });
};

export const getFormFields = (form) => convertNodeListToArray(form.elements);

export const getRequiredFields = (fields) => fields.filter((field) => field.required);

export const getSubmitButton = (fields) => fields.find((field) => field.type === SUBMIT_TYPE);

export const validateField = (field, options) => {
  clearError(field, options);
  validate(field, options);
};

export const getResponseData = async (url, options, onError) => {
  try {
    const response = await fetch(url, options).then(filterResponseErrors);
    const data = await response.json();

    return data;
  } catch (error) {
    return onError(error);
  }
};

export const mergeDeep = (target, source) => {
  const isObject = (obj) => obj && typeof obj === 'object';

  if (!isObject(target) || !isObject(source)) {
    return target;
  }

  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = mergeDeep({ ...targetValue }, sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });

  return target;
};
