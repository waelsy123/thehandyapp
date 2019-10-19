import React from 'react'
import { getCategoryById } from '../../enums/categories'
import MapPopupContent from './MapPopupContent'
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')

mapboxgl.accessToken =
  'pk.eyJ1Ijoid2FlbHN5MTIzMSIsImEiOiJjanZlemYzMGkwYzFsNDNxcGdteHZicXVvIn0.R4UKfbqoP_HZ4QWmFEzZZQ'

export default class MapContainer extends React.Component {
  componentDidMount () {
    const center = this.props.center ? this.props.center : [14.43328, 50.081106]
    const zoom = this.props.zoom ? this.props.zoom : 12.65

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center,
      zoom
    })
    const map = this.map

    const markers = this.props.items.map((item, index) => {
      return {
        id: index,
        type: 'Feature',
        properties: {
          iconName: 'baseline-location_on-24px.svg', // getCategoryById(item.category).icon,
          iconSize: [18, 18],
          description: MapPopupContent({
            hit: item
          })
        },
        geometry: {
          type: 'Point',
          coordinates: [item._geoloc.lng, item._geoloc.lat]
        }
      }
    })

    var markersCollection = {
      type: 'FeatureCollection',
      features: markers
    }

    markersCollection.features.forEach(marker => {
      var el = document.createElement('div')
      el.style.backgroundImage = `url(/icons/${marker.properties.iconName})`
      el.style.backgroundSize = 'contain'
      el.style.width = marker.properties.iconSize[0] + 'px'
      el.style.height = marker.properties.iconSize[1] + 'px'

      // create the popup
      var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        marker.properties.description
      )

      // add marker to map
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(popup)
        .addTo(map)
    })
  }

  componentWillUnmount () {
    this.map.remove()
  }

  render () {
    const style = {
      top: 0,
      bottom: 0,
      width: '100%'
    }

    return <div style={style} ref={el => (this.mapContainer = el)} />
  }
}
