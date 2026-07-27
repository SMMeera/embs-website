const isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

const isDateString = (str) => /^\d{4}-\d{2}-\d{2}$/.test(str);

const isUrl = (str) => {
  try { new URL(str); return true; } catch { return false; }
};

module.exports = { isEmail, isDateString, isUrl };
