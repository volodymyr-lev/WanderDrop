// __mocks__/firebase/auth.js
export const getAuth = jest.fn().mockReturnValue({
    currentUser: { uid: 'test-uid' },
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  });
  
  export const createUserWithEmailAndPassword = jest.fn().mockResolvedValue({
    user: { uid: 'new-user-uid' },
  });
  
  export const signInWithEmailAndPassword = jest.fn();