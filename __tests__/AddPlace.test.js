import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddPlace from '../components/AddPlace'; 
import { AuthContext } from '../context/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { Alert } from 'react-native';

jest.mock('react-native/Libraries/Alert/Alert', () => ({
    alert: jest.fn()
}));

jest.mock('../firebase/firebase', () => ({
    db: {},
    auth: { currentUser: { uid: 'test-uid' } },
    getMarkers: jest.fn().mockResolvedValue([]),
}));

jest.mock('firebase/firestore', () => ({
    collection: jest.fn().mockReturnValue({}),
    addDoc: jest.fn().mockResolvedValue({ id: 'newPlaceId' }),
    Timestamp: { now: jest.fn().mockReturnValue({}) },
    setDoc: jest.fn().mockResolvedValue({}),
    doc: jest.fn().mockReturnValue({}),
    getDoc: jest.fn().mockResolvedValue({
        exists: jest.fn().mockReturnValue(true),
        data: jest.fn().mockReturnValue({
            name: 'Test User',
            contributes: []
        })
    }),
    updateDoc: jest.fn().mockResolvedValue({}),
}));

jest.mock('react-native-maps', () => {
    const { View } = require('react-native');
    return {
        __esModule: true,
        default: props => <View>{props.children}</View>,
        Marker: props => <View />,
    };
});

jest.mock('react-native-event-listeners', () => ({
    EventRegister: {
        emit: jest.fn(),
    },
}));

describe('AddPlace component', () => {
    const mockNavigation = { goBack: jest.fn() };
    
    const mockUser = {
        uid: '12345',
        name: 'John Doe',
    };

    const mockContextValue = {
        user: mockUser,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render input fields and submit button', () => {
        const { getByPlaceholderText, getByText } = render(
            <AuthContext.Provider value={mockContextValue}>
                <AddPlace navigation={mockNavigation} />
            </AuthContext.Provider>
        );

        expect(getByPlaceholderText('Name')).toBeTruthy();
        expect(getByPlaceholderText('Description')).toBeTruthy();
        expect(getByText('Submit')).toBeTruthy();
    });

    it('should show alert if no user is logged in', async () => {
        const noUserContextValue = { user: null };
        
        render(
            <AuthContext.Provider value={noUserContextValue}>
                <AddPlace navigation={mockNavigation} />
            </AuthContext.Provider>
        );

        const { getByText } = render(
            <AuthContext.Provider value={noUserContextValue}>
                <AddPlace navigation={mockNavigation} />
            </AuthContext.Provider>
        );
        
        fireEvent.press(getByText('Submit'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("Please log in to add a place.");
        });
    });

    it('should show alert if location is not selected', async () => {
        const { getByText } = render(
            <AuthContext.Provider value={mockContextValue}>
                <AddPlace navigation={mockNavigation} />
            </AuthContext.Provider>
        );

        fireEvent.press(getByText('Submit'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("Please pick a location on the map.");
        });
    });
});
