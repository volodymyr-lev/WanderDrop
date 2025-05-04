import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Saved from '../components/Saved';

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
    }),
}));

jest.mock('react-native-star-rating-widget', () => {
    return ({ rating }) => <div testID="star-rating">Rating: {rating}</div>;
});

jest.mock('expo-location', () => ({
    requestForegroundPermissionsAsync: jest.fn(() =>
        Promise.resolve({ status: 'granted' })
    ),
    getCurrentPositionAsync: jest.fn(() =>
        Promise.resolve({
            coords: { latitude: 50, longitude: 30 },
        })
    ),
}));

describe('Saved component', () => {
    const mockContribute = {
        name: 'Test Place',
        image_url: ['https://example.com/image.jpg'],
        average_rating: 4.5,
        latitude: 50.1,
        longitude: 30.1,
    };

    it('renders correctly and shows info', async () => {
        const { getByText, getByTestId } = render(
            <Saved savedId="123" contribute={mockContribute} />
        );

        await waitFor(() => {
            expect(getByText('Test Place')).toBeTruthy();
            expect(getByTestId('star-rating')).toBeTruthy();
            expect(getByTestId('star-rating').props.children).toContain(4.5);
        });
    });
});
