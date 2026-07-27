const sendResponse = (res, statusCode, data = null, message = 'Success') => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  res.status(statusCode).json(payload);
};

const sendError = (res, statusCode, message = 'Something went wrong') => {
  res.status(statusCode).json({ success: false, message });
};

module.exports = { sendResponse, sendError };
