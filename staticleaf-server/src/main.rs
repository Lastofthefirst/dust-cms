use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use serde_json::{json, Value};
use staticleaf_core::{
    config::Config,
    database::Database,
};
use std::sync::Arc;
use tower_http::cors::CorsLayer;
use tracing::{info, error};

#[derive(Clone)]
struct AppState {
    db: Arc<Database>,
    config: Arc<Config>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();
    
    let config_path = std::env::args()
        .nth(1)
        .unwrap_or_else(|| "config.toml".to_string());
    
    info!("Loading configuration from {}", config_path);
    let config = Config::load(&std::path::Path::new(&config_path))?;
    
    info!("Connecting to database: {}", config.database.url);
    let db = Database::new(&config.database.url).await?;
    
    let state = AppState {
        db: Arc::new(db),
        config: Arc::new(config.clone()),
    };
    
    let app = create_app(state);
    
    let addr = format!("{}:{}", config.server.host, config.server.port);
    info!("🚀 StaticLeaf server starting on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    axum::serve(listener, app).await?;
    
    Ok(())
}

fn create_app(state: AppState) -> Router {
    Router::new()
        .route("/", get(root))
        .route("/api/sites", get(list_sites))
        .route("/api/sites/:slug", get(get_site))
        .route("/api/sites/:slug/auth", post(authenticate))
        .route("/api/sites/:slug/schemas", get(get_schemas))
        .route("/api/sites/:slug/content/:schema", get(get_content))
        .layer(CorsLayer::permissive())
        .with_state(state)
}

async fn root() -> Json<Value> {
    Json(json!({
        "name": "StaticLeaf CMS",
        "version": "0.1.0",
        "status": "running"
    }))
}

async fn list_sites(State(state): State<AppState>) -> Result<Json<Value>, StatusCode> {
    match state.db.list_sites().await {
        Ok(sites) => {
            let sites_json: Vec<Value> = sites
                .into_iter()
                .map(|site| {
                    json!({
                        "id": site.id,
                        "name": site.name,
                        "slug": site.slug,
                        "cover_image_path": site.cover_image_path,
                        "created_at": site.created_at
                    })
                })
                .collect();
            
            Ok(Json(json!({
                "sites": sites_json
            })))
        }
        Err(e) => {
            error!("Failed to list sites: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn get_site(
    Path(slug): Path<String>,
    State(state): State<AppState>,
) -> Result<Json<Value>, StatusCode> {
    match state.db.get_site_by_slug(&slug).await {
        Ok(Some(site)) => {
            Ok(Json(json!({
                "id": site.id,
                "name": site.name,
                "slug": site.slug,
                "cover_image_path": site.cover_image_path,
                "created_at": site.created_at
            })))
        }
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(e) => {
            error!("Failed to get site: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn authenticate(
    Path(slug): Path<String>,
    State(state): State<AppState>,
    Json(payload): Json<Value>,
) -> Result<Json<Value>, StatusCode> {
    let password = payload["password"].as_str().ok_or(StatusCode::BAD_REQUEST)?;
    
    match state.db.get_site_by_slug(&slug).await {
        Ok(Some(site)) => {
            match staticleaf_core::password::verify_password(password, &site.password_hash) {
                Ok(true) => {
                    let user = staticleaf_core::models::User {
                        site_id: site.id,
                        site_name: site.name.clone(),
                        is_admin: false,
                    };
                    
                    match staticleaf_core::auth::create_token(&user) {
                        Ok(token) => {
                            Ok(Json(json!({
                                "success": true,
                                "token": token,
                                "site": {
                                    "id": site.id,
                                    "name": site.name,
                                    "slug": site.slug
                                }
                            })))
                        }
                        Err(e) => {
                            error!("Failed to create token: {}", e);
                            Err(StatusCode::INTERNAL_SERVER_ERROR)
                        }
                    }
                }
                Ok(false) => Err(StatusCode::UNAUTHORIZED),
                Err(e) => {
                    error!("Failed to verify password: {}", e);
                    Err(StatusCode::INTERNAL_SERVER_ERROR)
                }
            }
        }
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(e) => {
            error!("Failed to get site: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn get_schemas(
    Path(slug): Path<String>,
    State(state): State<AppState>,
) -> Result<Json<Value>, StatusCode> {
    match state.db.get_site_by_slug(&slug).await {
        Ok(Some(site)) => {
            match state.db.get_content_schemas_for_site(site.id).await {
                Ok(schemas) => {
                    let schemas_json: Vec<Value> = schemas
                        .into_iter()
                        .map(|schema| {
                            json!({
                                "id": schema.id,
                                "name": schema.name,
                                "slug": schema.slug,
                                "description": schema.description,
                                "fields": serde_json::from_str::<Value>(&schema.fields).unwrap_or(json!([])),
                                "max_instances": schema.max_instances
                            })
                        })
                        .collect();
                    
                    Ok(Json(json!({
                        "schemas": schemas_json
                    })))
                }
                Err(e) => {
                    error!("Failed to get schemas: {}", e);
                    Err(StatusCode::INTERNAL_SERVER_ERROR)
                }
            }
        }
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(e) => {
            error!("Failed to get site: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn get_content(
    Path((slug, schema_slug)): Path<(String, String)>,
    State(state): State<AppState>,
) -> Result<Json<Value>, StatusCode> {
    // TODO: Implement content retrieval
    Ok(Json(json!({
        "content": [],
        "schema": schema_slug
    })))
}