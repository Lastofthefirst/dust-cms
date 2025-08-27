# StaticLeaf CMS

A production-ready, super lightweight multi-tenant CMS for managing multiple static websites. Built with Rust and SolidJS for blazing-fast performance and modern developer experience.

![StaticLeaf Homepage](https://github.com/user-attachments/assets/c016793e-69f5-4976-a239-7d11ba3093a2)

## 🚀 Quick Start

### Prerequisites

- Rust 1.70+ with Cargo
- Node.js 18+ with npm
- SQLite 3

### Installation

1. **Clone and build the project:**

```bash
git clone <repository-url>
cd dust-cms
cargo build --release
```

2. **Initialize StaticLeaf:**

```bash
./target/release/staticleaf init
```

This creates a configuration file and admin credentials. **Save the admin password displayed!**

3. **Create your first site:**

```bash
./target/release/staticleaf create-site --name "My Website"
```

Note the site password generated - provide this to your client.

4. **Start the server:**

```bash
./target/release/staticleaf-server
```

The server starts on `http://localhost:3000`

### Frontend Development

1. **Install frontend dependencies:**

```bash
cd frontend
npm install
```

2. **Start development server:**

```bash
npm run dev
```

Frontend available at `http://localhost:3001`

3. **Build for production:**

```bash
npm run build
```

## 🏗️ Architecture

StaticLeaf follows a clean, modular architecture:

```
staticleaf/
├── staticleaf-core/     # Shared library (models, auth, database)
├── staticleaf-cli/      # Command-line interface
├── staticleaf-server/   # Web server (Axum)
├── frontend/            # SolidJS frontend
└── migrations/          # Database schema
```

### Technology Stack

- **Backend**: Rust with Axum web framework
- **Frontend**: SolidJS with TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite with custom query layer
- **Authentication**: JWT with Argon2 password hashing
- **Build**: Cargo (Rust) + Vite (Frontend)

## 🔧 Configuration

Edit `config.toml`:

```toml
data_dir = "./.data"

[server]
host = "127.0.0.1"
port = 3000
cors_origins = ["http://localhost:3001"]

[database]
url = "sqlite:./.data/staticleaf.db"

[admin]
username = "admin"
password_hash = "..." # Generated automatically
```

## 📝 Usage

### CLI Commands

```bash
# Initialize new installation
staticleaf init

# Create a new site
staticleaf create-site --name "Client Site" --cover ./image.jpg

# List all sites  
staticleaf list-sites

# Start server
staticleaf serve
```

### API Endpoints

- `GET /api/sites` - List all sites
- `GET /api/sites/{slug}` - Get site details
- `POST /api/sites/{slug}/auth` - Authenticate to site
- `GET /api/sites/{slug}/schemas` - Get content schemas

### Client Workflow

1. **Access** - Visit homepage, see all available sites
2. **Login** - Click "Access Site", enter site-specific password
3. **Manage** - Access dashboard with content types and quick actions

![StaticLeaf Login](https://github.com/user-attachments/assets/04e2a41b-39a4-47fd-a5ca-cf99ed14d2b4)

![StaticLeaf Dashboard](https://github.com/user-attachments/assets/2509dcb7-ce49-420a-9851-b1fecc2518bb)

## 🎯 Features

### ✅ Implemented

- **Multi-tenant architecture** with site isolation
- **CLI management** tools for developers
- **JWT authentication** with XKCD-style passwords
- **Content schema** management with flexible field types
- **Modern UI** with SolidJS and Tailwind CSS
- **RESTful API** for all operations
- **SQLite database** with migrations
- **Secure password hashing** with Argon2
- **Responsive design** for all devices

### 🚧 Planned Features

- Content instance management (CRUD operations)
- Image upload and processing pipeline
- Rich text editor with markdown support
- Webhook integration for static site rebuilds
- Admin super-user interface
- Content export/import functionality
- File upload with optimization
- Multi-language support

## 🔒 Security

- **Argon2** password hashing with salt
- **JWT tokens** for session management
- **Tenant isolation** at database level
- **CORS** protection
- **Input validation** on all endpoints
- **No external dependencies** in production

## 🏃‍♂️ Performance

- **<50MB memory** footprint typical
- **<2 second** startup time
- **Single binary** deployment
- **SQLite** for minimal overhead
- **SolidJS** for reactive UI updates
- **Rust** for blazing-fast backend

## 📁 Directory Structure

```
.data/
├── staticleaf.db          # Main database
├── config.toml            # Configuration
└── sites/
    └── {site-slug}/
        ├── cover.jpg      # Site cover image
        └── uploads/
            ├── original/  # Original uploads
            └── optimized/ # Processed images
```

## 🛠️ Development

### Adding New Features

1. **Core logic** goes in `staticleaf-core/`
2. **API endpoints** in `staticleaf-server/`
3. **CLI commands** in `staticleaf-cli/`
4. **Frontend components** in `frontend/src/`

### Database Changes

Add new migrations to `migrations/` and update the schema in `database.rs`.

### Testing

```bash
# Test backend
cargo test

# Test frontend
cd frontend && npm test

# Integration test
cargo run --bin staticleaf init
cargo run --bin staticleaf create-site --name "Test"
cargo run --bin staticleaf-server
```

## 📦 Deployment

### Single Binary

```bash
cargo build --release
./target/release/staticleaf init
./target/release/staticleaf-server
```

### With Frontend

```bash
cd frontend && npm run build
# Serve dist/ files with your web server
# Point API calls to backend server
```

### Docker (Coming Soon)

```dockerfile
FROM rust:1.70 as builder
# Build steps...
FROM debian:bookworm-slim
# Runtime setup...
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Rust](https://rust-lang.org/) and [SolidJS](https://solidjs.com/)
- Inspired by modern headless CMS solutions
- Designed for static site generator workflows