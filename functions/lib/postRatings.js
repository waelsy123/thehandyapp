const admin = require('firebase-admin')

// update _rating on a post when it's liked or unliked
exports.updatePostRating = (change, context) => {
  const postId = change.after.exists
    ? change.after.data().postId
    : change.before.data().postId
  return getAvaragePostRating(postId).then(({ avarageRating, ratingCount }) => {
    setPostAvarageRating(postId, avarageRating)
    return setPostRatingCount(postId, ratingCount)
  })
}

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length

const getAvaragePostRating = postId => {
  return admin
    .firestore()
    .collection('postRatings')
    .where('postId', '==', postId)
    .get()
    .then(snapshot => {
      const arrayOfValues = snapshot.docs.map(item => item.data().value)
      console.log(arrayOfValues)

      return {
        avarageRating: average(arrayOfValues),
        ratingCount: arrayOfValues.length
      }
    })
}

const setPostAvarageRating = (postId, avarageRating) => {
  return admin
    .firestore()
    .collection('posts')
    .doc(postId)
    .update({
      _rating: avarageRating
    })
}

const setPostRatingCount = (postId, ratingCount) => {
  return admin
    .firestore()
    .collection('posts')
    .doc(postId)
    .update({
      _ratingCount: ratingCount
    })
}
