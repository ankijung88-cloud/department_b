const Jimp = require('jimp');

async function removeWhite() {
    try {
        const imagePath = String.raw`C:\Users\안기정\.gemini\antigravity\brain\821c9c05-11cf-4c1f-baf4-23f4650d39e1\media__1771833273276.jpg`;
        const outputPath = String.raw`c:\dev\department-b\public\logo.png`;

        const image = await Jimp.read(imagePath);

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

        await image.writeAsync(outputPath);
        console.log("Successfully processed and saved logo.png");
    } catch (error) {
        console.error("Error processing image:", error);
    }
}

removeWhite();
