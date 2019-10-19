import React from 'react'
import { connectSearchBox } from 'react-instantsearch-dom'
import { Input, Icon } from 'antd'

const SearchBox = ({ currentRefinement, refine }) => (
  <Input
    type='search'
    value={currentRefinement}
    onChange={event => refine(event.currentTarget.value)}
    placeholder='Search here..'
    suffix={<Icon type='search' />}
  />
)

export const CustomSearchBox = connectSearchBox(SearchBox)
