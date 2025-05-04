import React from 'react';
import { render, screen } from '@testing-library/react-native';
import FoundPlace from '../components/FoundPlace';


jest.mock('expo-location', () => ({
    getCurrentPositionAsync: jest.fn().mockResolvedValue({
        coords: {
            latitude: 50.4501,
            longitude: 30.5216,
        },
    }),
    requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({
        status: 'granted',
    }),
}));


describe('FoundPlace Component', () => {
    const mockMarker = {
        name: 'Test Place',
        description: 'This is a test description.',
        image_url: ['https://example.com/image.jpg'],
        added_by: 'Test User',
        latitude: 50.4501,
        longitude: 30.5216,
        isNice: false,
    };


    it('renders without crashing', () => {
        render(<FoundPlace marker={mockMarker} />);
        expect(screen.getByTestId('found-place')).toBeTruthy();
    });

    it('displays the correct title', () => {
        const title = 'Test Place';
        render(<FoundPlace title={title} marker={mockMarker} />);
        expect(screen.getByText(title)).toBeTruthy();
    });
});
