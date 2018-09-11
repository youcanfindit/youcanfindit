//File with functions associated to roles

//Function that verifies if a user has a role
const hasRole = (user, role) => {
  if(user.role.includes(role)){
    return true
  } else {
    return false
  }
}

//Function that verifies if the user is the owner
const isOwner = (user, id) => {
  if (user._id.equals(id)) {
    return true
  } else {
    return false
  }
}

module.exports = {
  hasRole,
  isOwner
}
