require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const FoodItem = require('./src/models/FoodItem'); // Assuming script is in backend root

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const IMAGES_DIR = path.join(__dirname, '../images');

// Function to normalize strings for comparison
const normalizeString = (str) => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

const uploadImages = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        const files = fs.readdirSync(IMAGES_DIR);
        console.log(`Found ${files.length} images in ${IMAGES_DIR}`);

        const menuItems = await FoodItem.find({});
        console.log(`Found ${menuItems.length} menu items in the database.`);

        let matchCount = 0;
        let uploadCount = 0;

        for (const file of files) {
            const ext = path.extname(file);
            if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext.toLowerCase())) continue;

            const baseName = path.basename(file, ext);
            const normalizedFileName = normalizeString(baseName);

            // Find best matching menu item
            let bestMatch = null;
            let bestScore = -1;

            for (const item of menuItems) {
                const normalizedItemName = normalizeString(item.name);

                // Simple exact substring match or exact match
                if (normalizedItemName === normalizedFileName) {
                    bestMatch = item;
                    break;
                } else if (normalizedItemName.includes(normalizedFileName) || normalizedFileName.includes(normalizedItemName)) {
                    bestMatch = item;
                    // Keep looking in case there's an exact match later
                }
            }

            if (bestMatch) {
                console.log(`Match found: Image "${file}" -> Database Item "${bestMatch.name}"`);
                matchCount++;

                // Upload to Cloudinary
                try {
                    const filePath = path.join(IMAGES_DIR, file);
                    console.log(`  Uploading...`);
                    const result = await cloudinary.uploader.upload(filePath, {
                        folder: 'quickbite_menu'
                    });

                    // Update database
                    bestMatch.imageUrl = result.secure_url;
                    await bestMatch.save();
                    console.log(`  Successfully uploaded and linked! URL: ${result.secure_url}`);
                    uploadCount++;

                } catch (uploadError) {
                    console.error(`  Error uploading ${file}:`, uploadError.message);
                }

            } else {
                console.log(`No match found for image: "${file}"`);
            }
        }

        console.log(`\nFinished! Checked ${files.length} files.`);
        console.log(`Matches found: ${matchCount}`);
        console.log(`Images successfully uploaded: ${uploadCount}`);

    } catch (error) {
        console.error("Script failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
};

uploadImages();
