// __mocks__/firebase/app.js
export const initializeApp = jest.fn().mockReturnValue({
    name: '[DEFAULT]',
    options: {},
  });
  
  export const registerVersion = jest.fn();
  