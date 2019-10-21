import Firebase from 'firebase/app'
import ReactGA from 'react-ga'
import { prepareDocForUpdate } from './helpers/firestoreHelpers'
import _ from 'lodash'

const updatePost = (postId, values) => {
  ReactGA.event({
    category: 'Post',
    action: 'Update post'
  })

  values = _.omitBy(values, undefined)

  return Firebase.firestore()
    .collection('posts')
    .doc(postId)
    .update(prepareDocForUpdate(values))
    .catch(error => {
      alert(`Whoops, couldn't edit the post: ${error.message}`)
    })
}

export default updatePost
