// Gallery System Type Definitions
// Auto-generated from database schema - sync with Supabase

export type GalleryCategory =
  | 'bridal'
  | 'editorial'
  | 'evening_glam'
  | 'natural_beauty'
  | 'special_events'
  | 'celebrity'
  | 'before_after'
  | 'hair_styling'
  | 'special_fx';

export interface GalleryImage {
  id: string;

  // File information
  storage_path: string;
  thumbnail_path: string | null;
  file_name: string;
  file_size: number;
  mime_type: string;

  // Image metadata
  width: number | null;
  height: number | null;
  aspect_ratio: number | null;

  // Organization
  title: string | null;
  description: string | null;
  alt_text: string;
  category: GalleryCategory;
  tags: string[];

  // AI-generated metadata
  ai_tags: string[];
  ai_description: string | null;
  ai_confidence: number | null;
  ai_processed_at: string | null;

  // Display settings
  is_featured: boolean;
  is_published: boolean;
  display_order: number;

  // Timestamps
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryImageInsert {
  storage_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  alt_text: string;
  category?: GalleryCategory;
  title?: string;
  description?: string;
  tags?: string[];
  is_featured?: boolean;
  is_published?: boolean;
  display_order?: number;
  thumbnail_path?: string;
  width?: number;
  height?: number;
  aspect_ratio?: number;
}

export interface GalleryImageUpdate {
  title?: string;
  description?: string;
  alt_text?: string;
  category?: GalleryCategory;
  tags?: string[];
  ai_tags?: string[];
  ai_description?: string;
  ai_confidence?: number;
  ai_processed_at?: string;
  is_featured?: boolean;
  is_published?: boolean;
  display_order?: number;
  thumbnail_path?: string;
}

export interface GalleryCollection {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  cover_image_id: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;

  // Computed fields from joins
  image_count?: number;
  cover_image_path?: string | null;
}

export interface GalleryCollectionInsert {
  name: string;
  slug: string;
  description?: string;
  cover_image_id?: string;
  is_published?: boolean;
  display_order?: number;
}

export interface GalleryCollectionImage {
  collection_id: string;
  image_id: string;
  display_order: number;
  added_at: string;
}

export interface GalleryCollectionImageInsert {
  collection_id: string;
  image_id: string;
  display_order?: number;
}

// AI Tagging Types
export interface AITagResult {
  tags: string[];
  description: string;
  confidence: number;
}

export interface AITaggingRequest {
  imageId: string;
  storagePath: string;
}

export interface AITaggingResponse {
  success: boolean;
  aiTags?: AITagResult;
  error?: string;
}

// Image Upload Types
export interface ImageUploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface BulkOperationResult {
  success: boolean;
  processed: number;
  failed: number;
  errors?: string[];
}

// Filter and Sort Types
export interface GalleryFilters {
  category?: GalleryCategory;
  tags?: string[];
  is_featured?: boolean;
  is_published?: boolean;
  search?: string;
}

export interface GallerySortOptions {
  field: 'created_at' | 'updated_at' | 'display_order' | 'file_name';
  direction: 'asc' | 'desc';
}

// Gallery Manager State Types
export interface GalleryManagerState {
  images: GalleryImage[];
  selectedImages: string[];
  filters: GalleryFilters;
  sort: GallerySortOptions;
  loading: boolean;
  error: string | null;
}

// Category Display Names
export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory, string> = {
  bridal: 'Bridal',
  editorial: 'Editorial',
  evening_glam: 'Evening Glam',
  natural_beauty: 'Natural Beauty',
  special_events: 'Special Events',
  celebrity: 'Celebrity',
  before_after: 'Before & After',
  hair_styling: 'Hair Styling',
  special_fx: 'Special FX',
};

// Helper Functions
export function getImageUrl(storagePath: string): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/gallery-images/${storagePath}`;
}

export function getThumbnailUrl(thumbnailPath: string | null): string | null {
  if (!thumbnailPath) return null;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/gallery-thumbnails/${thumbnailPath}`;
}
