import React from 'react'
import { Page } from '../../styles/layout'
import ConversationHeader from './ConversationHeader'
import ConversationsList from './ConversationsList'
import { Input, Button } from 'antd'
import createNewMessage, {
  markConversationAsRead
} from '../../actions/createNewMessage'
import { SenderTypes } from '../../enums/enums'
import { FirestoreCollection, FirestoreDocument } from 'react-firestore'
import { Route } from 'react-router-dom'

class MessagingPage extends React.Component {
  constructor (props) {
    super(props)
    const searchParams = new window.URLSearchParams(window.location.search)

    this.conversationContentRef = React.createRef()

    this.state = {
      activityId:
        searchParams.get('activityId') === null
          ? undefined
          : searchParams.get('activityId'),
      messageText: '',
      conversationId: undefined,
      userType: SenderTypes.User,
      user: undefined,
      activity: undefined,
      showListOfConversations: !!searchParams.get('list')
    }
  }

  scrollToBottom = () => {
    const objDiv = this.conversationContentRef.current
    objDiv.scrollTop = objDiv.scrollHeight
  }

  componentDidMount = () => {
    if (this.state.conversationId) {
      this.scrollToBottom()
    }
  }

  handleChangeMessageText = e => {
    this.setState({ messageText: e.target.value })
  }

  submitNewMessage = () => {
    createNewMessage(
      {
        messageText: this.state.messageText,
        activityId: this.state.activityId,
        conversationId: this.state.conversationId,
        timestamp: new Date().getTime()
      },
      ({ conversationId, messageId }) => {
        this.setState({ messageText: '', conversationId })
        this.updateMessages()
        this.scrollToBottom()
      }
    )
  }

  handleSelectConversation = (conversation, activity) => {
    this.setState({
      conversationId: conversation.id,
      activityId: conversation.activityId,
      conversation,
      activity,
      showListOfConversations: false
    })

    if (conversation.userId === window.user.uid) {
      markConversationAsRead(conversation.id, { readByUser: true })
    } else {
      markConversationAsRead(conversation.id, { readByActivity: true })
    }
  }

  switchToListOfConversations = () => {
    this.setState({ showListOfConversations: true })
  }

  messagesRandomKey = Math.random()
  updateMessages = () => {
    this.messagesRandomKey = Math.random()
  }

  render () {
    console.log(this.state)

    return (
      <Route
        render={({ history }) => (
          <Page>
            <div
              className={
                this.state.showListOfConversations ? '' : 'hidden-in-mobile'
              }
            >
              <div className='conversations-list-container col-xs-12 col-sm-12 col-md-4'>
                <ConversationsList
                  onSelectConversation={this.handleSelectConversation}
                  selectedConversationId={this.state.conversationId}
                  userType={this.state.userType}
                />
              </div>
            </div>
            <div
              className={
                this.state.showListOfConversations ? 'hidden-in-mobile' : ''
              }
            >
              <div className='conversation-container col-xs-12 col-sm-12 col-md-8'>
                <ConversationHeader
                  switchToListOfConversations={this.switchToListOfConversations}
                  showListOfConversations={this.state.showListOfConversations}
                  activityId={this.state.activityId}
                />

                <div
                  ref={this.conversationContentRef}
                  id='conversation-content'
                  className='conversation-content'
                >
                  <div style={{ padding: '30px 0px' }}>
                    {this.state.conversationId && (
                      <FirestoreCollection
                        path={'messages'}
                        filter={[
                          ['conversationId', '==', this.state.conversationId]
                        ]}
                        sort='createdOn:asc'
                      >
                        {({ error, isLoading, data }) => {
                          if (error || isLoading) {
                            return null
                          } else {
                            const messages = data
                            const userId =
                              messages[messages.length - 1].senderId

                            return (
                              <FirestoreDocument
                                path={`/userProfiles/${userId}`}
                              >
                                {({ error, isLoading, data }) => {
                                  if (error || isLoading) {
                                    return <div />
                                  } else {
                                    const user = data
                                    if (user) {
                                      return (
                                        <FirestoreDocument
                                          path={`/userProfiles/${
                                            window.user.uid
                                          }`}
                                        >
                                          {({ error, isLoading, data }) => {
                                            if (error || isLoading) {
                                              return <div />
                                            } else {
                                              const provider = data
                                              if (provider) {
                                                return messages.map(message => (
                                                  <div
                                                    key={message.id}
                                                    className='messenger__message'
                                                    data-message-type={
                                                      message.senderId ===
                                                      window.user.uid
                                                        ? 'outgoing'
                                                        : 'incoming'
                                                    }
                                                  >
                                                    <div className='messenger__message--avatar'>
                                                      <img
                                                        onClick={() =>
                                                          history.push(
                                                            `/user/${
                                                              message.senderId
                                                            }`
                                                          )
                                                        }
                                                        src={
                                                          message.senderId ===
                                                          userId
                                                            ? user.photoURL
                                                            : this.state
                                                              .activity
                                                              .fileList[0]
                                                        }
                                                        alt=''
                                                        className=''
                                                      />
                                                    </div>
                                                    <div className='messenger__message__bubbles'>
                                                      <div className='messenger__message--bubble'>
                                                        {message.messageText}
                                                      </div>
                                                    </div>
                                                  </div>
                                                ))
                                              }
                                            }
                                          }}
                                        </FirestoreDocument>
                                      )
                                    }
                                  }
                                }}
                              </FirestoreDocument>
                            )
                          }
                        }}
                      </FirestoreCollection>
                    )}
                  </div>
                </div>

                <div className='conversation-action'>
                  <Button type='primary' icon='upload' size='large' />
                  <Input
                    placeholder='Your message'
                    size='large'
                    onChange={this.handleChangeMessageText}
                    value={this.state.messageText}
                    onPressEnter={() => {
                      this.submitNewMessage()
                    }}
                  />
                  <Button
                    disabled={this.state.activityId === undefined}
                    onClick={() => {
                      this.submitNewMessage()
                    }}
                    type='primary'
                    size='large'
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>{' '}
          </Page>
        )}
      />
    )
  }
}

export default MessagingPage
