import { execSync } from 'child_process';
import fs from 'fs';
try {
    const output = execSync('node_modules\\\\.bin\\\\tsc --noEmit', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] });
    fs.writeFileSync('tsc_result.txt', 'SUCCESS\n' + output);
    console.log('SUCCESS');
} catch (e) {
    fs.writeFileSync('tsc_result.txt', 'ERROR\n' + e.stdout + '\n' + e.stderr + '\n' + e.message);
    console.log('ERROR');
}
