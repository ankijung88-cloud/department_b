const fs = require('fs');
const path = require('path');

const usersDir = 'C:\\Users';
try {
    const users = fs.readdirSync(usersDir);
    const targetUser = users.find(u => u.includes('기정') || u.includes('\uc548\uae30\uc815') || Buffer.from(u).toString('utf8').includes('기정'));

    if (!targetUser) {
        console.error("User dir not found");
    } else {
        const srcDir = path.join(usersDir, targetUser, '.gemini', 'antigravity', 'brain', '821c9c05-11cf-4c1f-baf4-23f4650d39e1');
        const files = fs.readdirSync(srcDir);
        const targetFile = files.find(f => f.includes('media__1771833273276'));
        if (targetFile) {
            fs.copyFileSync(path.join(srcDir, targetFile), 'c:\\dev\\department-b\\temp_logo.jpg');
            console.log('Copied successfully from ' + path.join(srcDir, targetFile));
        } else {
            console.error("File not found in: " + srcDir);
        }
    }
} catch (e) {
    console.error(e);
}
