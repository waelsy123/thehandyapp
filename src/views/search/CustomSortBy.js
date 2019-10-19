import React from 'react'
import { connectSortBy } from 'react-instantsearch-dom'
import { Button } from 'antd'

const SortBy = ({ items, currentRefinement, refine }) => {
  return (
    <div className='sort-filters'>
      <div className='sort-filters-label'>Sort by: </div>
      {items.map(item => (
        <div key={item.value}>
          <Button
            onClick={event => {
              event.preventDefault()
              refine(item.value)
            }}
            style={{ fontWeight: item.isRefined ? 'bold' : '' }}
            type='link'
          >
            {item.label}
          </Button>
        </div>
      ))}
    </div>
  )
}

const CustomSortBy = connectSortBy(SortBy)

export default CustomSortBy
