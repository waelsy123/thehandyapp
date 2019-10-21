import React from 'react'
import { FirestoreCollection } from 'react-firestore'
import { TextArea } from '../../styles/forms'
import { Row, Col, Button, Rate } from 'antd'

import ratePost from '../../actions/ratePost'
import RatingComment from './RatingComment'

class RateElement extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      val: null,
      comment: ''
    }
  }

  render () {
    const { post, disabled, auth } = this.props

    if (!auth) {
      return <button disabled>like</button>
    }

    return (
      <FirestoreCollection
        path={'postRatings'}
        filter={[['postId', '==', post.id]]}
      >
        {({ error, isLoading, data }) => {
          const ratings = data
          if (isLoading || error) {
            return <div>...</div>
          }

          const userRating = ratings.filter(
            item => item.createdBy === auth.uid
          )[0]

          const canRate = !userRating && post.createdBy !== auth.uid

          return (
            <div>
              <div>
                <Row type='flex' justify='space-between'>
                  <Col>
                    <h4 style={{ color: '#37404e' }}>
                      {canRate && ratings.length === 0
                        ? 'Be the first to write a review'
                        : `Reviews (${ratings.length})`}
                    </h4>
                  </Col>
                  <Col>
                    {canRate && (
                      <div>
                        <Rate
                          onChange={value => {
                            this.setState({ val: value })
                          }}
                        />
                        <Button
                          onClick={() => {
                            if (userRating) {
                              console.log(
                                'you already rated this activity, do you want to change?'
                              )
                            } else {
                              ratePost(post, this.state.val, this.state.comment)
                            }
                          }}
                          style={{ marginLeft: '16px' }}
                          type='primary'
                        >
                          Add review
                        </Button>
                      </div>
                    )}
                  </Col>
                </Row>
                {canRate && (
                  <div className='review-input-container'>
                    <img
                      style={{ width: '100%', borderRadius: '90px' }}
                      src={auth.photoURL}
                    />
                    <TextArea
                      style={{ width: '100%' }}
                      name='comment'
                      onChange={e => {
                        this.setState({ comment: e.target.value })
                        console.log(this.state)
                      }}
                      defaultValue={this.state.comment}
                    />
                  </div>
                )}
              </div>

              <div className='line' />

              <div>
                <FirestoreCollection path={'userProfiles'}>
                  {({ error, isLoading, data }) => {
                    const users = data

                    return (
                      ratings &&
                      ratings.map(item => {
                        item.user = users.filter(
                          user => user.uid === item.createdBy
                        )[0]

                        return (
                          <RatingComment key={item.id} {...item} width={15} />
                        )
                      })
                    )
                  }}
                </FirestoreCollection>
              </div>
            </div>
          )
        }}
      </FirestoreCollection>
    )
  }
}

export default RateElement
