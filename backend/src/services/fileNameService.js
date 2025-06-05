const path = require('path');

exports.generateAudioFileName = (originalName, username) => {
  const ext = path.extname(originalName);

  const now = new Date();
  const datetime = now
    .toISOString()
    .replace(/[-:T]/g, '')
    .split('.')[0]; // Remove milliseconds and 'Z'

  return `${username}_${datetime}${ext}`;
};