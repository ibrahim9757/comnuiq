import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send("You are not authenticated");
  }
  const jwtSecret = process.env.JWT_SECRET || process.env.JWT_KEY;
  jwt.verify(token, jwtSecret, async (err, payload) => {
    if (err) {
      return res.status(403).send("Token is not valid");
    }
    req.userId = payload.userId;
    next();
  });
};
