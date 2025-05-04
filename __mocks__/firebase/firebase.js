// __mocks__/firebase/firebase.js
import { jest } from '@jest/globals';

// Mock db object
export const db = {
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  add: jest.fn().mockResolvedValue({ id: 'mockedDocId' }),
  get: jest.fn().mockResolvedValue({ exists: true, data: () => ({}) }),
  set: jest.fn().mockResolvedValue(true),
  update: jest.fn().mockResolvedValue(true),
};

// Mock auth object
export const auth = {
  currentUser: { uid: 'test-uid' },
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({}),
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({}),
  signOut: jest.fn().mockResolvedValue({}),
};

// Mock other Firebase functions as needed
export const getMarkers = jest.fn().mockResolvedValue([
  { id: 'marker1', data: () => ({ name: 'Test Marker', latitude: 42, longitude: 24 }) }
]);

export const addPlace = jest.fn().mockResolvedValue({ id: 'new-place-id' });

export const updateUserContributes = jest.fn().mockResolvedValue(true);

export const getFirestore = jest.fn(() => db);