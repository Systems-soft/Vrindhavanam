// src/utils/email.js
exports.sendMail = async (options) => {
  console.log('--- MOCK EMAIL SENT ---');
  console.log('To:', options.to);
  console.log('Subject:', options.subject);
  console.log('Content:', options.html);
  console.log('-----------------------');
  return true;
};
