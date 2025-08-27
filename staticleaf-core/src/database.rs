use sqlx::{SqlitePool, Row};
use uuid::Uuid;
use chrono::Utc;
use crate::models::*;
use crate::Result;

pub struct Database {
    pool: SqlitePool,
}

impl Database {
    pub async fn new(database_url: &str) -> Result<Self> {
        let pool = SqlitePool::connect(database_url).await?;
        
        // Run migrations manually for now
        Self::run_migrations(&pool).await?;
        
        Ok(Self { pool })
    }
    
    async fn run_migrations(pool: &SqlitePool) -> Result<()> {
        // Create tables manually for now
        sqlx::query(r#"
            CREATE TABLE IF NOT EXISTS sites (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                cover_image_path TEXT,
                config TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        "#).execute(pool).await?;
        
        sqlx::query(r#"
            CREATE TABLE IF NOT EXISTS content_schemas (
                id TEXT PRIMARY KEY,
                site_id TEXT NOT NULL,
                name TEXT NOT NULL,
                slug TEXT NOT NULL,
                description TEXT,
                fields TEXT NOT NULL,
                max_instances INTEGER,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
                UNIQUE(site_id, slug)
            )
        "#).execute(pool).await?;
        
        Ok(())
    }
    
    pub async fn create_site(&self, name: &str, slug: &str, password_hash: &str, config: &SiteConfig) -> Result<Site> {
        let id = Uuid::new_v4();
        let now = Utc::now();
        let config_json = serde_json::to_string(config)?;
        
        sqlx::query(
            "INSERT INTO sites (id, name, slug, password_hash, config, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(id.to_string())
        .bind(name)
        .bind(slug)
        .bind(password_hash)
        .bind(&config_json)
        .bind(now.to_rfc3339())
        .bind(now.to_rfc3339())
        .execute(&self.pool)
        .await?;
        
        Ok(Site {
            id,
            name: name.to_string(),
            slug: slug.to_string(),
            password_hash: password_hash.to_string(),
            cover_image_path: None,
            config: config_json,
            created_at: now,
            updated_at: now,
        })
    }
    
    pub async fn get_site_by_slug(&self, slug: &str) -> Result<Option<Site>> {
        let row = sqlx::query(
            "SELECT id, name, slug, password_hash, cover_image_path, config, created_at, updated_at FROM sites WHERE slug = ?"
        )
        .bind(slug)
        .fetch_optional(&self.pool)
        .await?;
        
        match row {
            Some(r) => {
                let id = Uuid::parse_str(&r.get::<String, _>("id")).unwrap();
                let created_at = chrono::DateTime::parse_from_rfc3339(&r.get::<String, _>("created_at")).unwrap().with_timezone(&Utc);
                let updated_at = chrono::DateTime::parse_from_rfc3339(&r.get::<String, _>("updated_at")).unwrap().with_timezone(&Utc);
                
                Ok(Some(Site {
                    id,
                    name: r.get("name"),
                    slug: r.get("slug"),
                    password_hash: r.get("password_hash"),
                    cover_image_path: r.get("cover_image_path"),
                    config: r.get("config"),
                    created_at,
                    updated_at,
                }))
            }
            None => Ok(None),
        }
    }
    
    pub async fn list_sites(&self) -> Result<Vec<Site>> {
        let rows = sqlx::query(
            "SELECT id, name, slug, password_hash, cover_image_path, config, created_at, updated_at FROM sites ORDER BY name"
        )
        .fetch_all(&self.pool)
        .await?;
        
        let sites = rows.into_iter().map(|r| {
            let id = Uuid::parse_str(&r.get::<String, _>("id")).unwrap();
            let created_at = chrono::DateTime::parse_from_rfc3339(&r.get::<String, _>("created_at")).unwrap().with_timezone(&Utc);
            let updated_at = chrono::DateTime::parse_from_rfc3339(&r.get::<String, _>("updated_at")).unwrap().with_timezone(&Utc);
            
            Site {
                id,
                name: r.get("name"),
                slug: r.get("slug"),
                password_hash: r.get("password_hash"),
                cover_image_path: r.get("cover_image_path"),
                config: r.get("config"),
                created_at,
                updated_at,
            }
        }).collect();
        
        Ok(sites)
    }
    
    pub async fn create_content_schema(&self, site_id: Uuid, name: &str, slug: &str, description: Option<&str>, fields: &[FieldDefinition], _max_instances: Option<i32>) -> Result<ContentSchema> {
        let id = Uuid::new_v4();
        let now = Utc::now();
        let fields_json = serde_json::to_string(fields)?;
        
        sqlx::query(
            "INSERT INTO content_schemas (id, site_id, name, slug, description, fields, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(id.to_string())
        .bind(site_id.to_string())
        .bind(name)
        .bind(slug)
        .bind(description)
        .bind(&fields_json)
        .bind(now.to_rfc3339())
        .bind(now.to_rfc3339())
        .execute(&self.pool)
        .await?;
        
        Ok(ContentSchema {
            id,
            site_id,
            name: name.to_string(),
            slug: slug.to_string(),
            description: description.map(|s| s.to_string()),
            fields: fields_json,
            max_instances: None,
            created_at: now,
            updated_at: now,
        })
    }
    
    pub async fn get_content_schemas_for_site(&self, site_id: Uuid) -> Result<Vec<ContentSchema>> {
        let rows = sqlx::query(
            "SELECT id, site_id, name, slug, description, fields, created_at, updated_at FROM content_schemas WHERE site_id = ? ORDER BY name"
        )
        .bind(site_id.to_string())
        .fetch_all(&self.pool)
        .await?;
        
        let schemas = rows.into_iter().map(|r| {
            let id = Uuid::parse_str(&r.get::<String, _>("id")).unwrap();
            let site_id = Uuid::parse_str(&r.get::<String, _>("site_id")).unwrap();
            let created_at = chrono::DateTime::parse_from_rfc3339(&r.get::<String, _>("created_at")).unwrap().with_timezone(&Utc);
            let updated_at = chrono::DateTime::parse_from_rfc3339(&r.get::<String, _>("updated_at")).unwrap().with_timezone(&Utc);
            
            ContentSchema {
                id,
                site_id,
                name: r.get("name"),
                slug: r.get("slug"),
                description: r.get("description"),
                fields: r.get("fields"),
                max_instances: None,
                created_at,
                updated_at,
            }
        }).collect();
        
        Ok(schemas)
    }
}