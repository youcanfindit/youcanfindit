const hasRole = (user, role) => {
  if(user.role.includes(role)){
    return true
  } else {
    return false
  }
}


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
