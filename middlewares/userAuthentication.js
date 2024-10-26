import jwt from "jsonwebtoken";

export function authenticateUser(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (token) {
    jwt.verify(token, process.env.HASHING_KEY, (err, decoded) => {
      if (decoded != null) {
        req.body.user = decoded;
        next();
      } else {
        next();
      }
    });
  } else {
    next();
  }
}
