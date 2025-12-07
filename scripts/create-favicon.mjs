#!/usr/bin/env node
import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(__dirname);

async function createFavicons() {
  const inputImage = join(projectRoot, 'public/assets/images/meches-favicon-1.jpg');

  try {
    // Create PNG versions in different sizes
    console.log('Creating PNG favicons...');

    // 192x192 for Android
    await sharp(inputImage)
      .resize(192, 192, { fit: 'cover' })
      .png()
      .toFile(join(projectRoot, 'public/favicon-192.png'));
    console.log('✓ Created favicon-192.png');

    // 512x512 for Android
    await sharp(inputImage)
      .resize(512, 512, { fit: 'cover' })
      .png()
      .toFile(join(projectRoot, 'public/favicon-512.png'));
    console.log('✓ Created favicon-512.png');

    // 180x180 for Apple
    await sharp(inputImage)
      .resize(180, 180, { fit: 'cover' })
      .png()
      .toFile(join(projectRoot, 'public/apple-touch-icon.png'));
    console.log('✓ Created apple-touch-icon.png');

    // 32x32 for standard favicon
    const favicon32 = await sharp(inputImage)
      .resize(32, 32, { fit: 'cover' })
      .png()
      .toBuffer();

    // 16x16 for standard favicon
    const favicon16 = await sharp(inputImage)
      .resize(16, 16, { fit: 'cover' })
      .png()
      .toBuffer();

    // Create basic ICO file (simplified - just write 32x32 as PNG for Next.js)
    // Next.js will handle this as favicon.ico in the app directory
    await sharp(inputImage)
      .resize(32, 32, { fit: 'cover' })
      .png()
      .toFile(join(projectRoot, 'src/app/favicon.ico'));
    console.log('✓ Created src/app/favicon.ico');

    console.log('\n✅ All favicons created successfully!');

  } catch (error) {
    console.error('❌ Error creating favicons:', error);
    process.exit(1);
  }
}

createFavicons();
