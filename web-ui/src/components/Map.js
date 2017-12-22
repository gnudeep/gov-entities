import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
 
const AnyReactComponent = ({ text }) => <div>{text}</div>;
 
class SimpleMap extends Component {
  static defaultProps = {
    center: {lat: 6.927079, lng: 79.861244},
    zoom: 8
  };
 
  render() {
    return (
      <GoogleMapReact
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
      >
        <AnyReactComponent
          lat={6.927079}
          lng={79.861244}
          text={'Sri Lanka'}
        />
      </GoogleMapReact>
    );
  }
}

export default SimpleMap;