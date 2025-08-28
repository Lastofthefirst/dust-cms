use thiserror::Error;

#[derive(Error, Debug)]
pub enum StaticLeafError {
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),
    
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    
    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),
    
    #[error("Configuration error: {0}")]
    Config(#[from] toml::de::Error),
    
    #[error("Configuration serialization error: {0}")]
    ConfigSerialization(#[from] toml::ser::Error),
    
    #[error("Authentication error: {0}")]
    Auth(String),
    
    #[error("Image processing error: {0}")]
    ImageProcessing(String),
    
    #[error("Site not found: {0}")]
    SiteNotFound(String),
    
    #[error("Unauthorized")]
    Unauthorized,
    
    #[error("Invalid input: {0}")]
    InvalidInput(String),
}

pub type Result<T> = std::result::Result<T, StaticLeafError>;