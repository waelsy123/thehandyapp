import React from 'react'
import { FirestoreCollection } from 'react-firestore'

import Error from '../misc/Error'
import deletePost from '../../actions/deletePost'
import updatePost from '../../actions/updatePost'
import PostForm from './PostForm'
import { Page } from '../../styles/layout'

const PostEdit = ({ match, history }) => (
  <Page>
    <FirestoreCollection
      path={'posts'}
      filter={['slug', '==', match.params.slug]}
    >
      {({ error, isLoading, data }) => {
        if (error) {
          return <Error error={error} />
        }

        if (isLoading) {
          return <p>loading...</p>
        }

        if (data.length === 0) {
          return <Error />
        }

        const post = data[0]

        console.log(post)
        return (
          <div className='activity-form-layout-content col-xs-12 col-sm-12  col-md-12 col-lg-12'>
            <div className='activity-form-container '>
              <PostForm
                {...post}
                onSubmit={values =>
                  updatePost(post.id, values).then(() =>
                    history.push(`/${post.slug}`)
                  )
                }
              />
              <br />
              <button
                onClick={() => deletePost(post).then(() => history.push(`/`))}
              >
                Delete activity
              </button>
            </div>
          </div>
        )
      }}
    </FirestoreCollection>
  </Page>
)

export default PostEdit
