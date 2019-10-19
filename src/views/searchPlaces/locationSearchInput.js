import React from 'react'
import { AutoComplete, Input, Spin, Icon } from 'antd'
import * as _ from 'lodash'

export default class LocationSearchInput extends React.Component {
  state = {
    address: this.props.address,
    dataSource: [],
    loading: false,
    results: []
  }

  getMap = () =>
    new window.google.maps.Map(document.createElement('div'), {
      center: { lat: -33.866, lng: 151.196 },
      zoom: 15
    })

  setLocationByPlaceId = item => {
    var options = {
      placeId: item.place_id,
      fields: ['name', 'formatted_address', 'place_id', 'geometry']
    }

    var service = new window.google.maps.places.PlacesService(this.getMap())
    service.getDetails(options, place => {
      this.props.onSelect(place)
    })
  }

  handleSearch = async input => {
    const { latitude, longitude } = window.geo
    const types = this.props.types || ['address']

    const myLatLng = new window.google.maps.LatLng({
      lat: latitude,
      lng: longitude
    })

    const debounceSeach = _.debounce(() => {
      this.setState({
        loading: true
      })

      const seachClient = new window.google.maps.places.AutocompleteService()

      seachClient.getPlacePredictions(
        { input, types, location: myLatLng, radius: 10000 },
        (results, status) => {
          console.log(results)
          this.setState({
            loading: false,
            results,
            dataSource:
              results === null
                ? []
                : results.map((item, index) => ({
                  text: item.description,
                  value: index
                }))
          })
        }
      )
    }, 400)

    debounceSeach()
  }

  handleKeyPress = ev => {
    console.log('handleKeyPress', ev)
  }

  onSelect = index => {
    this.setLocationByPlaceId(this.state.results[index])
  }

  render () {
    const { loading, dataSource } = this.state
    console.log(
      'TCL: LocationSearchInput -> render -> this.props.defaultValue',
      this.props.defaultValue
    )

    return (
      <AutoComplete
        dataSource={dataSource}
        onSelect={this.onSelect}
        onSearch={this.handleSearch}
        style={{ width: '100%' }}
        defaultValue={this.props.defaultValue}
      >
        <Input
          autocomplete='new-password'
          placeholder={this.props.placeholder || 'Your address'}
          id='googlePlaceSearchBox1'
          suffix={
            <div>
              {loading ? (
                <Icon type='loading' style={{ fontSize: 18 }} spin />
              ) : (
                <span />
              )}
              {this.props.suffix}
            </div>
          }
        />
      </AutoComplete>
    )
  }
}
