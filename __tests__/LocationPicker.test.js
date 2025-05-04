import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LocationPicker from '../components/LocationPicker';

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockMapView = (props) => <View testID="mock-map">{props.children}</View>;
  const MockMarker = () => <View testID="mock-marker" />;
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});

describe('LocationPicker', () => {
  const mockNavigate = jest.fn();
  const navigation = { navigate: mockNavigate };
  const route = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders map and button', () => {
    const { getByTestId, getByText } = render(<LocationPicker navigation={navigation} route={route} />);
    expect(getByTestId('mock-map')).toBeTruthy();
    expect(getByText('Confirm Location')).toBeTruthy();
  });

  it('does not navigate if no location is picked', () => {
    const { getByText } = render(<LocationPicker navigation={navigation} route={route} />);
    fireEvent.press(getByText('Confirm Location'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('picks a location when map is pressed', () => {
    const { getByTestId, queryByTestId } = render(<LocationPicker navigation={navigation} route={route} />);

    expect(queryByTestId('mock-marker')).toBeNull();

    fireEvent(getByTestId('mock-map'), 'press', {
      nativeEvent: {
        coordinate: { latitude: 10, longitude: 20 },
      },
    });

    expect(queryByTestId('mock-marker')).toBeTruthy();
  });

  it('navigates with picked location on confirm', () => {
    const { getByTestId, getByText } = render(<LocationPicker navigation={navigation} route={route} />);

    fireEvent(getByTestId('mock-map'), 'press', {
      nativeEvent: {
        coordinate: { latitude: 10, longitude: 20 },
      },
    });

    fireEvent.press(getByText('Confirm Location'));

    expect(mockNavigate).toHaveBeenCalledWith('AddPlace', {
      latitude: 10,
      longitude: 20,
    });
  });

  it('renders Marker only after a location is picked', () => {
    const { getByTestId, queryByTestId } = render(<LocationPicker navigation={navigation} route={route} />);
    
    expect(queryByTestId('mock-marker')).toBeNull();

    fireEvent(getByTestId('mock-map'), 'press', {
      nativeEvent: {
        coordinate: { latitude: 1, longitude: 1 },
      },
    });

    expect(queryByTestId('mock-marker')).toBeTruthy();
  });
});
