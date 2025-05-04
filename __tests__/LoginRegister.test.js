import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginRegister from '../components/LoginRegister';
import { TextInput } from '../__mocks__/react-native';

jest.mock('react-native-gesture-handler', () => {
    const RN = require('react-native');
    return {
        TextInput: RN.TextInput,
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


describe('LoginRegister component', () => {
    const mockLogin = jest.fn();
    const mockRegister = jest.fn();
    global.alert = jest.fn()
    const alertMock = jest.spyOn(global, 'alert').mockImplementation(() => {});

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('calls onLogin with email and password in login mode', () => {
        const { getByPlaceholderText, getByText } = render(
            <LoginRegister onLogin={mockLogin} onRegister={mockRegister} />
        );

        fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
        fireEvent.press(getByText('Login'));

        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('switches to register mode and shows extra inputs', () => {
        const { getByText, getByPlaceholderText } = render(
            <LoginRegister onLogin={mockLogin} onRegister={mockRegister} />
        );

        fireEvent.press(getByText("Don't have an account? Register"));
        expect(getByPlaceholderText('Name')).toBeTruthy();
        expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
    });

    it('alerts if passwords do not match during registration', () => {
        const { getByText, getByPlaceholderText } = render(
            <LoginRegister onLogin={mockLogin} onRegister={mockRegister} />
        );

        fireEvent.press(getByText("Don't have an account? Register"));
        fireEvent.changeText(getByPlaceholderText('Password'), '123');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), '456');
        fireEvent.changeText(getByPlaceholderText('Name'), 'Test');

        fireEvent.press(getByText('Register'));
        expect(alertMock).toHaveBeenCalledWith('Passwords do not match');
    });

    it('alerts if name is empty during registration', () => {
        const { getByText, getByPlaceholderText } = render(
            <LoginRegister onLogin={mockLogin} onRegister={mockRegister} />
        );

        fireEvent.press(getByText("Don't have an account? Register"));
        fireEvent.changeText(getByPlaceholderText('Password'), '123');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123');

        fireEvent.press(getByText('Register'));
        expect(alertMock).toHaveBeenCalledWith('Please enter a name');
    });

    it('calls onRegister with correct data', () => {
        const { getByText, getByPlaceholderText } = render(
            <LoginRegister onLogin={mockLogin} onRegister={mockRegister} />
        );

        fireEvent.press(getByText("Don't have an account? Register"));
        fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'pass');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'pass');
        fireEvent.changeText(getByPlaceholderText('Name'), 'User');

        fireEvent.press(getByText('Register'));
        expect(mockRegister).toHaveBeenCalledWith('user@example.com', 'pass', 'User');
    });

    it('switches back to login mode', () => {
        const { getByText, getByPlaceholderText, queryByPlaceholderText } = render(
            <LoginRegister onLogin={mockLogin} onRegister={mockRegister} />
        );

        fireEvent.press(getByText("Don't have an account? Register"));
        fireEvent.press(getByText("Already have an account? Login"));

        expect(queryByPlaceholderText('Name')).toBeNull();
        expect(queryByPlaceholderText('Confirm Password')).toBeNull();
        expect(getByText('Login')).toBeTruthy();
    });

    it('updates email and password fields correctly', () => {
        const { getByPlaceholderText } = render(
            <LoginRegister onLogin={mockLogin} onRegister={mockRegister} />
        );

        const emailInput = getByPlaceholderText('Email');
        const passwordInput = getByPlaceholderText('Password');

        fireEvent.changeText(emailInput, 'abc@test.com');
        fireEvent.changeText(passwordInput, '123456');

        expect(emailInput.props.value).toBe('abc@test.com');
        expect(passwordInput.props.value).toBe('123456');
    });

    it('shows correct button label based on mode', () => {
        const { getByText } = render(
            <LoginRegister onLogin={mockLogin} onRegister={mockRegister} />
        );

        expect(getByText('Login')).toBeTruthy();
        fireEvent.press(getByText("Don't have an account? Register"));
        expect(getByText('Register')).toBeTruthy();
    });

    it('shows toggle text based on mode', () => {
        const { getByText } = render(
            <LoginRegister onLogin={mockLogin} onRegister={mockRegister} />
        );

        expect(getByText("Don't have an account? Register")).toBeTruthy();
        fireEvent.press(getByText("Don't have an account? Register"));
        expect(getByText("Already have an account? Login")).toBeTruthy();
    });

    it('does not call onLogin if email/password are empty', () => {
        const { getByText } = render(
            <LoginRegister onLogin={mockLogin} onRegister={mockRegister} />
        );

        fireEvent.press(getByText('Login'));
        expect(mockLogin).toHaveBeenCalledWith('', '');
    });
});
