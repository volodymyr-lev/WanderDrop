const mockComponent = name => {
    const component = props => {
      return React.createElement(name, props, props.children);
    };
    return component;
  };
  
  const React = require('react');
  
  // Create a mock MapView component
  const MapView = mockComponent('MapView');
  MapView.Marker = mockComponent('Marker');
  
  module.exports = {
    __esModule: true,
    default: MapView,
    Marker: MapView.Marker,
  };