import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import Contributes from '../components/Contributes';
import { getContributesByUser } from '../firebase/firebase';


jest.mock('../firebase/firebase', () => ({
  getContributesByUser: jest.fn(),
}));

jest.mock('react-native-event-listeners', () => ({
  EventRegister: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    ScrollView: (props) => <View {...props} testID="scroll-view" />,
  };
});


jest.mock('react-native', () => {
    return {
        ActivityIndicator: () => <div data-testid="activity-indicator" />,
        StyleSheet: {
            create: (styles) => styles,
            flatten: (styles) => styles,
        },
        ScrollView: ({ children, style, ...props }) => <div data-testid="loader" style={style} {...props}>{children}</div>,
        View: ({ children, style, ...props }) => <div data-testid="loader" style={style} {...props}>{children}</div>,
        Text: ({ children, style, ...props }) => <div data-testid="loader" style={style} {...props}>{children}</div>,
    };
});


jest.mock('../components/Contribute', () => {
  const View = require('react-native').View;
  return (props) => <View testID="contribute-item" data-contribute={JSON.stringify(props.contribute)} />;
});

describe('Contributes Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('fetches contributes data when userData is provided with uid', async () => {
    const mockUserData = { uid: '123', name: 'Test User' };
    const mockContributes = [
      { id: '1', title: 'Contribution 1' },
      { id: '2', title: 'Contribution 2' },
    ];
    
    getContributesByUser.mockResolvedValue(mockContributes);
    
    let component = render(<Contributes userData={mockUserData} />);

    await waitFor(() => {
      expect(getContributesByUser).toHaveBeenCalledWith(mockUserData);
      expect(component.queryByTestId('activity-indicator')).toBeNull();
      expect(component.getAllByTestId('contribute-item').length).toBe(2);
    });
  });

  it('does not fetch contributes when userData has no uid', async () => {
    const mockUserData = { name: 'Test User' }; // No uid
    
    let component = render(<Contributes userData={mockUserData} />);

    
    expect(getContributesByUser).not.toHaveBeenCalled();
  });


  it('renders the correct number of Contribute components', async () => {
    const mockUserData = { uid: '123' };
    const mockContributes = [
      { id: '1', title: 'Contribution 1' },
      { id: '2', title: 'Contribution 2' },
      { id: '3', title: 'Contribution 3' },
    ];
    
    getContributesByUser.mockResolvedValue(mockContributes);
    
    let component = render(<Contributes userData={mockUserData} />);
    
    await waitFor(() => {
      const contributeItems = component.getAllByTestId('contribute-item');
      expect(contributeItems.length).toBe(3);
      
      // Verify the data is passed correctly to each Contribute component
      mockContributes.forEach((contribute, index) => {
        const item = contributeItems[index];
        const itemProps = JSON.parse(item.props['data-contribute']);
        expect(itemProps).toEqual(contribute);
      });
    });
  });
});