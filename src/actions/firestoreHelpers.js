import Firebase from 'firebase/app'
import 'firebase/auth'

export const getCurrentUser = async () => {
  return new Promise(function (resolve, reject) {
    Firebase.auth().onAuthStateChanged(user => {
      resolve(user)
    })
  })
}

export const getUserActivity = async ({ userId }) => {
  const activity = await Firebase.firestore()
    .collection('posts')
    .where('createdBy', '==', userId)
    .get()
    .then(snapshot => {
      snapshot = snapshot.docs.map(item => ({ ...item.data(), id: item.id }))
      return snapshot[0]
    })

  return activity
}

const getUserConversation = async ({ userId }) => {
  const conversations = await Firebase.firestore()
    .collection('conversations')
    .where('userId', '==', userId)
    .get()
    .then(snapshot => {
      snapshot = snapshot.docs.map(item => ({ ...item.data(), id: item.id }))

      return snapshot
    })

  return conversations
}

const getActivityConversations = async ({ activityId }) => {
  const conversations = await Firebase.firestore()
    .collection('conversations')
    .where('activityId', '==', activityId)
    .get()
    .then(snapshot => {
      snapshot = snapshot.docs.map(item => ({ ...item.data(), id: item.id }))

      return snapshot
    })

  return conversations
}

export const getNumberOfUnreadConversations = async () => {
  const user = await getCurrentUser()
  const activity = await getUserActivity({ userId: user.uid })

  const userConversations = await getUserConversation({ userId: user.uid })
  const activityConversations = await getActivityConversations({
    activityId: activity.id
  })

  return {
    unReadConversationsForActivity: activityConversations.filter(
      item => !item.readByActivity
    ).length,
    unReadConversationsForUser: userConversations.filter(
      item => !item.readByUser
    ).length
  }
}

export const getActivityById = async activityId => {
  const activity = await Firebase.firestore()
    .collection('posts')
    .doc(activityId)
    .get()
    .then(doc => {
      if (!doc.exists) {
        console.log(`No such activity with id: ${activityId}!`)
      } else {
        return { ...doc.data(), id: activityId }
      }
    })
    .catch(err => {
      console.log('Error getting document', err)
    })

  return activity
}

export default getNumberOfUnreadConversations
