import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image buffer to Cloudinary
 * @param imageBuffer - The image buffer to upload
 * @param options - Upload options
 * @returns Cloudinary upload result with secure_url
 */
export async function uploadToCloudinary(
  imageBuffer: Buffer,
  options: {
    folder?: string;
    publicId?: string;
  } = {}
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'saas-showcase',
        public_id: options.publicId,
        resource_type: 'image',
        format: 'jpg',
        transformation: [
          {
            quality: 'auto:good',
            fetch_format: 'auto',
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } else {
          reject(new Error('Upload failed with no result'));
        }
      }
    );

    uploadStream.end(imageBuffer);
  });
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to delete from Cloudinary:', error);
    throw error;
  }
}

/**
 * Generate optimized Cloudinary URL with transformations
 * @param url - Original Cloudinary URL
 * @param options - Transformation options
 */
export function getOptimizedUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
    crop?: string;
  } = {}
): string {
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  const params = [];
  
  // Add width and height if provided
  if (options.width) params.push(`w_${options.width}`);
  if (options.height) params.push(`h_${options.height}`);
  
  // Add crop mode (default to scale to fit within dimensions)
  if (options.crop) {
    params.push(`c_${options.crop}`);
  } else if (options.width || options.height) {
    params.push('c_limit'); // Prevent upscaling
  }
  
  // Add quality (default to auto if not provided)
  if (options.quality) {
    params.push(`q_${options.quality}`);
  } else {
    params.push('q_auto:good');
  }
  
  // Add format (default to auto/webp if not provided)
  if (options.format) {
    params.push(`f_${options.format}`);
  } else {
    params.push('f_auto');
  }
  
  // Add DPR auto for responsive images
  params.push('dpr_auto');

  const transformation = params.join(',');
  return url.replace('/upload/', `/upload/${transformation}/`);
}

export { cloudinary };



