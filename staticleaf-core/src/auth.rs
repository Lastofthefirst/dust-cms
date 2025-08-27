use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use chrono::{Duration, Utc};
use uuid::Uuid;
use crate::models::User;

const JWT_SECRET: &[u8] = b"your-secret-key"; // In production, this should be configurable

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // subject (site_id)
    pub site_name: String,
    pub is_admin: bool,
    pub exp: i64, // expiration
    pub iat: i64, // issued at
}

impl Claims {
    pub fn new(user: &User, expires_in_hours: i64) -> Self {
        let now = Utc::now();
        Self {
            sub: user.site_id.to_string(),
            site_name: user.site_name.clone(),
            is_admin: user.is_admin,
            exp: (now + Duration::hours(expires_in_hours)).timestamp(),
            iat: now.timestamp(),
        }
    }
    
    pub fn to_user(&self) -> crate::Result<User> {
        let site_id = Uuid::parse_str(&self.sub)
            .map_err(|e| crate::StaticLeafError::Auth(format!("Invalid site ID in token: {}", e)))?;
        
        Ok(User {
            site_id,
            site_name: self.site_name.clone(),
            is_admin: self.is_admin,
        })
    }
}

pub fn create_token(user: &User) -> crate::Result<String> {
    let claims = Claims::new(user, 24); // 24 hours expiration
    
    encode(&Header::default(), &claims, &EncodingKey::from_secret(JWT_SECRET))
        .map_err(|e| crate::StaticLeafError::Auth(format!("Failed to create token: {}", e)))
}

pub fn verify_token(token: &str) -> crate::Result<User> {
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(JWT_SECRET),
        &Validation::default(),
    )
    .map_err(|e| crate::StaticLeafError::Auth(format!("Invalid token: {}", e)))?;
    
    token_data.claims.to_user()
}