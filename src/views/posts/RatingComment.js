import React from 'react'
import { Row, Col, Rate, Input } from 'antd'

const RatingComment = ({ comment, value, createdOn, user, width }) => {
  const createdOnISO = new Date(createdOn.seconds * 1000).toISOString()
  const avatar = user
    ? user.photoURL
    : 'https://avataaars.io/?avatarStyle=Transparent&topType=LongHairNotTooLong&accessoriesType=Kurt&hairColor=BrownDark&facialHairType=MoustacheFancy&facialHairColor=BrownDark&clotheType=ShirtCrewNeck&clotheColor=PastelBlue&eyeType=Cry&eyebrowType=RaisedExcitedNatural&mouthType=Smile&skinColor=Tanned'
  const displayName = user ? user.displayName : 'anonymous'

  return (
    <div className='review-block'>
      <img className='review-avatar' alt={displayName} src={avatar} />

      <div>
        <Row type='flex' justify='space-between'>
          <Col style={{ display: 'flex' }}>
            <p className='author-name'>{displayName} </p>
            <span>({createdOnISO})</span>
          </Col>
          <Col>
            <Rate allowHalf disabled value={value} />
          </Col>
        </Row>
        <p className='review-comment'>"{comment}"</p>
      </div>
    </div>
  )
}

export default RatingComment
