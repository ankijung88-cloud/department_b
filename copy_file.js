const fs = require('fs');
const src = String.raw`C:\Users\안기정\.gemini\antigravity\brain\821c9c05-11cf-4c1f-baf4-23f4650d39e1\media__1771833273276.jpg`;
const dst = String.raw`c:\dev\department-b\temp_logo.jpg`;
try {
    fs.copyFileSync(src, dst);
    console.log('Copied successfully.');
} catch (e) {
    console.error('Error:', e);
}
