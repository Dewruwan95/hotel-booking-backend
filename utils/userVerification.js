export function verifyAdmin(req) {
  const user = req.user;
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

export function verifyCustomer(req) {
  const user = req.user;
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
