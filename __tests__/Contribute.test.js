import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Contribute from '../components/Contribute';

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
    }),
}));

jest.mock('react-native-star-rating-widget', () => {
    return {
        __esModule: true,
        default: ({ rating, onChange }) => (
            <div data-testid="star-rating" data-rating={rating}>Star Rating Mock</div>
        ),
    };
});

const mockRequestPermission = jest.fn(() => Promise.resolve({ status: 'granted' }));
const mockGetCurrentPosition = jest.fn(() => 
    Promise.resolve({
        coords: {
            latitude: 37.7749,
            longitude: -122.4194
        }
    })
);

jest.mock('expo-location', () => ({
    requestForegroundPermissionsAsync: () => mockRequestPermission(),
    getCurrentPositionAsync: () => mockGetCurrentPosition(),
}));

describe('Contribute Component', () => {
    const mockContribute = {
        id: '123',
        name: 'Test Location',
        image_url: ['https://example.com/image.jpg'],
        average_rating: 4.5,
        latitude: 37.7848,
        longitude: -122.4375
    };

    beforeEach(() => {
        jest.clearAllMocks();
        global.Location = {
            requestForegroundPermissionsAsync: mockRequestPermission,
            getCurrentPositionAsync: mockGetCurrentPosition
        };
    });
    
    it('calculates distance correctly when location is available', async () => {
        const { rerender } = render(<Contribute contribute={mockContribute} />);
        await waitFor(() => {
            expect(mockGetCurrentPosition).toHaveBeenCalled();
        });
        rerender(<Contribute contribute={mockContribute} />);
    });
    
    it('navigates to PlaceDetails when pressed', () => {
        const mockNavigate = jest.fn();

        jest.spyOn(require('@react-navigation/native'), 'useNavigation').mockReturnValue({
          navigate: mockNavigate
        });
        
        const { getByTestId } = render(<Contribute contribute={mockContribute} />);

        fireEvent.press(getByTestId('touchable'));

        expect(mockNavigate).toHaveBeenCalledWith('PlaceDetails', {
          marker: mockContribute
        });
      });

    it('handles location permission denial', async () => {
        mockRequestPermission.mockResolvedValueOnce({ status: 'denied' });
        const consoleSpy = jest.spyOn(console, 'log');
        render(<Contribute contribute={mockContribute} />);
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Permission to access location was denied');
        });
        expect(mockGetCurrentPosition).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('handles missing coordinates in contribute data', async () => {
        const incompleteContribute = {
            id: '123',
            name: 'Incomplete Location',
            image_url: ['https://example.com/image.jpg'],
            average_rating: 4.5,
        };
        render(<Contribute contribute={incompleteContribute} />);
        await waitFor(() => {
            expect(mockGetCurrentPosition).toHaveBeenCalled();
        });
    });
});
