export default {
  errorSelector: '.error-message',
  invalidClassName: 'invalid',
  submitOptions: {
    method: 'GET',
    headers: {
      credentials: 'same-origin',
      Accept: 'application/json',
    },
  },
  responseMessages: {
    404: 'Custom Not Found error message',
  },
};
