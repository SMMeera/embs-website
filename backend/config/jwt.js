const generateToken = require('../utils/generateToken');

const sendTokenCookie = (res, user) => {
  const token = generateToken({ id: user._id, role: user.role });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: (parseInt(process.env.COOKIE_EXPIRES_IN) || 7) * 24 * 60 * 60 * 1000,
  });

  return token;
};

module.exports = sendTokenCookie;
