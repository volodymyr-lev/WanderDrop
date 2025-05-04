import React from 'react';
import { render, act } from '@testing-library/react-native';
import BottomSheetMarkerInfo from '../components/BottomSheetMarkerInfo';

jest.mock('../navigation/MarkerTabs', () => {
    return jest.fn().mockImplementation(({ marker }) => (
        <mockComponent testID="marker-tabs-mock" marker={marker}>
            MarkerTabs Mock
        </mockComponent>
    ));
});

describe('BottomSheetMarkerInfo', () => {
    const mockMarker = {
        id: '123',
        name: 'Test Marker',
        location: { latitude: 50.4501, longitude: 30.5234 }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should not render when marker is not provided', () => {
        const { toJSON } = render(<BottomSheetMarkerInfo />);
        expect(toJSON()).toBeNull();
    });

    it('should not render when marker is null', () => {
        const { toJSON } = render(<BottomSheetMarkerInfo marker={null} />);
        expect(toJSON()).toBeNull();
    });

    it('should not render when marker is undefined', () => {
        const { toJSON } = render(<BottomSheetMarkerInfo marker={undefined} />);
        expect(toJSON()).toBeNull();
    });

    it('should pass the correct marker to MarkerTabs', () => {
        const { getByTestId } = render(<BottomSheetMarkerInfo marker={mockMarker} />);
        
        const markerTabs = getByTestId('marker-tabs-mock');

        expect(markerTabs.props.marker).toEqual(mockMarker);
    });

    it('should have the correct container style', () => {
        const { toJSON } = render(<BottomSheetMarkerInfo marker={mockMarker} />);
    
        const tree = toJSON();
        expect(tree).not.toBeNull();

        expect(tree.props.style).toHaveProperty('flex', 1);
    });
});
