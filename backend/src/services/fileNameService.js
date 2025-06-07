const path = require('path');


// this function generate a unique audio file name based on username and current timestamp
// It uses the original file name's extension to maintain the correct format
// The format is: username_YYYYMMDDHHMMSS.ext
exports.generateAudioFileName = (originalName, username) => {
  const ext = path.extname(originalName);

  const now = new Date();
  const datetime = now
    .toISOString()
    .replace(/[-:T]/g, '')
    .split('.')[0];

  return `${username}_${datetime}${ext}`;
};