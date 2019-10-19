import React from 'react'
import { connectHits } from 'react-instantsearch-dom'
import { InternalLink } from '../../styles/links'
import MiniRatingElement from '../posts/MiniRatingElement'
import { Rate } from 'antd'

const Hit = ({ hit }) => {
  // take first gallary pic, or profile pic url or avataaar
  const avatar =
    hit.fileList && hit.fileList.length > 0
      ? hit.fileList[0]
      : hit.photoURL
        ? hit.photoURL
        : 'https://avataaars.io/?avatarStyle=Transparent&topType=LongHairNotTooLong&accessoriesType=Kurt&hairColor=BrownDark&facialHairType=MoustacheFancy&facialHairColor=BrownDark&clotheType=ShirtCrewNeck&clotheColor=PastelBlue&eyeType=Cry&eyebrowType=RaisedExcitedNatural&mouthType=Smile&skinColor=Tanned'

  let distance = hit._rankingInfo.geoDistance
  let unit = 'm'
  if (distance > 1000) {
    distance = (distance / 1000).toFixed(1)
    unit = 'km'
  }

  hit.id = hit.objectID

  return (
    <div
      onClick={() => {
        window.location = `/${hit.slug}`
      }}
      to={`/${hit.slug}`}
      key={hit.objectID}
      className='result-item'
    >
      <img className='galary' alt='avatar' src={avatar} />
      <div className='result-item-info'>
        <div className='name-and-rating'>
          <div>
            <h3>{hit.title}</h3>
          </div>
          <div className='rating'>
            <Rate disabled allowHalf value={hit._rating} />
          </div>
        </div>
        <div className='distance'>
          Distance from me: {distance} {unit}
        </div>
        <div className='category'>Category: Hair care</div>
        <div className='description'>" {hit.description}... "</div>
      </div>
    </div>
  )
}

const Hits = ({ hits }) => {
  return (
    <div className='results-container'>
      {hits.map(hit => (
        <Hit key={hit.objectID} hit={hit} />
      ))}
    </div>
  )
}
const CustomHits = connectHits(Hits)

export default CustomHits
