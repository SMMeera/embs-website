const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/sendResponse');

const protect = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) return sendError(res, 401, 'Not authenticated');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return sendError(res, 401, 'User no longer exists');

    next();
  } catch {
    sendError(res, 401, 'Invalid or expired token');
  }
};

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return sendError(res, 403, 'You do not have permission');
  next();
};

module.exports = { protect, restrictTo };
