import Firebase from 'firebase/app'
import ReactGA from 'react-ga'
import slugify from 'slugify'

import { prepareDocForCreate } from './helpers/firestoreHelpers'

const createPost = (values, auth) => {
  console.log('createPost')
  const {
    title,
    gallery,
    website,
    category,
    email,
    phone,
    description,
    address,
    placeId,
    categories_lvl0,
    categories_lvl1,
    fileList,
    openingHours,
    _geoloc
  } = values

  // todo: use _.pick
  values = {
    title,
    website,
    gallery,
    category,
    email,
    phone,
    description,
    address,
    placeId,
    categories_lvl0,
    categories_lvl1,
    fileList,
    _rating: 0,
    _ratingCount: 0,
    _geoloc,
    openingHours,
    photoURL: auth.photoURL
  }

  ReactGA.event({
    category: 'Post',
    action: 'Create post'
  })

  values.slug = slugify(values.title, { lower: true })
  values._likeCount = 0

  return Firebase.firestore()
    .collection('posts')
    .add(prepareDocForCreate(values))
    .then(() => values)
    .catch(error => {
      alert(`Whoops, couldn't create the post: ${error.message}`)
    })
}

export default createPost
