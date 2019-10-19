import Firebase from 'firebase/app'
import ReactGA from 'react-ga'
import 'firebase/auth'

import {
  prepareDocForCreate,
  prepareDocForUpdate
} from './helpers/firestoreHelpers'
import { SenderTypes } from '../enums/enums'
import { getActivityById } from './firestoreHelpers'

const createNewMessage = async (
  { messageText, activityId, conversationId, timestamp },
  cb
) => {
  console.log('createNewMessage')

  ReactGA.event({
    category: 'Conversations',
    action: 'Create new message'
  })

  const senderId = Firebase.auth().currentUser
    ? Firebase.auth().currentUser.uid
    : null

  const senderType =
    senderId === activityId ? SenderTypes.Activity : SenderTypes.User

  let messageValues = {
    senderType,
    messageText,
    activityId,
    conversationId: conversationId || 0,
    senderType,
    timestamp,
    senderId
  }

  console.log('createNewMessage', messageValues)

  // const activity = await getActivityById(activityId)

  const messageId = await Firebase.firestore()
    .collection('messages')
    .add(prepareDocForCreate(messageValues))
    .then(newMessageDocument => {
      return newMessageDocument.id
    })
    .catch(error => {
      alert(`Whoops, couldn't send new message: ${error.message}`)
    })

  if (conversationId === undefined) {
    const conversationValues = {
      lastMessageId: messageId,
      userId: messageValues.senderId,
      activityId,
      // activityOnwerId: activity.createdBy,
      readByUser: true,
      readByActivity: false
    }

    conversationId = await Firebase.firestore()
      .collection('conversations')
      .add(prepareDocForCreate(conversationValues))
      .then(newConversationDocument => {
        return newConversationDocument.id
      })
      .catch(error => {
        alert(`Whoops, couldn't create new conversation: ${error.message}`)
      })

    await Firebase.firestore()
      .collection('messages')
      .doc(messageId)
      .update(prepareDocForUpdate({ conversationId }))
      .then(newMessageDocument => {
        return newMessageDocument
      })
      .catch(error => {
        alert(`Whoops, couldn't update message: ${error.message}`)
      })
  } else {
    // conversation already exist
    // just update conversation metadata

    const conversationValues = {
      lastMessageId: messageId,
      readByUser: senderType !== SenderTypes.Activity,
      readByActivity: senderType === SenderTypes.Activity
    }

    await Firebase.firestore()
      .collection('conversations')
      .doc(conversationId)
      .update(prepareDocForUpdate(conversationValues))
      .then(() => {
        return conversationValues
      })
      .catch(error => {
        alert(`Whoops, couldn't create new conversation: ${error.message}`)
      })
  }

  cb({ conversationId, messageId })
}

export const markConversationAsRead = async (
  conversationId,
  conversationValues
) => {
  await Firebase.firestore()
    .collection('conversations')
    .doc(conversationId)
    .update(conversationValues)
    .then(() => conversationValues)
    .catch(error => {
      alert(`Whoops, couldn't create new conversation: ${error.message}`)
    })
}

export default createNewMessage
