import jwt from "jsonwebtoken";

export function verifyUser(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (token) {
    jwt.verify(token, process.env.HASHING_KEY, (err, decoded) => {
      if (decoded != null) {
        req.user = decoded;
        next();
      } else {
        next();
      }
    });
  } else {
    next();
  }
}
