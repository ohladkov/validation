export default {
  errorSelector: '.error-message',
  invalidClassName: 'invalid',
  submitOptions: {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  },
  responseErrors: {
    404: 'Custom Not Found error message',
  },
};
