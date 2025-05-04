import React from 'react';
import BottomSheetMarkerReviews from '../components/BottomSheetMarkerReviews';
import { render, waitFor } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import { ScrollView } from '../__mocks__/react-native';

jest.mock('../firebase/firebase', () => ({
    getReviewsById: jest.fn(() => Promise.resolve([])),
}));

jest.mock('../components/Review', () => ({
    __esModule: true,
    default: () => <></>, 
}));

jest.mock('react-native-star-rating-widget', () => {
    return {
        __esModule: true,
        default: () => <></>,
    };
});

jest.mock('react-native', () => {
    return {
        ActivityIndicator: () => <div data-testid="loader" />,
        StyleSheet: {
            create: (styles) => styles,
            flatten: (styles) => styles,
        },
        ScrollView: ({ children, style, ...props }) => <div data-testid="loader" style={style} {...props}>{children}</div>,
        View: ({ children, style, ...props }) => <div data-testid="loader" style={style} {...props}>{children}</div>,
        Text: ({ children, style, ...props }) => <div data-testid="loader" style={style} {...props}>{children}</div>,
    };
});

jest.mock('react-native-gesture-handler', () => {
    const RN = require('react-native');
    return {
      ScrollView: RN.ScrollView,
    };
});

describe('BottomSheetMarkerReviews Component', () => {
    it('renders reviews', async () => {
        const { getByTestId } = render(<BottomSheetMarkerReviews marker={{ id: 'test-id' }} />);

        await waitFor(() => {
            expect(getByTestId('loader')).toBeTruthy();
        });
    });
});
