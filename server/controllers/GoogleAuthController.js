import jwt from "jsonwebtoken";

export const googleAuthCallback = (req, res) => {
  const user = req.user;
  const jwtSecret = process.env.JWT_SECRET || process.env.JWT_KEY;

  const token = jwt.sign(
    { email: user.email, userId: user.id },
    jwtSecret,
    { expiresIn: 3 * 24 * 60 * 60 * 1000 }
  );

  res.cookie("jwt", token, {
    maxAge: 3 * 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: "None",
  });

  if (!user.profileSetup) {
    res.redirect(process.env.CLIENT_SIGNUP_REDIRECT_URL);
  } else {
    res.redirect(process.env.CLIENT_LOGIN_REDIRECT_URL);
  }
};
