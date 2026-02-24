const { execSync } = require('child_process');
const fs = require('fs');
try {
    const output = execSync('git ls-files src/pages/admin', { encoding: 'utf-8' });
    fs.writeFileSync('c:\\dev\\department-b\\git_casing.txt', output);
} catch (e) {
    fs.writeFileSync('c:\\dev\\department-b\\git_casing.txt', e.message);
}
