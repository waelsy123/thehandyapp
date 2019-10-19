import React from 'react'
import MapContainer from './mapContainer'

export default class MiniMap extends React.Component {
  render () {
    return (
      <MapContainer
        items={[this.props.item]}
        center={this.props.center}
        zoom={this.props.zoom}
      />
    )
  }
}
