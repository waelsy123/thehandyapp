import React from 'react'
import { FirestoreCollection, FirestoreDocument } from 'react-firestore'
import FirebaseAuth from '../misc/FirebaseAuth'
import Error from '../misc/Error'
import moment from 'moment'
import * as _ from 'lodash'
import { Badge } from 'antd'

class ConversationsList extends React.Component {
  render () {
    const { onSelectConversation, selectedConversationId } = this.props

    return (
      <FirebaseAuth>
        {({ isLoading, error, auth }) => {
          if (isLoading) {
            return <div />
          }
          if (error) {
            return '⚠️ login error'
          }
          if (auth) {
            return (
              <FirestoreCollection
                path={'conversations'}
                filter={[['userId', '==', window.user.uid]]}
              >
                {({ error, isLoading, data }) => {
                  if (error) {
                    return <Error error={error} />
                  }

                  if (isLoading) {
                    return <div />
                  }

                  if (data.length === 0) {
                    return <p>No conversations yet!</p>
                  }

                  const conversationsAsCustomer = data

                  return (
                    <FirestoreCollection
                      path={'conversations'}
                      filter={[
                        'activityId',
                        '==',
                        window.activity ? window.activity.id : -1
                      ]}
                    >
                      {({ error, isLoading, data }) => {
                        if (error) {
                          return <Error error={error} />
                        }

                        if (isLoading) {
                          return <div />
                        }

                        const conversationsAsProvider = data

                        let conversations = conversationsAsCustomer.concat(
                          conversationsAsProvider
                        )
                        conversations = _.sortBy(
                          conversations,
                          o => o.updatedOn || o.createdOn
                        ).reverse()

                        return (
                          <div>
                            {conversations.map(conversation => (
                              <FirestoreDocument
                                key={conversation.id}
                                path={`/posts/${conversation.activityId}`}
                              >
                                {({ error, isLoading, data }) => {
                                  if (error || isLoading) {
                                    return <div />
                                  } else {
                                    const activity = data

                                    return (
                                      <div
                                        key={conversation.id}
                                        className={`conversation-item ${
                                          selectedConversationId ===
                                          conversation.id
                                            ? 'active'
                                            : ''
                                        }`}
                                        onClick={() => {
                                          onSelectConversation(
                                            conversation,
                                            activity
                                          )
                                        }}
                                      >
                                        <Badge
                                          className='conversation-item-unread-message-notification'
                                          dot={
                                            window.user.uid ===
                                            conversation.userId
                                              ? !conversation.readByUser
                                              : !conversation.readByActivity
                                          }
                                        />
                                        <div className='conversation-item-content'>
                                          <div>
                                            <img
                                              src={activity.fileList[0]}
                                              alt=''
                                            />
                                          </div>

                                          <FirestoreDocument
                                            key={conversation.id}
                                            path={`/messages/${
                                              conversation.lastMessageId
                                            }`}
                                          >
                                            {({ error, isLoading, data }) => {
                                              if (error || isLoading) {
                                                return <div />
                                              } else {
                                                const lastMessage = data
                                                if (!lastMessage) return <div />

                                                return (
                                                  <div className='conversation-item-snippet'>
                                                    <div
                                                      style={{
                                                        display: 'grid',
                                                        gridTemplateColumns:
                                                          'auto 46px'
                                                      }}
                                                    >
                                                      <h3
                                                        className='locket--name'
                                                        id='locket-id-022'
                                                      >
                                                        {activity.title}
                                                      </h3>
                                                      <span
                                                        style={{
                                                          color:
                                                            conversation.userId ===
                                                            window.user.uid
                                                              ? '#3f8acc'
                                                              : '#ff7f4c'
                                                        }}
                                                        className='text-primary font-size-sm'
                                                      >
                                                        {conversation.userId ===
                                                        window.user.uid
                                                          ? 'Provider'
                                                          : 'Customer'}
                                                      </span>
                                                    </div>

                                                    <div>
                                                      <span>
                                                        {
                                                          lastMessage.messageText
                                                        }
                                                      </span>
                                                    </div>
                                                    <div>
                                                      <span>
                                                        {moment(
                                                          lastMessage.timestamp
                                                        ).calendar()}
                                                      </span>
                                                    </div>
                                                  </div>
                                                )
                                              }
                                            }}
                                          </FirestoreDocument>
                                        </div>
                                      </div>
                                    )
                                  }
                                }}
                              </FirestoreDocument>
                            ))}
                          </div>
                        )
                      }}
                    </FirestoreCollection>
                  )
                }}
              </FirestoreCollection>
            )
          }
        }}
      </FirebaseAuth>
    )
  }
}

export default ConversationsList
