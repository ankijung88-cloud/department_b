const { execSync } = require('child_process');
const fs = require('fs');
try {
    console.log('Running typecheck...');
    const output = execSync('npx tsc --noEmit', { encoding: 'utf-8', stdio: 'pipe' });
    fs.writeFileSync('ts_errors.txt', output);
    console.log('Done, no errors!');
} catch (e) {
    console.log('TS errors found. Saving to ts_errors.txt...');
    fs.writeFileSync('ts_errors.txt', e.stdout || e.message);
}
