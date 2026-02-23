const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

async function run() {
    console.log("Starting script");
    try {
        const users = fs.readdirSync('C:\\Users');
        const targetUser = users.find(u => u.includes('기정') || u.includes('\uc548\uae30\uc815') || Buffer.from(u).toString('utf8').includes('기정'));
        console.log("Target user:", targetUser);
        if (!targetUser) throw new Error("User dir not found");

        const srcFile = path.join('C:\\Users', targetUser, '.gemini', 'antigravity', 'brain', '821c9c05-11cf-4c1f-baf4-23f4650d39e1', 'media__1771833273276.jpg');
        console.log("Source file:", srcFile, fs.existsSync(srcFile));
        if (!fs.existsSync(srcFile)) throw new Error("Source file does not exist: " + srcFile);

        const outputPath = 'c:\\dev\\department-b\\public\\logo.png';
        const JimpClass = typeof Jimp.read === 'function' ? Jimp : (Jimp.Jimp || Jimp);
        console.log("Reading image with Jimp...");
        const image = await JimpClass.read(srcFile);
        console.log("Image read successful. Scanning...");

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            const brightness = (r + g + b) / 3;
            const isGray = Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && Math.abs(r - b) < 20;

            if (brightness > 230 && isGray) {
                if (brightness > 245) {
                    this.bitmap.data[idx + 3] = 0;
                } else {
                    let alpha = 255 - ((brightness - 230) * (255 / 15));
                    if (alpha < 0) alpha = 0;
                    this.bitmap.data[idx + 3] = Math.floor(alpha);
                }
            }
        });

        console.log("Scan complete. Generating PNG buffer...");
        const buffer = await new Promise((resolve, reject) => {
            image.getBuffer('image/png', (err, buf) => {
                if (err) reject(err);
                else resolve(buf);
            });
        });
        console.log("Buffer generated. Writing to disk using fs...");
        fs.writeFileSync(outputPath, buffer);
        console.log("Write complete! Saved to:", outputPath);
    } catch (err) {
        console.error("Error occurred:", err);
    }
}
run();

