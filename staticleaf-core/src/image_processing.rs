use image::{DynamicImage, GenericImageView};
use std::path::Path;
use std::collections::HashMap;
use crate::models::ImageOptimizationConfig;
use crate::{Result, StaticLeafError};

pub struct ImageProcessor {
    config: ImageOptimizationConfig,
}

impl ImageProcessor {
    pub fn new(config: ImageOptimizationConfig) -> Self {
        Self { config }
    }
    
    pub async fn process_image(
        &self,
        input_path: &Path,
        output_dir: &Path,
        filename_base: &str,
    ) -> Result<HashMap<String, String>> {
        let img = image::open(input_path)
            .map_err(|e| StaticLeafError::ImageProcessing(format!("Failed to open image: {}", e)))?;
        
        // Ensure output directory exists
        std::fs::create_dir_all(output_dir)?;
        
        let mut variants = HashMap::new();
        
        // Process different sizes
        for &size in &self.config.sizes {
            let resized = self.resize_image(&img, size)?;
            
            // Save as WebP if enabled
            if self.config.generate_webp {
                let webp_path = output_dir.join(format!("{}_{}.webp", filename_base, size));
                self.save_as_webp(&resized, &webp_path)?;
                variants.insert(format!("{}w_webp", size), webp_path.to_string_lossy().to_string());
            }
            
            // Save as JPEG
            let jpeg_path = output_dir.join(format!("{}_{}.jpg", filename_base, size));
            self.save_as_jpeg(&resized, &jpeg_path)?;
            variants.insert(format!("{}w_jpeg", size), jpeg_path.to_string_lossy().to_string());
        }
        
        // Save original size with optimization
        let original_resized = self.resize_to_max(&img)?;
        
        if self.config.generate_webp {
            let webp_path = output_dir.join(format!("{}_original.webp", filename_base));
            self.save_as_webp(&original_resized, &webp_path)?;
            variants.insert("original_webp".to_string(), webp_path.to_string_lossy().to_string());
        }
        
        let jpeg_path = output_dir.join(format!("{}_original.jpg", filename_base));
        self.save_as_jpeg(&original_resized, &jpeg_path)?;
        variants.insert("original_jpeg".to_string(), jpeg_path.to_string_lossy().to_string());
        
        Ok(variants)
    }
    
    pub fn crop_image(&self, input_path: &Path, output_path: &Path, x: u32, y: u32, width: u32, height: u32) -> Result<()> {
        let img = image::open(input_path)
            .map_err(|e| StaticLeafError::ImageProcessing(format!("Failed to open image: {}", e)))?;
        
        let cropped = img.crop_imm(x, y, width, height);
        
        // Ensure output directory exists
        if let Some(parent) = output_path.parent() {
            std::fs::create_dir_all(parent)?;
        }
        
        cropped.save(output_path)
            .map_err(|e| StaticLeafError::ImageProcessing(format!("Failed to save cropped image: {}", e)))?;
        
        Ok(())
    }
    
    fn resize_image(&self, img: &DynamicImage, target_width: u32) -> Result<DynamicImage> {
        let (orig_width, orig_height) = img.dimensions();
        
        if orig_width <= target_width {
            return Ok(img.clone());
        }
        
        let target_height = (orig_height * target_width) / orig_width;
        
        Ok(img.resize(target_width, target_height, image::imageops::FilterType::Lanczos3))
    }
    
    fn resize_to_max(&self, img: &DynamicImage) -> Result<DynamicImage> {
        let (orig_width, orig_height) = img.dimensions();
        
        if orig_width <= self.config.max_width && orig_height <= self.config.max_height {
            return Ok(img.clone());
        }
        
        let width_ratio = self.config.max_width as f32 / orig_width as f32;
        let height_ratio = self.config.max_height as f32 / orig_height as f32;
        let ratio = width_ratio.min(height_ratio);
        
        let new_width = (orig_width as f32 * ratio) as u32;
        let new_height = (orig_height as f32 * ratio) as u32;
        
        Ok(img.resize(new_width, new_height, image::imageops::FilterType::Lanczos3))
    }
    
    fn save_as_jpeg(&self, img: &DynamicImage, path: &Path) -> Result<()> {
        use image::codecs::jpeg::JpegEncoder;
        use std::fs::File;
        
        let file = File::create(path)?;
        let encoder = JpegEncoder::new_with_quality(file, self.config.quality);
        
        img.write_with_encoder(encoder)
            .map_err(|e| StaticLeafError::ImageProcessing(format!("Failed to save JPEG: {}", e)))
    }
    
    fn save_as_webp(&self, img: &DynamicImage, path: &Path) -> Result<()> {
        // For WebP support, we'll use the webp crate
        // This is a simplified implementation
        let rgb_img = img.to_rgb8();
        let (width, height) = img.dimensions();
        
        let encoder = webp::Encoder::from_rgb(&rgb_img, width, height);
        let encoded_webp = encoder.encode(self.config.quality as f32);
        
        std::fs::write(path, &*encoded_webp)?;
        
        Ok(())
    }
}