import React from 'react'
import { Route } from 'react-router-dom'
import { Button, Rate } from 'antd'
import logOut from '../../actions/logOut'
import { FirestoreDocument, FirestoreCollection } from 'react-firestore'
import { InternalLink } from '../../styles/links'

const Profile = ({ auth, userId, match }) => {
  userId = userId || match.params.userId

  let isLoggedIn = false
  let isProfileOwner = false

  if (window.user) {
    isLoggedIn = true

    if (window.user.uid === userId) {
      isProfileOwner = true
    }
  }

  console.log(userId)

  return (
    <Route
      render={({ history }) => (
        <FirestoreDocument path={`/userProfiles/${userId}`}>
          {({ error, isLoading, data }) => {
            if (error || isLoading) return <div />
            const profile = data

            return (
              <div className='profile-page'>
                <div className=' col-sm-12 col-md-4 profile-info-container'>
                  <div className='profile-pic-container'>
                    <img src={profile.photoURL} alt={profile.displayName} />
                  </div>
                  <center>
                    <h3>
                      <strong>{profile.displayName}</strong>
                    </h3>
                  </center>
                  <div className='section'>
                    {isProfileOwner && <p>{profile.email}</p>}
                    {isProfileOwner && (
                      <Button
                        onClick={() => logOut().then(() => history.push(`/`))}
                      >
                        Log out
                      </Button>
                    )}
                  </div>
                </div>

                <FirestoreCollection
                  filter={['createdBy', '==', userId]}
                  path={`/posts`}
                >
                  {({ error, isLoading, data }) => {
                    if (error || isLoading) return <div />
                    const activity = data[0]
                    console.log('TCL: activity', activity)

                    return (
                      <div className=' col-sm-12 col-md-8 '>
                        <div className='card-container'>
                          <div className='card-title'>
                            <h4>Activity</h4>
                          </div>
                          <div className='card-content'>
                            <div className='activity-info-card'>
                              <InternalLink to={`/${activity.slug}`}>
                                <div className='activity-pic'>
                                  <img src={activity.fileList[0]} />
                                </div>
                              </InternalLink>

                              <InternalLink to={`/${activity.slug}/edit`}>
                                <div className='activity-info'>
                                  <div>{activity.title}</div>
                                  <div>
                                    <Rate
                                      disabled
                                      allowHalf
                                      value={activity._rating}
                                    />
                                  </div>
                                </div>
                              </InternalLink>

                              <div className='activity-actions'>
                                <Button
                                  onClick={() =>
                                    history.push(`/${activity.slug}`)
                                  }
                                  type='primary'
                                >
                                  View
                                </Button>
                                {isProfileOwner && (
                                  <Button
                                    onClick={() =>
                                      history.push(`/${activity.slug}/edit`)
                                    }
                                    type='primary'
                                  >
                                    Edit
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }}
                </FirestoreCollection>
              </div>
            )
          }}
        </FirestoreDocument>
      )}
    />
  )
}

export default Profile
