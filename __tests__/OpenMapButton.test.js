import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OpenMapButton from '../components/OpenMapButton'; // шлях адаптуй під себе
import { Linking } from 'react-native';
import { TouchableOpacity } from '../__mocks__/react-native';


jest.mock('react-native', () => {
    return {
        ActivityIndicator: (props) => <div data-testid={props.testID || ""} />,
        StyleSheet: {
            create: (styles) => styles,
            flatten: (styles) => styles,
        },
        ScrollView: ({ children, style, ...props }) => <div data-testid={props.testID || ""} style={style} {...props}>{children}</div>,
        View: ({ children, style, ...props }) => <div data-testid={props.testID || ""} style={style} {...props}>{children}</div>,
        Text: ({ children, style, ...props }) => <div data-testid={props.testID || ""} style={style} {...props}>{children}</div>,
        Linking: {
            openURL: jest.fn(() => Promise.resolve()),
        },
        TouchableOpacity: ({ children, style, ...props }) => <div data-testid={props.testID || ""} style={style} {...props}>{children}</div>,
    };
});


describe('OpenMapButton', () => {

    it('calls Linking.openURL with correct URL when button is pressed', () => {
        const latitude = 49.8397;
        const longitude = 24.0297;
        const { getByTestId } = render(<OpenMapButton latitude={latitude} longitude={longitude} />);

        const button = getByTestId('open-map-button');
        fireEvent.press(button);

        expect(Linking.openURL).toHaveBeenCalledWith(`https://www.google.com/maps?q=${latitude},${longitude}`);
    });
});
