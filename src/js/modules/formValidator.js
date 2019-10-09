import Validator from './validate/main';

const form = document.querySelector('#form');
const options = {
  invalidClassName: 'test',
  responseMessages: {
    422: 'test',
  },
  submitOptions: {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};

const formValidator = new Validator(form, options);

export default formValidator;
