import Firebase from 'firebase/app'
import ReactGA from 'react-ga'

import { prepareDocForCreate } from './helpers/firestoreHelpers'

const ratePost = (post, value, comment) => {
  ReactGA.event({
    category: 'Post',
    action: 'Rate post'
  })

  const rating = prepareDocForCreate({
    postId: post.id,
    value,
    comment
  })

  return Firebase.firestore()
    .collection('postRatings')
    .add(rating)
}

export default ratePost
