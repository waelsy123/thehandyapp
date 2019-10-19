const admin = require('firebase-admin')

exports.createProfile = user => {
  user = user.toJSON()
  delete user.providerData

  console.log('Create user: ', user)

  return admin
    .firestore()
    .collection('userProfiles')
    .doc(user.uid)
    .set(user)
}

exports.updateProfile = user => {
  user = user.toJSON()
  delete user.providerData

  return admin
    .firestore()
    .collection('userProfiles')
    .doc(user.uid)
    .update(user)
}

exports.deleteProfile = user => {
  user = user.toJSON()
  delete user.providerData
  console.log('Delete user: ', user)

  return admin
    .firestore()
    .collection('userProfiles')
    .doc(user.uid)
    .delete()
}
