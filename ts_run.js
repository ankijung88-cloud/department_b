const { execSync } = require('child_process');
const fs = require('fs');
try {
    execSync('npx tsc --noEmit', { encoding: 'utf-8' });
    fs.writeFileSync('ts_out.txt', 'SUCCESS');
} catch (e) {
    fs.writeFileSync('ts_out.txt', (e.stdout || '') + '\n' + (e.stderr || ''));
}
