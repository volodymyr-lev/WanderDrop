// __mocks__/firebase/firestore.js
export const mockDocSnapshot = {
    exists: jest.fn().mockReturnValue(true),
    data: jest.fn().mockReturnValue({
      name: 'Test Name',
      description: 'Test Description',
    }),
    id: 'doc-id',
  };
  
  export const mockQuerySnapshot = {
    docs: [
      {
        data: jest.fn().mockReturnValue({
          name: 'Place 1',
          description: 'Description 1',
        }),
        id: 'place-1',
      },
      {
        data: jest.fn().mockReturnValue({
          name: 'Place 2',
          description: 'Description 2',
        }),
        id: 'place-2',
      },
    ],
  };
  
  export const getFirestore = jest.fn().mockReturnValue({});
  export const collection = jest.fn().mockReturnValue({});
  export const getDocs = jest.fn().mockResolvedValue(mockQuerySnapshot);
  export const doc = jest.fn().mockReturnValue({});
  export const getDoc = jest.fn().mockResolvedValue(mockDocSnapshot);
  export const setDoc = jest.fn().mockResolvedValue({});
  export const updateDoc = jest.fn().mockResolvedValue({});
  export const arrayRemove = jest.fn();
  export const arrayUnion = jest.fn();
  export const addDoc = jest.fn().mockResolvedValue({ id: 'new-doc-id' });
  export const Timestamp = { 
    now: jest.fn().mockReturnValue({ seconds: 1620000000, nanoseconds: 0 }),
    fromDate: jest.fn().mockReturnValue({ seconds: 1620000000, nanoseconds: 0 }),
  };