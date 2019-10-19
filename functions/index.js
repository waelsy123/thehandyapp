const admin = require('firebase-admin')
const functions = require('firebase-functions')

admin.initializeApp(functions.config().firebase)

// https://firebase.google.com/docs/reference/js/firebase.firestore.Settings#~timestampsInSnapshots
// temporary setting to squash error date warning
// TODO - remove once this is the firebase default behavior
admin.firestore().settings({ timestampsInSnapshots: true })

const users = require('./lib/users')
// const postLikes = require('./lib/postLikes')
const postRatings = require('./lib/postRatings')
const search = require('./lib/search')
const subscriptions = require('./lib/subscriptions')

exports.updatePostInSearchIndex = functions.firestore
  .document('posts/{postId}')
  .onWrite(search.updatePostInSearchIndex)

exports.updateStripeSubscription = functions.firestore
  .document('subscriptions/{subscriptionId}')
  .onWrite(subscriptions.updateStripeSubscription)

exports.updatePostRating = functions.firestore
  .document('postRatings/{postRatingId}')
  .onWrite(postRatings.updatePostRating)

exports.createProfile = functions.auth.user().onCreate(users.createProfile)
// exports.updateProfile = functions.auth.user().onWrite(users.updateProfile)
exports.deleteProfile = functions.auth.user().onDelete(users.deleteProfile)
