#!/usr/bin/env node

// Migration script to move existing gallery images from public folder to database
// Run with: node migrate-gallery-images.js

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
let supabaseUrl = process.env.VITE_SUPABASE_URL;
let supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const envLines = envContent.split('\n');
    for (const line of envLines) {
      const [key, value] = line.split('=');
      if (key === 'VITE_SUPABASE_URL') supabaseUrl = value;
      if (key === 'VITE_SUPABASE_ANON_KEY') supabaseKey = value;
    }
  } catch (err) {
    console.error('Could not load .env file');
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Gallery images mapping (same as in the hook)
const galleryImages = [
  { id: 'img-8915', src: '/IMG_8915.JPG', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'img-8910', src: '/IMG_8910.JPG', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'img-8900', src: '/IMG_8900.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'img-8905', src: '/IMG_8905.JPG', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'img-8920', src: '/IMG_8920.JPG', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'img-8960', src: '/IMG_8960.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'img-8955', src: '/IMG_8955.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'img-115a82f7', src: '/115A82F7-E04C-4A13-B50A-B919D9C20240.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'img-13715236', src: '/13715236-067F-4BEC-BFAA-CAA183BFF0CD.JPG', category: 'Bridal', alt: 'Bridal makeup look' },
  { id: 'img-8863', src: '/IMG_8863.JPG', category: 'Behind the Scenes', alt: 'Behind the Scenes makeup look' },
  { id: 'img-8865', src: '/IMG_8865.JPG', category: 'Behind the Scenes', alt: 'Behind the Scenes makeup look' },
  { id: 'img-8869', src: '/IMG_8869.JPG', category: 'Special Event', alt: 'Special Event makeup look' },
  { id: 'img-8901', src: '/IMG_8901.JPG', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'img-8902', src: '/IMG_8902.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'img-8903', src: '/IMG_8903.JPG', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'img-8904', src: '/IMG_8904.JPG', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'img-8909', src: '/IMG_8909.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'img-8911', src: '/IMG_8911.JPG', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'img-8912', src: '/IMG_8912.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'img-8913', src: '/IMG_8913.JPG', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'img-8914', src: '/IMG_8914.JPG', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'img-8916', src: '/IMG_8916.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'img-8918', src: '/IMG_8918.JPG', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'img-8919', src: '/IMG_8919.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'img-8949', src: '/IMG_8949.JPG', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'img-8950', src: '/IMG_8950.JPG', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'img-8951', src: '/IMG_8951.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'img-8952', src: '/IMG_8952.JPG', category: 'Special Event', alt: 'Special Event makeup look' },
  { id: 'img-8953', src: '/IMG_8953.JPG', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'img-8954', src: '/IMG_8954.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'img-8956', src: '/IMG_8956.JPG', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'img-8957', src: '/IMG_8957.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'img-8958', src: '/IMG_8958.JPG', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'img-8959', src: '/IMG_8959.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'img-8963', src: '/IMG_8963.JPG', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'img-8964', src: '/IMG_8964.JPG', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'img-8965', src: '/IMG_8965.JPG', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'img-8966', src: '/IMG_8966.JPG', category: 'Special Event', alt: 'Special Event makeup look' },
  { id: 'img-8968', src: '/IMG_8968.JPG', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'img-9166', src: '/IMG_9166.jpg', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'img-9167', src: '/IMG_9167.jpg', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'image0', src: '/image0.jpeg', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'image1', src: '/image1.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'image2', src: '/image2.jpeg', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'image3', src: '/image3.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'image4', src: '/image4.jpeg', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'image6', src: '/image6.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'image7', src: '/image7.jpeg', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'image8', src: '/image8.jpeg', category: 'Special Event', alt: 'Special Event makeup look' },
  { id: 'image9', src: '/image9.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'image10', src: '/image10.jpeg', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'image11', src: '/image11.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'image12', src: '/image12.jpeg', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'image13', src: '/image13.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'image14', src: '/image14.jpeg', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'image15', src: '/image15.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'image16', src: '/image16.jpeg', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'image17', src: '/image17.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'image18', src: '/image18.jpeg', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'image19', src: '/image19.jpeg', category: 'Special Event', alt: 'Special Event makeup look' },
  { id: 'image20', src: '/image20.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'image21', src: '/image21.jpeg', category: 'Editorial', alt: 'Editorial makeup look' },
  { id: 'image22', src: '/image22.jpeg', category: 'Evening Glam', alt: 'Evening Glam makeup look' },
  { id: 'image23', src: '/image23.jpeg', category: 'Editorial', alt: 'Editorial makeup look' },
];

// Category mapping
const categoryMap = {
  'Bridal': 'bridal',
  'Editorial': 'editorial',
  'Evening Glam': 'evening_glam',
  'Natural Beauty': 'natural_beauty',
  'Special Events': 'special_events',
  'Celebrity': 'celebrity',
  'Before & After': 'before_after',
  'Hair Styling': 'hair_styling',
  'Special FX': 'special_fx',
  'Behind the Scenes': 'special_events', // Map to special events
};

async function migrateImages() {
  console.log('Starting gallery image migration...');

  try {
    // Check if images already exist
    const { data: existingImages, error: checkError } = await supabase
      .from('gallery_images')
      .select('storage_path')
      .limit(1);

    if (checkError && !checkError.message.includes('relation "public.gallery_images" does not exist')) {
      console.error('Error checking existing images:', checkError);
      return;
    }

    if (existingImages && existingImages.length > 0) {
      console.log('Gallery images table already has data. Skipping migration.');
      return;
    }

    console.log(`Migrating ${galleryImages.length} images to database...`);

    for (let i = 0; i < galleryImages.length; i++) {
      const image = galleryImages[i];
      const dbCategory = categoryMap[image.category] || 'editorial';

      // Get file stats
      const publicPath = path.join(__dirname, 'public', image.src.substring(1));
      let fileSize = 0;
      let mimeType = 'image/jpeg';

      try {
        const stats = fs.statSync(publicPath);
        fileSize = stats.size;
        mimeType = image.src.includes('.jpg') || image.src.includes('.jpeg') ? 'image/jpeg' : 'image/png';
      } catch (err) {
        console.warn(`Could not get file stats for ${image.src}:`, err.message);
      }

      const imageData = {
        storage_path: image.src.substring(1), // Remove leading slash
        file_name: path.basename(image.src),
        file_size: fileSize,
        mime_type: mimeType,
        alt_text: image.alt,
        category: dbCategory,
        is_published: true,
        display_order: i,
        title: `${image.category} Makeup Look`,
        description: `Professional ${image.category.toLowerCase()} makeup artistry by HDA Studio`,
      };

      const { error } = await supabase
        .from('gallery_images')
        .insert(imageData);

      if (error) {
        console.error(`Error inserting image ${image.src}:`, error);
      } else {
        console.log(`✓ Migrated ${image.src}`);
      }
    }

    console.log('Migration completed successfully!');
    console.log('You can now manage these images through the admin dashboard at /admin');

  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run migration
migrateImages();
