use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;


#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Site {
    pub id: Uuid,
    pub name: String,
    pub slug: String,
    pub password_hash: String,
    pub cover_image_path: Option<String>,
    pub config: String, // JSON-serialized SiteConfig
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SiteConfig {
    pub image_optimization: ImageOptimizationConfig,
    pub webhook_url: Option<String>,
    pub max_upload_size: u64, // bytes
    pub allowed_file_types: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImageOptimizationConfig {
    pub max_width: u32,
    pub max_height: u32,
    pub quality: u8,
    pub generate_webp: bool,
    pub generate_avif: bool,
    pub sizes: Vec<u32>, // responsive image sizes
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct ContentSchema {
    pub id: Uuid,
    pub site_id: Uuid,
    pub name: String,
    pub slug: String,
    pub description: Option<String>,
    pub fields: String, // JSON-serialized Vec<FieldDefinition>
    pub max_instances: Option<i32>, // None = unlimited, Some(0) = disabled, Some(n) = limit
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FieldDefinition {
    pub name: String,
    pub field_type: FieldType,
    pub required: bool,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "config")]
pub enum FieldType {
    Text { max_length: Option<usize> },
    RichText { max_length: Option<usize> },
    Image { aspect_ratio: Option<(u32, u32)> },
    Link,
    Number { min: Option<f64>, max: Option<f64> },
    Date,
    Boolean,
    ContentReference { schema_slug: String },
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct ContentInstance {
    pub id: Uuid,
    pub site_id: Uuid,
    pub schema_id: Uuid,
    pub data: String, // JSON-serialized HashMap<String, serde_json::Value>
    pub published: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Upload {
    pub id: Uuid,
    pub site_id: Uuid,
    pub original_filename: String,
    pub file_path: String,
    pub file_size: i64,
    pub mime_type: String,
    pub optimized_variants: String, // JSON-serialized HashMap<String, String>
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub site_id: Uuid,
    pub site_name: String,
    pub is_admin: bool,
}

impl Default for SiteConfig {
    fn default() -> Self {
        Self {
            image_optimization: ImageOptimizationConfig {
                max_width: 1920,
                max_height: 1080,
                quality: 85,
                generate_webp: true,
                generate_avif: false,
                sizes: vec![400, 800, 1200],
            },
            webhook_url: None,
            max_upload_size: 10 * 1024 * 1024, // 10MB
            allowed_file_types: vec![
                "image/jpeg".to_string(),
                "image/png".to_string(),
                "image/webp".to_string(),
            ],
        }
    }
}