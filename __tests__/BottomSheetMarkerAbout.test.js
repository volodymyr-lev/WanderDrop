import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import BottomSheetMarkerAbout from '../components/BottomSheetMarkerAbout';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

jest.mock('expo-location', () => ({
    getCurrentPositionAsync: jest.fn(),
    requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({
        status: 'granted',
    }),
}));

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
}));

jest.mock('react-native-gesture-handler', () => {
    const RN = require('react-native');
    return {
        ScrollView: RN.ScrollView,
    };
});

describe('BottomSheetMarkerAbout', () => {
    const mockNavigation = { navigate: jest.fn() };

    const mockMarker = {
        name: 'Test Place',
        description: 'This is a test description.',
        image_url: ['https://example.com/image.jpg'],
        added_by: 'Test User',
        latitude: 50.4501,
        longitude: 30.5216,
        isNice: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useNavigation.mockReturnValue(mockNavigation);
        Location.getCurrentPositionAsync.mockResolvedValue({
            coords: { latitude: 50.4501, longitude: 30.5216 },
        });
    });

    it('should render the marker details correctly', () => {
        const { getByText } = render(
            <BottomSheetMarkerAbout marker={mockMarker} />
        );

        expect(getByText(mockMarker.name)).toBeTruthy();
        expect(getByText(`Added By: ${mockMarker.added_by}`)).toBeTruthy();
        expect(getByText('Distance: Calculating...')).toBeTruthy();
        expect(getByText(mockMarker.description)).toBeTruthy();
    });

    it('should open the modal when an image is clicked', async () => {
        const { getByTestId } = render(
            <BottomSheetMarkerAbout marker={mockMarker} />
        );

        fireEvent.press(getByTestId('image-0'));
    });

    it('should call navigate when the navigation button is pressed', () => {
        const { getByTestId } = render(
            <BottomSheetMarkerAbout marker={mockMarker} />
        );

        fireEvent.press(getByTestId('nav-button'));
        
        expect(mockNavigation.navigate).toHaveBeenCalledWith('PlaceDetails', { marker: mockMarker });
    });

    it('should handle location permissions correctly', async () => {
        Location.requestForegroundPermissionsAsync.mockResolvedValue({
            status: 'granted',
        });

        const { getByText } = render(<BottomSheetMarkerAbout marker={mockMarker} />);

        await waitFor(() => {
            expect(getByText('Distance: 0.00 km')).toBeTruthy();
        });
    });

    it('should handle location permission denial gracefully', async () => {
        Location.requestForegroundPermissionsAsync.mockResolvedValue({
            status: 'denied',
        });

        const { getByText } = render(<BottomSheetMarkerAbout marker={mockMarker} />);

        await waitFor(() => {
            expect(getByText('Distance: Calculating...')).toBeTruthy();
        });
    });
});
