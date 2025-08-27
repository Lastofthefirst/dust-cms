# **StaticLeaf CMS: Unified Description**

## **Overview**
StaticLeaf is a self-contained, high-performance multi-tenant CMS designed specifically for developers managing multiple static websites. It provides a secure, structured editing environment for clients while maintaining full developer control over content structure and presentation.

## **Core Architecture**
- **Backend**: Rust (Axum/Actix Web) for blazing-fast performance and memory safety
- **Frontend**: SolidJS with fine-grained reactivity for instant UI updates
- **Styling**: Tailwind CSS 4 for utility-first, responsive design
- **Database**: Embedded SQLite with tenant isolation
- **Storage**: Local filesystem with organized tenant directories
- **Deployment**: Single binary with embedded assets

## **Key Features**

### **Multi-Tenant Management**
- Site-centric authentication (one password per client site)
- Visual site identification with cover images
- Admin super-user access across all sites
- Complete data isolation between tenants

### **Structured Content Modeling**
- Admin-defined content schemas with field validation
- Configurable content limits (0, 1, or unlimited instances)
- Support for various field types:
  - Text with character limits
  - Rich text/Markdown
  - Images with aspect ratio enforcement
  - Links, numbers, dates, booleans
  - Content references

### **Advanced Image Handling**
- Client-side cropping with aspect ratio locking
- Server-side optimization pipeline:
  - Configurable maximum dimensions
  - Quality compression settings
  - Modern format conversion (WebP/AVIF)
  - Metadata stripping
  - Multiple size generation for responsive images
- Built-in optimization settings per site

### **Authentication & Security**
- XKCD-style password generation ("correct-horse-battery-staple")
- Argon2 password hashing
- JWT-based session management
- HTTP security headers
- Tenant-level data isolation

### **Developer Experience**
- CLI tool for management:
  ```bash
  staticleaf init
  staticleaf create-site --name "Client Name"
  staticleaf serve
  ```
- Single configuration file (TOML)
- Easy backups (whole directory structure)
- Webhook integration for static site rebuilds

## **Workflow**

### **For Developers (Admins)**
1. Create site with cover image and content schemas
2. Generate secure passphrase for client
3. Optionally populate initial content
4. Provide credentials and documentation to client
5. Monitor and assist through super-editor access

### **For Clients (Editors)**
1. Login with provided credentials
2. View familiar cover image for context confirmation
3. Edit content within predefined boundaries
4. Upload images with guided cropping
5. Publish changes triggering site rebuild

## **Technical Implementation**

### **Image Optimization Pipeline**
```rust
// Rust-based processing example
async fn process_image(upload: Upload, config: &SiteConfig) -> Result<OptimizedImage> {
    // Validate aspect ratio
    // Crop to required dimensions
    // Resize to configured maximums
    // Convert to optimal format
    // Apply quality settings
    // Generate multiple sizes
    // Store optimized versions
}
```

### **Data Structure**
```
.data/
  staticleaf.db
  config.toml
  sites/
    site-1-client/
      cover.jpg
      schemas.json
      uploads/
        original/
        optimized/
          1200w.webp
          800w.webp
          400w.webp
```

## **Performance Characteristics**
- Minimal memory footprint (<50MB typical)
- Fast startup time (<2 seconds)
- Efficient image processing with Rust parallelism
- Instant UI updates with SolidJS reactivity
- Low bandwidth usage with optimized assets

## **Use Cases**
- Agencies managing multiple client sites
- Developers maintaining several static sites
- Content-heavy static sites with frequent updates
- Projects requiring strict content structure enforcement
- Environments where external dependencies are undesirable

StaticLeaf combines the performance of Rust with the modernity of SolidJS to create a professional-grade CMS that remains simple to deploy and manage, making it ideal for developers who value both power and simplicity.

![StaticLeaf Architecture](https://via.placeholder.com/800x400?text=StaticLeaf+Architecture+Diagram)
