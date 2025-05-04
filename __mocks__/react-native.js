// __mocks__/react-native.js
const ReactNative = jest.createMockFromModule('react-native');

// Mock Alert
ReactNative.Alert = {
  alert: jest.fn(),
};

// Mock StyleSheet
ReactNative.StyleSheet = {
  create: styles => styles,
  hairlineWidth: 1,
  flatten: jest.fn().mockImplementation(style => style),
};

// Mock Dimensions
ReactNative.Dimensions = {
  get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
};

// Mock Animated
ReactNative.Animated = {
  Value: jest.fn().mockImplementation(() => ({
    setValue: jest.fn(),
    interpolate: jest.fn(),
  })),
  timing: jest.fn().mockReturnValue({
    start: jest.fn(cb => cb && cb()),
  }),
  spring: jest.fn().mockReturnValue({
    start: jest.fn(cb => cb && cb()),
  }),
  View: 'Animated.View',
  Text: 'Animated.Text',
  Image: 'Animated.Image',
  createAnimatedComponent: jest.fn().mockImplementation(component => component),
};

// Mock View, Text, etc.
ReactNative.View = 'View';
ReactNative.Text = 'Text';
ReactNative.TextInput = 'TextInput';
ReactNative.ScrollView = 'ScrollView';
ReactNative.TouchableOpacity = 'TouchableOpacity';
ReactNative.Image = 'Image';

// Mock Modal
ReactNative.Modal = ({ children, visible, ...props }) => {
    const React = require('react');
    return visible ? React.createElement('Modal', props, children) : null;
};

module.exports = ReactNative;