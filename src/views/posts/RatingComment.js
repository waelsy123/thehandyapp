import React from 'react'
import { Row, Col, Rate, Input } from 'antd'
import moment from 'moment'
import { Route } from 'react-router-dom'

const RatingComment = ({ comment, value, createdOn, user, width }) => {
  const avatar = user
    ? user.photoURL
    : 'https://avataaars.io/?avatarStyle=Transparent&topType=LongHairNotTooLong&accessoriesType=Kurt&hairColor=BrownDark&facialHairType=MoustacheFancy&facialHairColor=BrownDark&clotheType=ShirtCrewNeck&clotheColor=PastelBlue&eyeType=Cry&eyebrowType=RaisedExcitedNatural&mouthType=Smile&skinColor=Tanned'
  const displayName = user ? user.displayName : 'anonymous'

  return (
    <Route
      render={({ history }) => (
        <div className='review-block'>
          <img
            onClick={() => history.push(`/user/${user.uid}`)}
            className='review-avatar'
            alt={displayName}
            src={avatar}
          />

          <div>
            <Row type='flex' justify='space-between'>
              <Col style={{ display: 'flex' }}>
                <p
                  onClick={() => history.push(`/user/${user.uid}`)}
                  className='author-name'
                >
                  {displayName}
                </p>
                <span>({moment(createdOn.seconds).calendar()})</span>
              </Col>
              <Col>
                <Rate allowHalf disabled value={value} />
              </Col>
            </Row>
            <p className='review-comment'>"{comment}"</p>
          </div>
        </div>
      )}
    />
  )
}

export default RatingComment
