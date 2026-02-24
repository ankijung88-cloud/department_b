const fs = require('fs');
try {
    const items = fs.readdirSync('c:/dev/department-b/src/pages');
    const details = items.map(i => {
        const stat = fs.statSync(`c:/dev/department-b/src/pages/${i}`);
        return `${i} (isDirectory: ${stat.isDirectory()})`;
    });
    fs.writeFileSync('c:/dev/department-b/pages_dir_case.txt', details.join('\n'));
} catch (e) {
    fs.writeFileSync('c:/dev/department-b/pages_dir_case.txt', e.toString());
}
