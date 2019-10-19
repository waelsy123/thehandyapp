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
    console.log(this.props)

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
          console.log('rating for this buiness: ', ratings)

          return (
            <div>
              <div>
                <Row type='flex' justify='space-between'>
                  <Col>
                    <h3>Reviews ({ratings.length})</h3>
                  </Col>
                  <Col>
                    {!userRating && (
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
                          style={{ margin: '10px' }}
                          type='primary'
                        >
                          Add review
                        </Button>
                      </div>
                    )}
                  </Col>
                </Row>
                {!userRating && (
                  <TextArea
                    style={{ width: '100%' }}
                    name='comment'
                    onChange={e => {
                      this.setState({ comment: e.target.value })
                      console.log(this.state)
                    }}
                    defaultValue={this.state.comment}
                  />
                )}
              </div>

              <div className='line' />

              <div>
                <FirestoreCollection path={'userProfiles'}>
                  {({ error, isLoading, data }) => {
                    console.log('userProfiles: ', data)
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
