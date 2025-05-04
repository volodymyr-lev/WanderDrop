import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import UserProfile from '../components/UserProfile';
import { AuthContext } from '../context/AuthContext';
import { getDoc, doc } from 'firebase/firestore';
import { EventRegister } from 'react-native-event-listeners';

jest.mock('../navigation/ProfileTabs', () => {
    return function MockProfileTabs() {
        return <div>MockTabs</div>;
    };
});

jest.mock('../firebase/firebase');

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
        goBack: jest.fn(),
    }),
}));

jest.mock('react-native', () => {
    return {
        ActivityIndicator: function ActivityIndicator() {
            return <div data-testid="activity-indicator" />;
        },
        StyleSheet: {
            create: (styles) => styles,
            flatten: (styles) => styles,
        },
        ScrollView: function ScrollView({ children, ...props }) {
            return <div {...props}>{children}</div>;
        },
        View: function View({ children, ...props }) {
            return <div {...props}>{children}</div>;
        },
        Text: function Text({ children, ...props }) {
            return <div {...props}>{children}</div>;
        },
        Linking: {
            openURL: jest.fn(() => Promise.resolve()),
        },
        TouchableOpacity: function TouchableOpacity({ children, onPress, ...props }) {
            return (
                <button data-testid="touchable" onClick={onPress} {...props}>
                    {children}
                </button>
            );
        },
        Image: function Image({ source, ...props }) {
            return <img src={source && source.uri} {...props} alt="profile" />;
        },
    };
});

jest.mock('@expo/vector-icons', () => ({
    FontAwesome5: function FontAwesome5({ name, size, color }) {
        return <div>Icon: {name}</div>;
    },
}));

describe('UserProfile', () => {
    const mockUser = { uid: 'user123' };
    const mockUserData = {
        name: 'John Doe',
        pfp_url: 'https://example.com/photo.jpg',
        contributes: ['1', '2'],
        points: 100,
        description: 'Explorer',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getDoc.mockResolvedValue({
            exists: () => true,
            data: () => mockUserData,
        });
    });

    it('navigates to Settings screen on cog press', async () => {
        const { getAllByTestId } = render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <UserProfile />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            const buttons = getAllByTestId('touchable');
            expect(buttons.length).toBeGreaterThan(0);
        });

        const buttons = getAllByTestId('touchable');
        const settingsButton = buttons[0];

        fireEvent.press(settingsButton);
        expect(mockNavigate).toHaveBeenCalledWith('Settings');
    });

    it('listens and responds to MARKERS_UPDATED event', async () => {
        const addEventListenerSpy = jest
            .spyOn(EventRegister, 'addEventListener')
            .mockReturnValue('mock-event-id');

        const removeEventListenerSpy = jest
            .spyOn(EventRegister, 'removeEventListener')
            .mockImplementation(() => {});

        const { unmount } = render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <UserProfile />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(addEventListenerSpy).toHaveBeenCalledWith(
                'MARKERS_UPDATED',
                expect.any(Function)
            );
        });

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('mock-event-id');
    });
});
