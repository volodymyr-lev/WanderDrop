// This file will be used to set up the Jest environment
import 'react-native-gesture-handler/jestSetup';

// Mock Firebase modules
jest.mock('firebase/app', () => {
    return {
    initializeApp: jest.fn(),
    registerVersion: jest.fn(),
    };
});

jest.mock('firebase/auth', () => {
    return {
    getAuth: jest.fn().mockReturnValue({
        currentUser: { uid: 'test-uid' },
        signInWithEmailAndPassword: jest.fn(),
        createUserWithEmailAndPassword: jest.fn(),
        signOut: jest.fn(),
    }),
    createUserWithEmailAndPassword: jest.fn().mockResolvedValue({
        user: { uid: 'new-user-uid' },
    }),
    signInWithEmailAndPassword: jest.fn(),
    };
});

jest.mock('firebase/firestore', () => {
    const mockDocSnapshot = {
    exists: jest.fn().mockReturnValue(true),
    data: jest.fn().mockReturnValue({
        name: 'Test Name',
        description: 'Test Description',
        contributes: ['place-1'],
    }),
    id: 'doc-id',
    };
    
    const mockQuerySnapshot = {
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

    return {
    getFirestore: jest.fn().mockReturnValue({}),
    collection: jest.fn().mockReturnValue({}),
    getDocs: jest.fn().mockResolvedValue(mockQuerySnapshot),
    doc: jest.fn().mockReturnValue({}),
    getDoc: jest.fn().mockResolvedValue(mockDocSnapshot),
    setDoc: jest.fn().mockResolvedValue({}),
    updateDoc: jest.fn().mockResolvedValue({}),
    arrayRemove: jest.fn(),
    arrayUnion: jest.fn(),
    addDoc: jest.fn().mockResolvedValue({ id: 'new-doc-id' }),
    Timestamp: { 
        now: jest.fn().mockReturnValue({ seconds: 1620000000, nanoseconds: 0 }),
        fromDate: jest.fn().mockReturnValue({ seconds: 1620000000, nanoseconds: 0 }),
    },
    };
});

// Mock React Native Maps
jest.mock('react-native-maps', () => {
    return {
    __esModule: true,
    default: 'MapView',
    Marker: 'Marker',
    };
});

// Mock EventRegister
jest.mock('react-native-event-listeners', () => ({
    EventRegister: {
    emit: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    },
}));

// Mock React Native Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
    alert: jest.fn(),
}));

// Mock React Native Gesture Handler
jest.mock('react-native-gesture-handler', () => ({
    ScrollView: jest.fn(),
    GestureHandlerRootView: jest.fn(),
    GestureDetector: jest.fn(),
  }));

  jest.mock('@expo/vector-icons', () => {
    return {
        FontAwesome5: 'FontAwesome5', 
        MaterialIcons: 'MaterialIcons',
    };
});

jest.mock('expo-font', () => {
    return {
        useFonts: jest.fn(),
    };
});

jest.mock('expo-modules-core', () => {
    return {
        select: jest.fn(),  
    };
});


// Global mock for NativeAnimatedHelper
global.___nativeAnimatedHelperMock___ = {
    addListener: jest.fn(),
    removeListeners: jest.fn(),
};
