// lets users search posts using the Algolia API
// https://community.algolia.com/react-instantsearch/Getting_started.html#install-react-instantsearch

import React from 'react'
import {
  InstantSearch,
  Configure,
  HierarchicalMenu,
  RatingMenu
} from 'react-instantsearch-dom'
import { Page } from '../../styles/layout'
import CustomHits from './SearchResults'
import CustomSortBy from './CustomSortBy'
import { CustomGeoSearch } from './CustomeGeoSearch'
import { CustomSearchBox } from './CustomSearchBox'
import { CustomRatingMenu } from './CustomRatingMenu'
import { Icon, Input, Select, Button, Slider } from 'antd'
import LocationSearchInput from '../searchPlaces/locationSearchInput'
const { Search } = Input
const { Option, OptGroup } = Select

class SearchPage extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      lat: window.geo.latitude,
      lng: window.geo.longitude,
      radius: 10000,
      showMap: false
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        console.log(this.state)
        this.setState({ lat, lng })
      })
    } else {
      console.warn('Geolocation is not supported by this browser.')
    }
  }

  switchToList = () => {
    this.setState({ showMap: false })
  }

  switchToMap = () => {
    this.setState({ showMap: true })
  }

  handleRadiusSelect = radius => {
    this.setState({ radius })
  }

  handleAddressSelect = address => {
    const { location } = address.geometry
    this.setState({ lat: location.lat(), lng: location.lng(), radius: 10000 })
  }

  render () {
    const { lat, lng } = this.state
    const config = Object.assign({}, lat && { aroundLatLng: `${lat}, ${lng}` })
    const geoSerachConfig = Object.assign(
      {},
      lat && {
        initialPosition: {
          lat,
          lng
        }
      }
    )

    return (
      <Page>
        {this.state && this.state.lat && (
          <InstantSearch
            appId={process.env.REACT_APP_ALGOLIA_APP_ID}
            apiKey={process.env.REACT_APP_ALGOLIA_SEARCH_KEY}
            indexName='posts'
          >
            <Configure
              {...config}
              getRankingInfo
              aroundRadius={this.state.radius}
            />

            <div className='search-bar-container col-xs-12 col-sm-12 col-md-4'>
              <div className='search-filters-container'>
                <div className='filter-group'>
                  <div className='icon-name-wrapper'>
                    <Icon type='search' />
                    <p>Search</p>
                  </div>
                  <div className='filters'>
                    <div className='filter-item'>
                      <CustomSearchBox autofocus />
                    </div>
                  </div>
                </div>

                <div className='filter-group'>
                  <div className='icon-name-wrapper'>
                    <Icon type='clock-circle' />
                    <p>Location</p>
                  </div>
                  <div className='filters'>
                    <div className='filter-item'>
                      <LocationSearchInput
                        autoComplete='new-password'
                        placeholder='Change city'
                        types={['(cities)']}
                        onSelect={this.handleAddressSelect}
                        suffix={<Icon type='environment' />}
                      />
                    </div>
                    <div className='filter-item'>
                      <Slider
                        onChange={value => {
                          this.handleRadiusSelect(value * 1000)
                        }}
                        min={1}
                        max={1000}
                        defaultValue={50}
                      />
                    </div>
                  </div>
                </div>

                <div className='filter-group'>
                  <div className='icon-name-wrapper'>
                    <Icon type='align-left' />
                    <p>Categories</p>
                  </div>
                  <div className='filters'>
                    <div className='filter-item'>
                      <HierarchicalMenu
                        attributes={['categories_lvl0', 'categories_lvl1']}
                      />
                    </div>
                  </div>
                </div>

                <div className='filter-group'>
                  <div className='icon-name-wrapper'>
                    <Icon type='star' />
                    <p>Rating</p>
                  </div>
                  <div className='filters'>
                    <div className='filter-item'>
                      <CustomRatingMenu attribute='_rating' min={0} max={5} />
                    </div>
                  </div>
                </div>
              </div>
              <div className='search-filters-toggle-container' />
            </div>

            <div className='search-map-container col-xs-12 col-sm-12 col-md-8'>
              <div className='switcher' style={{ marginBottom: '10px' }}>
                <Button
                  icon='bars'
                  type={this.state.showMap ? '' : 'primary'}
                  onClick={() => this.switchToList()}
                />
                <Button
                  icon='global'
                  type={this.state.showMap ? 'primary' : ''}
                  onClick={() => this.switchToMap()}
                />
              </div>
              <div className={this.state.showMap ? '' : 'hidden-in-mobile'}>
                <CustomGeoSearch
                  {...geoSerachConfig}
                  radius={this.state.radius}
                />
              </div>
              <div className={this.state.showMap ? 'hidden-in-mobile' : ''}>
                <CustomSortBy
                  defaultRefinement='posts'
                  items={[
                    { value: 'posts', label: 'Most relevent' },
                    { value: 'posts_rating_desc', label: 'Top rated' },
                    { value: 'posts_rating_count_desc', label: 'Popular' }
                  ]}
                />
                <CustomHits />
              </div>
            </div>
          </InstantSearch>
        )}
      </Page>
    )
  }
}

export default SearchPage
