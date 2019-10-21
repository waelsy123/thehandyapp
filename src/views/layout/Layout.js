// this Layout component wraps every page with the app header on top
// check out App.js to see how it's used

import React from 'react'
import { Layout, Button, Menu, Dropdown, Icon, Badge } from 'antd'
import logIn from '../../actions/logIn'
import Firebase from 'firebase/app'
import FirebaseAuth from '../misc/FirebaseAuth'
import { Footer } from '../../styles/layout'
import { HeaderLink } from '../../styles/links'
import { getNumberOfUnreadConversations } from '../../actions/firestoreHelpers'
import 'antd/dist/antd.css'
import './layout.css'
import logOut from '../../actions/logOut'

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
                      <Button
                        onClick={() => {
                          if (window.activity && window.activity.slug) {
                            window.location.href = `/${
                              window.activity.slug
                            }/edit`
                          } else {
                            window.location.href = '/new'
                          }
                        }}
                        type='de'
                        style={{ margin: '5px' }}
                      >
                        Manage activity
                      </Button>
                      <Dropdown
                        placement='bottomRight'
                        overlay={
                          <Menu>
                            <Menu.Item key='0'>
                              <HeaderLink to={`/${window.activity.slug}/edit`}>
                                Acivity Mangagment
                              </HeaderLink>
                            </Menu.Item>
                            <Menu.Item key='1'>
                              <HeaderLink to='/account'>Profile</HeaderLink>
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                              key='2'
                              onClick={() =>
                                logOut().then(
                                  () => (window.location.href = '/')
                                )
                              }
                            >
                              <div
                                style={{
                                  fontSize: '1.2rem'
                                }}
                              >
                                Logout
                              </div>
                            </Menu.Item>
                          </Menu>
                        }
                        trigger={['click']}
                      >
                        <img
                          shape='square'
                          className='avatar'
                          style={{
                            verticalAlign: 'middle'
                          }}
                          size='large'
                          src={window.user.photoURL}
                        />
                      </Dropdown>
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
