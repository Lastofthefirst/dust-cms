use clap::{Parser, Subcommand};
use staticleaf_core::{
    config::Config,
    database::Database,
    models::{SiteConfig, FieldDefinition, FieldType},
    password::{generate_password, hash_password},
};
use std::path::PathBuf;

#[derive(Parser)]
#[command(name = "staticleaf")]
#[command(about = "StaticLeaf CMS command line tool")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Initialize a new StaticLeaf installation
    Init {
        /// Directory to initialize (default: current directory)
        #[arg(short, long, default_value = ".")]
        dir: PathBuf,
    },
    /// Create a new site
    CreateSite {
        /// Site name
        #[arg(short, long)]
        name: String,
        /// Site slug (auto-generated if not provided)
        #[arg(short, long)]
        slug: Option<String>,
        /// Cover image path
        #[arg(short, long)]
        cover: Option<PathBuf>,
    },
    /// Start the server
    Serve {
        /// Configuration file path
        #[arg(short, long, default_value = "config.toml")]
        config: PathBuf,
    },
    /// List all sites
    ListSites {
        /// Configuration file path
        #[arg(short, long, default_value = "config.toml")]
        config: PathBuf,
    },
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();
    
    let cli = Cli::parse();
    
    match cli.command {
        Commands::Init { dir } => init_command(dir).await,
        Commands::CreateSite { name, slug, cover } => create_site_command(name, slug, cover).await,
        Commands::Serve { config } => serve_command(config).await,
        Commands::ListSites { config } => list_sites_command(config).await,
    }
}

async fn init_command(dir: PathBuf) -> anyhow::Result<()> {
    println!("Initializing StaticLeaf in {:?}", dir);
    
    // Create directory structure
    std::fs::create_dir_all(&dir)?;
    std::fs::create_dir_all(dir.join(".data"))?;
    std::fs::create_dir_all(dir.join(".data/sites"))?;
    
    // Generate admin password
    let admin_password = generate_password();
    let admin_hash = hash_password(&admin_password)?;
    
    // Create configuration
    let mut config = Config::default();
    config.admin.password_hash = admin_hash;
    config.data_dir = dir.join(".data");
    config.database.url = format!("sqlite:{}", dir.join(".data/staticleaf.db").to_string_lossy());
    
    // Save configuration
    let config_path = dir.join("config.toml");
    config.save(&config_path)?;
    
    // Initialize database
    let db = Database::new(&config.database.url).await?;
    
    println!("✅ StaticLeaf initialized successfully!");
    println!("📝 Configuration saved to: {:?}", config_path);
    println!("🔑 Admin password: {}", admin_password);
    println!("⚠️  Please save this password securely!");
    println!("\nTo start the server, run:");
    println!("  staticleaf serve");
    
    Ok(())
}

async fn create_site_command(name: String, slug: Option<String>, cover: Option<PathBuf>) -> anyhow::Result<()> {
    let config_path = PathBuf::from("config.toml");
    if !config_path.exists() {
        anyhow::bail!("Configuration file not found. Run 'staticleaf init' first.");
    }
    
    let config = Config::load(&config_path)?;
    let db = Database::new(&config.database.url).await?;
    
    let site_slug = slug.unwrap_or_else(|| {
        name.to_lowercase()
            .replace(' ', "-")
            .chars()
            .filter(|c| c.is_alphanumeric() || *c == '-')
            .collect()
    });
    
    // Generate site password
    let site_password = generate_password();
    let password_hash = hash_password(&site_password)?;
    
    // Create site directory
    let site_dir = config.data_dir.join("sites").join(&site_slug);
    std::fs::create_dir_all(&site_dir)?;
    std::fs::create_dir_all(site_dir.join("uploads/original"))?;
    std::fs::create_dir_all(site_dir.join("uploads/optimized"))?;
    
    // Copy cover image if provided
    let cover_path = if let Some(cover_src) = cover {
        let cover_dest = site_dir.join("cover.jpg");
        std::fs::copy(&cover_src, &cover_dest)?;
        Some(cover_dest.to_string_lossy().to_string())
    } else {
        None
    };
    
    // Create site in database
    let site_config = SiteConfig::default();
    let site = db.create_site(&name, &site_slug, &password_hash, &site_config).await?;
    
    // Create a basic page schema as an example
    let page_fields = vec![
        FieldDefinition {
            name: "title".to_string(),
            field_type: FieldType::Text { max_length: Some(100) },
            required: true,
            description: Some("Page title".to_string()),
        },
        FieldDefinition {
            name: "content".to_string(),
            field_type: FieldType::RichText { max_length: None },
            required: false,
            description: Some("Page content".to_string()),
        },
        FieldDefinition {
            name: "featured_image".to_string(),
            field_type: FieldType::Image { aspect_ratio: Some((16, 9)) },
            required: false,
            description: Some("Featured image".to_string()),
        },
    ];
    
    db.create_content_schema(
        site.id,
        "Page",
        "page",
        Some("Website pages"),
        &page_fields,
        None, // unlimited
    ).await?;
    
    println!("✅ Site '{}' created successfully!", name);
    println!("🔗 Site slug: {}", site_slug);
    println!("🔑 Site password: {}", site_password);
    println!("📁 Site directory: {:?}", site_dir);
    if let Some(cover) = cover_path {
        println!("🖼️  Cover image: {}", cover);
    }
    println!("⚠️  Please save the password securely and provide it to your client!");
    
    Ok(())
}

async fn serve_command(config_path: PathBuf) -> anyhow::Result<()> {
    if !config_path.exists() {
        anyhow::bail!("Configuration file not found. Run 'staticleaf init' first.");
    }
    
    println!("🚀 Starting StaticLeaf server...");
    println!("📝 Config: {:?}", config_path);
    
    // This will be implemented in the server binary
    println!("⚠️  Server implementation will be available in staticleaf-server");
    println!("Use: cargo run --bin staticleaf-server");
    
    Ok(())
}

async fn list_sites_command(config_path: PathBuf) -> anyhow::Result<()> {
    if !config_path.exists() {
        anyhow::bail!("Configuration file not found. Run 'staticleaf init' first.");
    }
    
    let config = Config::load(&config_path)?;
    let db = Database::new(&config.database.url).await?;
    
    let sites = db.list_sites().await?;
    
    if sites.is_empty() {
        println!("No sites found. Create a site with 'staticleaf create-site --name \"Site Name\"'");
    } else {
        println!("Sites:");
        for site in sites {
            println!("  {} ({})", site.name, site.slug);
        }
    }
    
    Ok(())
}