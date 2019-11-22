import React from 'react'
import { FirestoreDocument } from 'react-firestore'
import { Button } from 'antd'

class ConversationHeader extends React.Component {
  constructor (props) {
    super(props)

    this.state = { showListOfConversations: this.props.showListOfConversations }
  }

  render () {
    const { activityId } = this.props

    return (
      <FirestoreDocument path={`/posts/${activityId}`}>
        {({ error, isLoading, data }) => {
          if (error || isLoading) {
            return <button disabled>...</button>
          } else {
            const post = data
            if (post.fileList) {
              return (
                <div className='conversation-header-container'>
                  <div>
                    <Button
                      className='conversation-switcher visible-only-in-md'
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: ' 0px',
                        border: '0px'
                      }}
                      icon='bars'
                      onClick={() => {
                        this.props.switchToListOfConversations()
                      }}
                    />
                  </div>
                  <div
                    className='conversation-header'
                    onClick={() => {
                      window.location = `/${post.slug}`
                    }}
                    to={`/${post.slug}`}
                  >
                    <div>
                      <img src={post.fileList[0]} alt='' className='' />
                    </div>
                    <div>
                      <h3 className='locket--name' id='locket-id-004'>
                        {post.title}
                        <svg
                          style={{ paddingTop: '9px' }}
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                        >
                          <path d='M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z' />
                        </svg>
                      </h3>
                    </div>
                  </div>
                </div>
              )
            } else {
              return <div />
            }
          }
        }}
      </FirestoreDocument>
    )
  }
}

export default ConversationHeader
