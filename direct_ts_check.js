const { execSync } = require('child_process');
try {
    const output = execSync('npx tsc --noEmit', { encoding: 'utf-8' });
    console.log("TS SUCCESS:", output);
} catch (e) {
    console.log("TS ERROR:", e.stdout);
}
