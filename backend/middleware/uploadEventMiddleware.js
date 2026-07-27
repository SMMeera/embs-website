const createUpload = require('./uploadMiddleware');

const uploadEvent = createUpload('events');

module.exports = uploadEvent;
