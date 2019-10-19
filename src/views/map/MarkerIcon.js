import React from 'react'
import { CustomMarker } from 'react-instantsearch-dom-maps'
import { getCategoryById } from '../../enums/categories'
import MapPopupContent from './MapPopupContent'

export default class MarkerIcon extends React.Component {
  render () {
    const { hit } = this.props
    const InfoWindow = new window.google.maps.InfoWindow()

    const onClickMarker = ({ hit, marker }) => {
      if (InfoWindow.getMap()) {
        InfoWindow.close()
      }

      InfoWindow.setContent(MapPopupContent({ hit }))
      InfoWindow.open(marker.getMap(), marker)
    }

    return (
      <CustomMarker
        onClick={({ marker }) => {
          onClickMarker({
            hit,
            marker
          })
        }}
        key={hit.objectID}
        hit={hit}
      >
        <div
          style={{
            backgroundImage: `url(/icons/${
              getCategoryById(hit.category).icon
            })`,
            backgroundSize: 'contain',
            width: '24px',
            height: '24px'
          }}
        />
      </CustomMarker>
    )
  }
}
