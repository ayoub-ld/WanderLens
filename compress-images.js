import sharp from 'sharp'; // Node.js image processing library
import { readdir } from 'fs/promises';
import path from 'path';

const sourceDir = './public/images';
const targetDir = './public/images/compressed';

async function compressImages() {
    try {
        // Get all files from the source directory
        const files = await readdir(sourceDir);
        
        // Filter only webp files and exclude the compressed directory
        const imageFiles = files.filter(file => 
            file.endsWith('.webp') && 
            !file.includes('compressed')
        );

        // Process each image
        for (const file of imageFiles) {
            const sourcePath = path.join(sourceDir, file);
            const targetPath = path.join(targetDir, file.replace('.webp', '-small.webp'));

            console.log(`Compressing ${file}...`);

            await sharp(sourcePath)
                .resize(400) // Resize to 400px width
                .webp({ 
                    quality: 90, // Compresses them with 90% quality (good balance between size and quality is 80%)
                    effort: 6 
                })
                .toFile(targetPath);

            console.log(`✓ Created ${path.basename(targetPath)}`);
        }

        console.log('All images compressed successfully!');
    } catch (error) {
        console.error('Error compressing images:', error);
    }
}

compressImages();
