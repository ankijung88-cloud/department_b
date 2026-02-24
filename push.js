const { execSync } = require('child_process');
try {
    console.log('Adding files...');
    execSync('git add .', { stdio: 'inherit' });
    console.log('Committing files...');
    execSync('git commit -m "feat: Implement Goods Section and E-commerce flow (Admin/User)"', { stdio: 'inherit' });
    console.log('Pushing to GitHub...');
    execSync('git push', { stdio: 'inherit' });
    console.log('Done pushing!');
} catch (e) {
    console.log('Error:', e.message);
}
