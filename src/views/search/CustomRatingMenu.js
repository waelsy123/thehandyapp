import React from 'react'
import { connectRange } from 'react-instantsearch-dom'
import { Rate } from 'antd'

const RatingMenu = ({
  currentRefinement,
  min,
  max,
  count,
  refine,
  createURL
}) => (
  <div>
    {'At least: '}
    <Rate
      onChange={value => {
        refine({ min: value })
      }}
    />
  </div>
)

export const CustomRatingMenu = connectRange(RatingMenu)
