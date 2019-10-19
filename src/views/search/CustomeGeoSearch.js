import React from 'react'
import MarkerClusterer from '@google/markerclusterer'
import { connectGeoSearch } from 'react-instantsearch-dom'
import { getCategoryById } from '../../enums/categories'
import MapPopupContent from './../map/MapPopupContent'

class GeoSearch extends React.Component {
  isUserInteraction = true
  markers = []

  fitBoundsToNewRadius = radius => {
    const refinedRadius = radius * 0.8
    console.log(refinedRadius)
    const centerSfo = new window.google.maps.LatLng(
      this.center.lat,
      this.center.lng
    )
    const circle = new window.google.maps.Circle({
      radius: refinedRadius,
      center: centerSfo
    })
    const bounds = circle.getBounds()

    this.instance.fitBounds(bounds)
  }

  componentDidMount () {
    const { refine, initialPosition } = this.props

    console.log(initialPosition)

    this.center = initialPosition || { lng: 14.43328, lat: 50.081106 }
    this.instance = new window.google.maps.Map(this.el, {
      center: this.center,
      zoom: 11
    })
    window.map = this.instance

    this.myLocationPoint = new window.google.maps.Marker({
      position: initialPosition,
      icon: { url: `/Disc_Plain_blue.svg` },
      size: new window.google.maps.Size(14, 14),
      // The origin for this image is (0, 0).
      origin: new window.google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new window.google.maps.Point(0, 140),
      map: this.instance
    })

    this.InfoWindow = new window.google.maps.InfoWindow()

    this.instance.addListener('bounds_changed', function () {
      if (this.isUserInteraction) {
        const ne = this.instance.getBounds().getNorthEast()
        const sw = this.instance.getBounds().getSouthWest()

        refine({
          northEast: { lat: ne.lat, lng: ne.lng },
          southWest: { lat: sw.lat, lng: sw.lng }
        })
      }
    })
  }

  componentDidUpdate () {
    const { hits, radius, initialPosition } = this.props

    this.center = initialPosition
    console.log(initialPosition)

    this.markers.forEach(marker => {
      marker.setMap(null)
    })

    this.markerCluster && this.markerCluster.clearMarkers()

    this.markers = hits.map(hit => {
      const marker = new window.google.maps.Marker({
        position: hit._geoloc,
        icon: `/icons/baseline-location_on-24px.svg`,
        map: this.instance
      })

      marker.addListener('click', () => {
        if (this.InfoWindow.getMap()) {
          this.InfoWindow.close()
        }

        this.InfoWindow.setContent(MapPopupContent({ hit }))
        this.InfoWindow.open(this.instance, marker)
      })

      return marker
    })

    this.markerCluster = new MarkerClusterer(this.instance, this.markers, {
      imagePath:
        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    })

    this.circle && this.circle.setMap(null)
    this.circle = new window.google.maps.Circle({
      strokeColor: '#527062',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#D3F2D3',
      fillOpacity: 0.35,
      map: this.instance,
      center: this.center,
      radius: Number(radius)
    })

    this.fitBoundsToNewRadius(radius)

    this.isUserInteraction = true
  }

  render () {
    const { currentRefinement, refine } = this.props

    return (
      <div>
        <div style={{ height: 500 }} ref={c => (this.el = c)} />
        {Boolean(currentRefinement) && (
          <button onClick={() => refine()}>Clear map refinement</button>
        )}
      </div>
    )
  }
}

export const CustomGeoSearch = connectGeoSearch(GeoSearch)
