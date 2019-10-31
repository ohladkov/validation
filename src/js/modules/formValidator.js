import Validator from './validate/main';

const form = document.querySelectorAll('.form');
const options = {
  invalidClassName: 'test',
  responseErrors: {
    422: 'test',
  },
  submitOptions: {
    method: 'POST',
  },
};

const formValidator = new Validator(form, options);

export default formValidator;
