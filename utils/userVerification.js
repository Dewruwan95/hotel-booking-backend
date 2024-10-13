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
