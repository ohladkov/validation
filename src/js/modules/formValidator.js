import Validator from './validate/main';

const form = document.querySelector('#form');

const formValidator = new Validator(form);

export default formValidator;
