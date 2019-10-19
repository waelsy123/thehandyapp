// this Layout component wraps every page with the app header on top
// check out App.js to see how it's used

import React from 'react'
import { Layout, Button, Avatar, Badge } from 'antd'
import logIn from '../../actions/logIn'
import Firebase from 'firebase/app'
import FirebaseAuth from '../misc/FirebaseAuth'
import { Footer } from '../../styles/layout'
import { HeaderLink } from '../../styles/links'
import { getNumberOfUnreadConversations } from '../../actions/firestoreHelpers'
import 'antd/dist/antd.css'
import './layout.css'

const { Header, Content } = Layout

class AppLayout extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      newMessages: false
    }
  }

  async componentDidMount () {
    try {
      const {
        unReadConversationsForActivity,
        unReadConversationsForUser
      } = await getNumberOfUnreadConversations()

      const newMessages =
        unReadConversationsForActivity + unReadConversationsForUser > 0

      this.setState({
        newMessages
      })
    } catch (error) {
      console.log(error)
    }
  }

  render () {
    const { children } = this.props

    return (
      <Layout className='header'>
        <Header>
          <div className='top-header'>
            <div className='left-part'>
              <HeaderLink to='/'>
                <img
                  className='logo'
                  src='https://magos-dev.firebaseapp.com/superhandy-logo.png'
                  alt='logo'
                />
              </HeaderLink>
            </div>
            <FirebaseAuth>
              {({ isLoading, error, auth }) => {
                if (isLoading) {
                  return '...'
                }
                if (error) {
                  return '⚠️ login error'
                }
                if (auth) {
                  return (
                    <div className='right-part'>
                      <HeaderLink to='/search'>
                        <Button className='search-button-icon' icon='search' />
                      </HeaderLink>
                      <HeaderLink to='/messages'>
                        <Badge dot={this.state.newMessages}>
                          <Button
                            className='search-button-icon'
                            icon='message'
                          />
                        </Badge>
                      </HeaderLink>
                      <HeaderLink to='/new'>
                        <Button type='de' style={{ margin: '5px' }}>
                          Manage activity
                        </Button>
                      </HeaderLink>
                      <HeaderLink to='/account'>
                        <Avatar
                          shape='square'
                          className='avatar'
                          style={{
                            verticalAlign: 'middle'
                          }}
                          size='large'
                        >
                          U
                        </Avatar>
                      </HeaderLink>
                    </div>
                  )
                } else {
                  return (
                    <div className='right-part'>
                      <HeaderLink to='/search'>
                        <Button
                          icon='search'
                          style={{ margin: '10px' }}
                          onClick={() => {
                            window.location = '/'
                          }}
                        >
                          Search
                        </Button>
                      </HeaderLink>
                      <Button
                        onClick={logIn}
                        style={{ margin: '10px' }}
                        type='primary'
                      >
                        Sign in
                      </Button>
                    </div>
                  )
                }
              }}
            </FirebaseAuth>
          </div>
        </Header>
        <Content className='content'>{children}</Content>

        <Footer>© {new Date().getFullYear()}</Footer>
      </Layout>
    )
  }
}

export default AppLayout
