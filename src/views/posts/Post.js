import React from 'react'
import { FirestoreCollection } from 'react-firestore'
import Error from '../misc/Error'
import FirebaseAuth from '../misc/FirebaseAuth'
import LikeButton from './LikeButton'
import RatingElement from './RatingElement'
import { InternalLink } from '../../styles/links'
import { Page } from '../../styles/layout'
import MiniMap from '../map/miniMap'
import { Row, Col, Button, Rate, Icon, Input } from 'antd'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import OpeningHours from '../openingHours/OpeningHours'
import { HeaderLink } from '../../styles/links'

const Post = ({ match }) => (
  <Page>
    <FirebaseAuth>
      {({ isLoading, error, auth }) => {
        console.log('TCL: auth', auth)
        return (
          <FirestoreCollection
            path={'posts'}
            filter={['slug', '==', match.params.slug]}
          >
            {({ error, isLoading, data }) => {
              console.log('TCL: data', data)
              if (error) {
                return <Error error={error} />
              }

              if (isLoading) {
                return <p>loading...</p>
              }

              if (data.length === 0) {
                return <Error />
              }

              const images = []
              const post = data[0]
              const avatar = post.photoURL
                ? post.photoURL
                : 'https://avataaars.io/?avatarStyle=Transparent&topType=LongHairNotTooLong&accessoriesType=Kurt&hairColor=BrownDark&facialHairType=MoustacheFancy&facialHairColor=BrownDark&clotheType=ShirtCrewNeck&clotheColor=PastelBlue&eyeType=Cry&eyebrowType=RaisedExcitedNatural&mouthType=Smile&skinColor=Tanned'

              const mapCenter = [post._geoloc.lng, post._geoloc.lat]
              return (
                <div className='row'>
                  <div className='col-sm-12 col-md-8'>
                    <div width='100%' className='title-wrapper'>
                      <div>
                        <img
                          className='activity-logo'
                          src={avatar}
                          alt={post.title}
                        />
                      </div>
                      <div className='activity-page-block'>
                        <h1 className='activity-title'>{post.title}</h1>
                        <p className='activity-address'>{post.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className='col-sm-12 col-md-4'>
                    <Rate type='star' value={post._rating} disabled allowHalf />
                    <Button type='link'>{post._ratingCount} reviews</Button>
                  </div>
                  <div className='col-sm-12 col-md-12 v-space' />

                  <div className='col-sm-12 col-md-8'>
                    <ImageGallery
                      className='galary'
                      items={images.concat(
                        post.fileList.map(fileUrl => ({
                          original: fileUrl,
                          thumbnail: fileUrl
                        }))
                      )}
                    />

                    <p style={{ margin: '20px 0' }}>{post.description}</p>
                  </div>
                  <div className=' col-sm-12 col-md-4 right-container mini-map-wrapper'>
                    <div style={{ width: '100%' }}>
                      <MiniMap item={post} center={mapCenter} zoom='16' />
                    </div>

                    <div className='section'>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'auto 120px'
                        }}
                      >
                        <div className='section-title'>
                          <Icon className='activity-icon' type='shop' />
                          <p className='activity-name'> {post.title} </p>
                        </div>
                        <HeaderLink
                          to={`/messages?new=true&activityId=${post.id}`}
                        >
                          <Button icon='message'>Contact</Button>
                        </HeaderLink>
                      </div>
                      <div className='section-content'>
                        <p className='activity-address'>{post.address}</p>
                        <Button type='link'>Show direction </Button>
                        <div style={{ display: 'flex' }}>
                          <Icon style={{ marginTop: '3px' }} type='phone' />
                          <p style={{ paddingLeft: '7px' }}> {post.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className='section'>
                      <div className='section-title'>
                        <Icon className='activity-icon' type='clock-circle' />
                        <p className='activity-name'>Availability </p>
                      </div>
                      <div className='section-content'>
                        <OpeningHours value={post.openingHours} />
                      </div>
                    </div>
                  </div>

                  <div className='col-sm-12 col-md-8'>
                    <RatingElement auth={auth} post={post} />

                    <FirebaseAuth>
                      {({ auth }) =>
                        auth ? (
                          <InternalLink to={`/${post.slug}/edit`}>
                            Edit
                          </InternalLink>
                        ) : null
                      }
                    </FirebaseAuth>
                  </div>
                </div>
              )
            }}
          </FirestoreCollection>
        )
      }}
    </FirebaseAuth>
  </Page>
)

export default Post
