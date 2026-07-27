const asyncHandler = require('express-async-handler');
const Subscriber   = require('../models/Subscriber');
const { sendResponse, sendError } = require('../utils/sendResponse');

exports.subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return sendError(res, 400, 'Email is required');

  const existing = await Subscriber.findOne({ email });
  if (existing) return sendError(res, 409, 'Email already subscribed');

  await Subscriber.create({ email });
  sendResponse(res, 201, null, 'Subscribed successfully');
});

exports.getAll = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find().sort({ createdAt: -1 });
  sendResponse(res, 200, subscribers);
});

exports.remove = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return sendError(res, 400, 'Email is required');

  const sub = await Subscriber.findOneAndDelete({ email });
  if (!sub) return sendError(res, 404, 'Subscriber not found');
  sendResponse(res, 200, null, 'Unsubscribed successfully');
});
