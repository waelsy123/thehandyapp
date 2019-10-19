import React from 'react'
import Rating from 'react-rating'

const MiniRateElement = ({ post, width }) => (
  <Rating
    initialRating={post._rating}
    readonly
    emptySymbol={
      <img
        width={width}
        height={width}
        alt={'*'}
        src='ratingIcons/star-empty.png'
        className='icon'
      />
    }
    fullSymbol={
      <img
        width={width}
        height={width}
        alt={'.'}
        src='ratingIcons/star-full.png'
        className='icon'
      />
    }
  />
)

export default MiniRateElement
