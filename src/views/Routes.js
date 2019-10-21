// the main routes of our app are defined here using react-router
// https://reacttraining.com/react-router/web/example/basic

import React from 'react'
import { Switch, Route } from 'react-router-dom'

import PostNew from './posts/PostNew'
import Search from './search/Search'
import Message from './message/Message'
import Account from './account/Account'
import Profile from './account/Profile'
import PostEdit from './posts/PostEdit'
import Post from './posts/Post'
import Error from './misc/Error'

const Routes = () => (
  <Switch>
    <Route exact path='/' component={Search} />
    {/* component={PostList} */}
    <Route path='/new' component={PostNew} />
    <Route path='/search' component={Search} />
    <Route path='/messages' component={Message} />
    <Route path='/account' component={Account} />
    <Route path='/user/:userId' component={Profile} />
    <Route path='/:slug/edit' component={PostEdit} />
    <Route path='/:slug' component={Post} />
    <Route component={Error} />
  </Switch>
)

export default Routes
