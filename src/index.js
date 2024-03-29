// the main file in our front-end app
// create-react-app expects a file in src/index.js and loads everything from here

import Firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'

import App from './views/App'
import { fetchMyGeo } from './actions/helpers/location'
import { getCurrentUser, getUserActivity } from './actions/firestoreHelpers'

// connect our app to firebase
const dbConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
}
Firebase.initializeApp(dbConfig)

// temporary config to squash error date warning
// TODO - remove once this is the firebase default behavior
// https://firebase.google.com/docs/reference/js/firebase.firestore.Settings#~timestampsInSnapshots
Firebase.firestore().settings({ timestampsInSnapshots: true })

window.Firebase = Firebase

// Google Analytics
// https://github.com/react-ga/react-ga#api
ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID)

// Sentry
// https://docs.sentry.io/clients/javascript/integrations/react/
window.Raven.config(process.env.REACT_APP_SENTRY_RAVEN_TRACKING_URL).install()

Promise.all([fetchMyGeo(), getCurrentUser()]).then(([geo, user]) => {
  window.user = user

  if (user) {
    getUserActivity({ userId: user.uid })
      .then(activity => {
        window.activity = activity

        ReactDOM.render(<App />, document.getElementById('root'))
      })
      .catch(e => {
        console.log(e)
      })
  } else {
    ReactDOM.render(<App />, document.getElementById('root'))
  }
})
