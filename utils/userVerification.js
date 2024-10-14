export function verifyAdmin(user) {
  if (user) {
    if (user.type == "admin") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function verifyCustomer(user) {
  if (user) {
    if (user.type == "customer") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
